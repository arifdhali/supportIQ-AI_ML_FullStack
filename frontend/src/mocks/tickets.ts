// MOCK ONLY. In-memory store, resets on reload.
import { DEPARTMENTS, AGENTS, CUSTOMERS } from "./directory";
import { ROUTING_POLICY } from "@/constants";
import type { Category, Priority, Status, Ticket } from "@/types";

const ago = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

// [subject, description, category, priority, status, customerId, agentId, createdHoursAgo, updatedHoursAgo]
type Seed = [string, string, Category, Priority | null, Status, number, number | null, number, number];
const seeds: Seed[] = [
  ["Cannot log in after password reset", "Reset email arrived but the new password is rejected.", "Account Access", "High", "In Progress", 1, 2, 30, 2],
  ["Charged twice for March invoice", "I see two identical charges on my card.", "Payment Issue", "Medium", "Waiting for Customer", 1, 6, 80, 20],
  ["Dashboard export fails", "CSV export spins forever.", "Technical Issue", "Low", "Resolved", 1, 2, 200, 3],
  ["App crashes on file upload", "Uploading a 20MB PDF closes the app immediately.", "Technical Issue", "High", "Open", 3, 2, 5, 5],
  ["Refund not received", "My refund was approved 10 days ago but nothing arrived.", "Refund Request", null, "Open", 4, null, 3, 3],
  ["Need invoice in company name", "Please reissue invoice 2231 with our company name.", "Payment Issue", "Low", "In Progress", 5, 6, 50, 30],
  ["API returns 500 on search", "Search endpoint fails for queries longer than 50 characters.", "Technical Issue", "Medium", "In Progress", 4, 2, 12, 6],
  ["How do I change my plan?", "Where can I upgrade from Basic to Pro?", "General Inquiry", "Low", "Open", 3, 8, 9, 9],
  ["Two-factor code not arriving", "SMS codes never arrive on my number.", "Account Access", null, "Open", 5, 7, 7, 7],
  ["Webhook delivery delays", "Webhooks arrive 10+ minutes late since Monday.", "Technical Issue", "High", "Waiting for Customer", 5, 2, 40, 14],
  ["Update billing address", "Please change my billing address to the new office.", "Payment Issue", "Low", "Resolved", 3, 6, 150, 120],
  ["Feature request: dark mode", "Would love a dark theme for night shifts.", "General Inquiry", "Low", "Closed", 4, 8, 300, 250],
];

export const tickets: Ticket[] = seeds.map(([subject, description, category, priority, status, cid, aid, c, u], i) => {
  const id = i + 1;
  const d = DEPARTMENTS.find((x) => x.name === ROUTING_POLICY[category])!;
  const a = AGENTS.find((x) => x.id === aid);
  const cust = CUSTOMERS[cid];
  const t: Ticket = {
    id, subject, description, category, priority, status,
    customerName: cust.name, customerEmail: cust.email,
    departmentId: d.id, department: d.name, assignedAgentId: a?.id ?? null, assignedAgent: a?.name ?? null,
    createdAt: ago(c), updatedAt: ago(u), tags: [],
    messages: [{ id: id * 100, sender: cust.name, role: "customer", body: description, internal: false, createdAt: ago(c) }],
    history: [{ id: id * 100, type: "created", actor: cust.name, text: "Ticket created", at: ago(c) }],
    ai: null,
  };
  if (a) t.history.push({ id: id * 100 + 1, type: "assignment", actor: "System", text: `Assigned to ${a.name}`, at: ago(c - 0.2) });
  return t;
});

tickets[0].messages.push(
  { id: 101, sender: "Arjun Das", role: "agent", body: "Thanks Riya, we are checking your account lock status.", internal: false, createdAt: ago(2) },
  { id: 102, sender: "Arjun Das", role: "agent", body: "Account locked by rate limiter. Unlock manually.", internal: true, createdAt: ago(2) }
);
tickets[0].history.push({ id: 103, type: "priority", actor: "Arjun Das", text: "Priority changed from Medium to High", at: ago(2) });

// Sample AI output for demo only (flagged mock: true). Real values come from the FastAPI service.
tickets[0].ai = { mock: true, priority: "High", category: "Account Access", sentiment: "Frustrated", confidence: null,
  summary: "Customer cannot sign in after resetting their password.", suggestedResponse: "Hi Riya, we have unlocked your account. Please try signing in again with your new password." };
tickets[3].ai = { mock: true, priority: "High", category: "Technical Issue", sentiment: "Neutral", confidence: null,
  summary: "App crashes when uploading large PDF files.", suggestedResponse: "Thanks for reporting this. Could you share your app version and the exact file size?" };
tickets[4].ai = { mock: true, priority: "High", category: "Refund Request", sentiment: "Negative", confidence: null,
  summary: "Approved refund has not reached the customer after 10 days.", suggestedResponse: "We are sorry for the delay. We are checking the refund status with payments now." };
