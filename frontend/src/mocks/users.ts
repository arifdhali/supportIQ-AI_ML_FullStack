// MOCK ONLY - staff accounts used when VITE_USE_MOCK=true
import type { MockUser } from "@/types";

export const MOCK_USERS: MockUser[] = [
  { id: 2, name: "Arjun Das", email: "agent@supportiq.dev", password: "Agent@1234", role: "agent",
    department: { id: 1, name: "Technical Support" }, permissions: { crossDepartment: false, canAssign: true }, preferences: {} },
  { id: 6, name: "Meera Nair", email: "meera@supportiq.dev", password: "Agent@1234", role: "agent",
    department: { id: 2, name: "Billing and Payments" }, permissions: { crossDepartment: true, canAssign: true }, preferences: {} },
];
