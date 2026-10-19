import api, { USE_MOCK } from "./api";
import { tickets } from "@/mocks/tickets";
import { DEPARTMENTS, AGENTS } from "@/mocks/directory";
import { ROUTING_POLICY, PRIORITIES, STATUS_TRANSITIONS } from "@/constants";
import { ticketCode } from "@/utils/format";
import type { HistoryType, PublicTicketInput, Priority, Status, Ticket, TicketSummary, User } from "@/types";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));
const clone = <T,>(t: T): T => JSON.parse(JSON.stringify(t)) as T;
const now = () => new Date().toISOString();
const summary = ({ messages: _m, history: _h, ai: _a, ...t }: Ticket): TicketSummary => t;
const inScope = (a: User, t: Ticket) => t.assignedAgentId === a.id || t.departmentId === a.department?.id || !!a.permissions?.crossDepartment;
const log = (t: Ticket, actor: string, type: HistoryType, text: string) => { t.history.push({ id: Date.now() + Math.random(), type, actor, text, at: now() }); t.updatedAt = now(); };
const scoped = (id: number | string, a: User): Ticket => {
  const t = tickets.find((x) => x.id === Number(id));
  if (!t || !inScope(a, t)) throw new Error("Ticket not found.");
  return t;
};

export interface TicketsApi {
  /** Public, unauthenticated: used by the Contact Us form. The server must validate, rate-limit and ignore any client-supplied priority/department. */
  createPublic(input: PublicTicketInput): Promise<{ id: number; reference: string }>;
  listAssigned(agent: User): Promise<TicketSummary[]>;
  listScoped(agent: User): Promise<TicketSummary[]>;
  getAgent(id: number | string, agent: User): Promise<Ticket>;
  setPriority(id: number, value: Priority, agent: User): Promise<Ticket>;
  setStatus(id: number, value: Status, agent: User): Promise<Ticket>;
  assign(id: number, p: { departmentId?: number; agentId?: number | null }, agent: User): Promise<Ticket>;
  addAgentMessage(id: number, p: { body: string; internal: boolean }, agent: User): Promise<Ticket>;
}

// The mock enforces the same rules the Express API must enforce.
const mock: TicketsApi = {
  async createPublic({ name, email, category, subject, message, website }) {
    await delay(700);
    if (website) return { id: 0, reference: "TKT-0000" }; // honeypot filled: pretend success, create nothing
    const d = DEPARTMENTS.find((x) => x.name === (ROUTING_POLICY[category] ?? "General Support"))!;
    const id = Math.max(...tickets.map((x) => x.id)) + 1;
    tickets.push({
      id, subject, description: message, category, priority: null, status: "Open",
      customerName: name, customerEmail: email.toLowerCase(),
      departmentId: d.id, department: d.name, assignedAgentId: null, assignedAgent: null,
      createdAt: now(), updatedAt: now(), tags: [], ai: null,
      messages: [{ id: Date.now(), sender: name, role: "customer", body: message, internal: false, createdAt: now() }],
      history: [{ id: Date.now() + 1, type: "created", actor: name, text: "Ticket created from the website contact form", at: now() }],
    });
    return { id, reference: ticketCode(id) };
  },
  async listAssigned(a) { await delay(); return tickets.filter((t) => t.assignedAgentId === a.id).map(summary); },
  async listScoped(a) { await delay(); return tickets.filter((t) => inScope(a, t)).map(summary); },
  async getAgent(id, a) { await delay(); return clone(scoped(id, a)); },
  async setPriority(id, value, a) {
    await delay(600);
    const t = scoped(id, a);
    if (!PRIORITIES.includes(value)) throw new Error("Invalid priority.");
    log(t, a.name, "priority", `Priority changed from ${t.priority ?? "Unset"} to ${value}`);
    t.priority = value;
    return clone(t);
  },
  async setStatus(id, value, a) {
    await delay(600);
    const t = scoped(id, a);
    if (!STATUS_TRANSITIONS[t.status].includes(value)) throw new Error(`Cannot move from ${t.status} to ${value}.`);
    log(t, a.name, "status", `Status changed from ${t.status} to ${value}`);
    t.status = value;
    return clone(t);
  },
  async assign(id, { departmentId, agentId }, a) {
    await delay(600);
    const t = scoped(id, a);
    if (!a.permissions?.canAssign) throw new Error("You are not authorized to assign tickets.");
    if (departmentId !== undefined) {
      const d = DEPARTMENTS.find((x) => x.id === departmentId && x.isActive);
      if (!d || !(a.permissions.crossDepartment || d.id === a.department?.id)) throw new Error("You cannot move tickets to that department.");
      log(t, a.name, "department", `Department changed from ${t.department} to ${d.name}`);
      t.departmentId = d.id; t.department = d.name;
      if (t.assignedAgentId && AGENTS.find((x) => x.id === t.assignedAgentId)?.departmentId !== d.id) {
        log(t, "System", "assignment", `Unassigned ${t.assignedAgent} (different department)`);
        t.assignedAgentId = null; t.assignedAgent = null;
      }
    }
    if (agentId !== undefined) {
      if (!agentId) { log(t, a.name, "assignment", "Ticket unassigned"); t.assignedAgentId = null; t.assignedAgent = null; }
      else {
        const ag = AGENTS.find((x) => x.id === agentId && x.isActive && x.departmentId === t.departmentId);
        if (!ag) throw new Error("That agent does not belong to this department.");
        log(t, a.name, "assignment", `Assigned to ${ag.name}`);
        t.assignedAgentId = ag.id; t.assignedAgent = ag.name;
      }
    }
    return clone(t);
  },
  async addAgentMessage(id, { body, internal }, a) {
    await delay(500);
    const t = scoped(id, a);
    t.messages.push({ id: Date.now(), sender: a.name, role: "agent", body, internal, createdAt: now() });
    log(t, a.name, internal ? "note" : "reply", internal ? "Internal note added" : "Agent replied");
    return clone(t);
  },
};

const tk = (r: { data: { ticket: Ticket } }) => r.data.ticket;
const real: TicketsApi = {
  createPublic: (p) => api.post<{ ticket: { id: number } }>("/tickets/public", p).then((r) => ({ id: r.data.ticket.id, reference: ticketCode(r.data.ticket.id) })),
  listAssigned: () => api.get<{ tickets: TicketSummary[] }>("/tickets/assigned").then((r) => r.data.tickets),
  listScoped: () => api.get<{ tickets: TicketSummary[] }>("/tickets").then((r) => r.data.tickets),
  getAgent: (id) => api.get<{ ticket: Ticket }>(`/tickets/${id}`).then(tk),
  setPriority: (id, priority) => api.patch<{ ticket: Ticket }>(`/tickets/${id}/priority`, { priority }).then(tk),
  setStatus: (id, status) => api.patch<{ ticket: Ticket }>(`/tickets/${id}/status`, { status }).then(tk),
  assign: (id, p) => api.patch<{ ticket: Ticket }>(`/tickets/${id}/assignment`, p).then(tk),
  addAgentMessage: (id, p) => api.post<{ ticket: Ticket }>(`/tickets/${id}/messages`, p).then(tk),
};

export const ticketsService: TicketsApi = USE_MOCK ? mock : real;
