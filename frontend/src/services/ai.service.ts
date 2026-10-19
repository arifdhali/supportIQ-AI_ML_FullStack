import api, { USE_MOCK } from "./api";
import { tickets } from "@/mocks/tickets";
import type { AIAnalysis } from "@/types";


export interface AiApi { get(ticketId: number | string): Promise<AIAnalysis | null> }

const mock: AiApi = { get: async (id) => tickets.find((t) => t.id === Number(id))?.ai ?? null };
const real: AiApi = {
  get: (id) => api.get<{ analysis?: AIAnalysis }>(`/tickets/${id}/ai`).then((r) => r.data.analysis ?? null).catch(() => null),
};
export const aiService: AiApi = USE_MOCK ? mock : real;
