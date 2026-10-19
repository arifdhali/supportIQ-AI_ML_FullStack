import api, { USE_MOCK } from "./api";
import { MOCK_USERS } from "@/mocks/users";
import type { Credentials, MockUser, Preferences, User } from "@/types";

const KEY = "supportiq_mock_session";
const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));
const strip = ({ password: _p, ...u }: MockUser): User => u;
const byId = (id: number): MockUser => {
  const u = MOCK_USERS.find((x) => x.id === id);
  if (!u) throw new Error("Not authenticated");
  return u;
};

// Staff-only authentication. Staff accounts are provisioned by an administrator, never self-registered.
export interface AuthApi {
  login(c: Credentials): Promise<User>;
  me(): Promise<User>;
  logout(): Promise<void>;
  updateProfile(uid: number, d: { name: string; email: string }): Promise<User>;
  changePassword(uid: number, d: { current: string; next: string }): Promise<void>;
  savePreferences(uid: number, p: Preferences): Promise<User>;
}

const mock: AuthApi = {
  async login({ email, password }) {
    await delay();
    const u = MOCK_USERS.find((x) => x.email === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Invalid email or password.");
    localStorage.setItem(KEY, String(u.id));
    return strip(u);
  },
  async me() { return strip(byId(Number(localStorage.getItem(KEY)))); },
  async logout() { localStorage.removeItem(KEY); },
  async updateProfile(uid, { name, email }) {
    await delay();
    if (MOCK_USERS.some((x) => x.id !== uid && x.email === email.toLowerCase())) throw new Error("Email already in use.");
    const u = byId(uid);
    Object.assign(u, { name, email: email.toLowerCase() });
    return strip(u);
  },
  async changePassword(uid, { current, next }) {
    await delay();
    const u = byId(uid);
    if (u.password !== current) throw new Error("Current password is incorrect.");
    u.password = next;
  },
  async savePreferences(uid, prefs) {
    await delay(300);
    const u = byId(uid);
    u.preferences = { ...u.preferences, ...prefs };
    return strip(u);
  },
};

const real: AuthApi = {
  login: (d) => api.post<{ user: User }>("/auth/login", d).then((r) => r.data.user),
  me: () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user),
  logout: async () => { await api.post("/auth/logout"); },
  updateProfile: (_uid, d) => api.patch<{ user: User }>("/auth/profile", d).then((r) => r.data.user),
  changePassword: async (_uid, d) => { await api.post("/auth/change-password", d); },
  savePreferences: (_uid, d) => api.patch<{ user: User }>("/auth/preferences", d).then((r) => r.data.user),
};

export const authService: AuthApi = USE_MOCK ? mock : real;
