import api, { USE_MOCK } from "./api";
import { DEPARTMENTS, AGENTS } from "@/mocks/directory";
import type { Agent, Department, User } from "@/types";

const delay = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms));
const allowed = (u: User, id: number) => !!u.permissions?.crossDepartment || u.department?.id === id;

export interface DepartmentsApi {
  list(user: User): Promise<Department[]>;
  agentsOf(deptId: number, user: User): Promise<Agent[]>;
}

const mock: DepartmentsApi = {
  async list(user) { await delay(); return DEPARTMENTS.filter((d) => d.isActive && allowed(user, d.id)); },
  async agentsOf(deptId, user) {
    await delay();
    return allowed(user, deptId) ? AGENTS.filter((a) => a.departmentId === deptId && a.isActive) : [];
  },
};
const real: DepartmentsApi = {
  list: () => api.get<{ departments: Department[] }>("/departments").then((r) => r.data.departments),
  agentsOf: (id) => api.get<{ agents: Agent[] }>(`/departments/${id}/agents`).then((r) => r.data.agents),
};
export const departmentsService: DepartmentsApi = USE_MOCK ? mock : real;
