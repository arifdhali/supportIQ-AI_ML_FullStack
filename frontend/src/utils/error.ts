import axios from "axios";

export function errMsg(e: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(e)) return (e.response?.data as { message?: string } | undefined)?.message ?? e.message;
  return e instanceof Error ? e.message : fallback;
}
