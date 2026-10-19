export type Priority = "Low" | "Medium" | "High";
export type Status = "Open" | "In Progress" | "Waiting for Customer" | "Resolved" | "Closed";
export type Category = "Technical Issue" | "Payment Issue" | "Account Access" | "Refund Request" | "General Inquiry";

export interface Department { id: number; name: string; description: string; isActive: boolean }
export interface Agent { id: number; name: string; email: string; role: "agent"; departmentId: number; isActive: boolean }
export type Preferences = Record<string, boolean>;

// Only support staff have accounts. Customers use the public website and never log in.
export interface User {
  id: number; name: string; email: string; role: "agent";
  department?: { id: number; name: string };
  permissions?: { crossDepartment: boolean; canAssign: boolean };
  preferences: Preferences;
}
export type MockUser = User & { password: string };

export type Sender = "customer" | "agent";
export interface Message { id: number; sender: string; role: Sender; body: string; internal: boolean; createdAt: string }
export type HistoryType = "created" | "priority" | "status" | "department" | "assignment" | "reply" | "note";
export interface HistoryEntry { id: number; type: HistoryType; actor: string; text: string; at: string }

export interface AIAnalysis {
  mock?: boolean; priority: Priority | null; category: string | null; sentiment: string | null;
  confidence: number | null; summary: string | null; suggestedResponse: string | null;
}

export interface TicketSummary {
  id: number; subject: string; description: string; category: Category;
  priority: Priority | null; status: Status;
  customerName: string; customerEmail: string;
  departmentId: number; department: string;
  assignedAgentId: number | null; assignedAgent: string | null;
  createdAt: string; updatedAt: string; tags: string[];
}
export interface Ticket extends TicketSummary { messages: Message[]; history: HistoryEntry[]; ai: AIAnalysis | null }

// Submitted from the public Contact Us form (no account). `website` is a honeypot field for bots.
export interface PublicTicketInput { name: string; email: string; category: Category; subject: string; message: string; website?: string }
export interface Credentials { email: string; password: string; remember?: boolean }
