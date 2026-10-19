// MOCK ONLY
import type { Agent, Department } from "@/types";

export const DEPARTMENTS: Department[] = [
  { id: 1, name: "Technical Support", description: "Product and technical issues", isActive: true },
  { id: 2, name: "Billing and Payments", description: "Invoices, payments, refunds", isActive: true },
  { id: 3, name: "Account and Access", description: "Login and account problems", isActive: true },
  { id: 4, name: "General Support", description: "Everything else", isActive: true },
];
export const AGENTS: Agent[] = [
  { id: 2, name: "Arjun Das", email: "agent@supportiq.dev", role: "agent", departmentId: 1, isActive: true },
  { id: 6, name: "Meera Nair", email: "meera@supportiq.dev", role: "agent", departmentId: 2, isActive: true },
  { id: 7, name: "Kabir Rao", email: "kabir@supportiq.dev", role: "agent", departmentId: 3, isActive: true },
  { id: 8, name: "Sana Iyer", email: "sana@supportiq.dev", role: "agent", departmentId: 4, isActive: true },
];
export const CUSTOMERS: Record<number, { name: string; email: string }> = {
  1: { name: "Riya Sen", email: "customer@supportiq.dev" },
  3: { name: "Sameer Gupta", email: "sameer@example.com" },
  4: { name: "Ananya Roy", email: "ananya@example.com" },
  5: { name: "Vikram Shah", email: "vikram@example.com" },
};
