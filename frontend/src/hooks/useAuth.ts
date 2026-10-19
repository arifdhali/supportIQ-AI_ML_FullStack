import { useContext } from "react";
import { AuthContext, type AuthValue } from "@/app/AuthContext";
import type { User } from "@/types";

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

 export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error("useUser called without an authenticated user");
  return user;
}
