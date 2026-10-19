export const fmtDate = (d: string): string =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
export const ticketCode = (id: number): string => `TKT-${String(id).padStart(4, "0")}`;
export const initials = (n = ""): string => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
