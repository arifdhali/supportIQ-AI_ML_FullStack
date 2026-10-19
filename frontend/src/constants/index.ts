import { Inbox, LayoutDashboard, Settings, UserCheck, type LucideIcon } from "lucide-react";
import type { Category, Priority, Status } from "@/types";

export const AGENT_HOME = "/agent/dashboard";

export const PRIORITIES: readonly Priority[] = ["Low", "Medium", "High"];
export const STATUSES: readonly Status[] = ["Open", "In Progress", "Waiting for Customer", "Resolved", "Closed"];
export const CATEGORIES: readonly Category[] = ["Technical Issue", "Payment Issue", "Account Access", "Refund Request", "General Inquiry"];

export const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-blue-50 text-blue-700 border-blue-200",
};
export const STATUS_STYLES: Record<Status, string> = {
  Open: "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-violet-50 text-violet-700 border-violet-200",
  "Waiting for Customer": "bg-amber-50 text-amber-700 border-amber-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
};

// Configurable routing policy: category -> default department name
export const ROUTING_POLICY: Record<Category, string> = {
  "Technical Issue": "Technical Support",
  "Payment Issue": "Billing and Payments",
  "Refund Request": "Billing and Payments",
  "Account Access": "Account and Access",
  "General Inquiry": "General Support",
};

export const STATUS_TRANSITIONS: Record<Status, readonly Status[]> = {
  Open: ["In Progress", "Waiting for Customer", "Resolved", "Closed"],
  "In Progress": ["Open", "Waiting for Customer", "Resolved"],
  "Waiting for Customer": ["Open", "In Progress", "Resolved", "Closed"],
  Resolved: ["Open", "Closed"],
  Closed: ["Open"],
};

export interface NavItem { to: string; label: string; icon: LucideIcon }
export const NAV: NavItem[] = [
  { to: "/agent/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/agent/my-tickets", label: "My Tickets", icon: UserCheck },
  { to: "/agent/tickets", label: "All Tickets", icon: Inbox },
  { to: "/agent/settings", label: "Settings", icon: Settings },
];
