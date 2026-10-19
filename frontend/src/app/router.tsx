import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import PublicLayout from "@/components/layout/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import ContactPage from "@/pages/public/ContactPage";
import LoginPage from "@/pages/auth/LoginPage";
import AgentDashboard from "@/pages/agent/AgentDashboard";
import AgentTicketsPage from "@/pages/agent/AgentTicketsPage";
import AgentTicketDetail from "@/pages/agent/AgentTicketDetail";
import SettingsPage from "@/pages/common/SettingsPage";

export const router = createBrowserRouter([
  // Public website (customers never log in)
  {
    element: <PublicLayout />, children: [
      { path: "/", element: <HomePage /> },
      { path: "/contact", element: <ContactPage /> },
    ]
  },
  // Staff area
  { element: <PublicOnlyRoute />, children: [{ path: "/login", element: <LoginPage /> }] },
  {
    element: <ProtectedRoute />, children: [{
      path: "/agent", element: <AppShell />, children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <AgentDashboard /> },
        { path: "my-tickets", element: <AgentTicketsPage key="mine" mode="mine" /> },
        { path: "tickets", element: <AgentTicketsPage key="all" mode="all" /> },
        { path: "tickets/:ticketId", element: <AgentTicketDetail /> },
        { path: "settings", element: <SettingsPage /> },
      ]
    }]
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
