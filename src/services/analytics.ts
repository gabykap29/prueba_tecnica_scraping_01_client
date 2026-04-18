import axios, { AxiosInstance } from "axios";
import type {
  CompareResponse,
  RankingsResponse,
  PriceStats,
  ETAsResponse,
  TrendsResponse,
  HealthResponse,
  SummaryResponse,
  UpdateKnowledgeResponse,
  KnowledgeBaseStatusResponse,
  AgentChatResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class AnalyticsService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 180000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await this.client.get<HealthResponse>("/api/v1/health", {
        timeout: 5000,
      });
      return response.data;
    } catch (healthError) {
      try {
        const response = await this.client.get<HealthResponse>("/api/v1/ai-agent/health", {
          timeout: 5000,
        });
        return {
          ...response.data,
          service: response.data.service || "ai-agent",
        };
      } catch (agentHealthError) {
        try {
          const response = await this.client.post<AgentChatResponse>(
            "/api/v1/ai-agent/chat",
            {
              message: "health",
              conversation_id: "health-check",
            },
            { timeout: 7000 }
          );
          const agentStatus = response.data.data?.status;
          return {
            status: agentStatus === "healthy" ? "healthy" : "degraded",
            service: "ai-agent-chat",
            timestamp: response.data.timestamp,
          };
        } catch {
          throw healthError;
        }
      }
    }
  }

  async comparePrices(
    product: string,
    zone?: string,
    startDate?: string,
    endDate?: string
  ): Promise<CompareResponse> {
    const dates = startDate || endDate ? ` periodo ${startDate || ""} ${endDate || ""}` : "";
    return this.askAgent<CompareResponse>(
      `comparar ${product}${zone ? ` zona ${zone}` : ""}${dates}`,
      "compare"
    );
  }

  async getRankings(
    metric: string = "price",
    zoneType?: string,
    limit: number = 10
  ): Promise<RankingsResponse> {
    return this.askAgent<RankingsResponse>(
      `rankings metrica ${metric}${zoneType ? ` zona ${zoneType}` : ""} limite ${limit}`,
      "rankings"
    );
  }

  async getPrices(
    zoneType?: string,
    startDate?: string,
    endDate?: string,
    restaurant?: string
  ): Promise<PriceStats> {
    const dates = startDate || endDate ? ` periodo ${startDate || ""} ${endDate || ""}` : "";
    return this.askAgent<PriceStats>(
      `precios${zoneType ? ` zona ${zoneType}` : ""}${restaurant ? ` restaurante ${restaurant}` : ""}${dates}`,
      "prices"
    );
  }

  async getETAs(restaurant: string, zone?: string): Promise<ETAsResponse> {
    return this.askAgent<ETAsResponse>(
      `tiempos ${restaurant}${zone ? ` zona ${zone}` : ""}`,
      "etas"
    );
  }

  async getTrends(
    product: string,
    zone?: string,
    days: number = 7
  ): Promise<TrendsResponse> {
    return this.askAgent<TrendsResponse>(
      `snapshot ${product}${zone ? ` zona ${zone}` : ""} ${days} dias`,
      "trends"
    );
  }

  async getSummary(): Promise<SummaryResponse> {
    return this.askAgent<SummaryResponse>("resumen ejecutivo", "summary");
  }

  async updateKnowledgeBase(): Promise<UpdateKnowledgeResponse> {
    const response = await this.chatWithAgent("actualizar base de conocimiento", "knowledge");
    return {
      status: "started",
      message: response.response,
      timestamp: response.timestamp,
    };
  }

  async getKnowledgeBaseStatus(): Promise<KnowledgeBaseStatusResponse> {
    const summary = await this.getSummary();
    return {
      status: summary.records > 0 ? "ready" : "empty",
      records: summary.records,
      scrape_status: summary.live_scrape_status,
      timestamp: summary.timestamp,
    };
  }

  async chatWithAgent(message: string, conversationId?: string): Promise<AgentChatResponse> {
    const response = await this.client.post<AgentChatResponse>("/api/v1/ai-agent/chat", {
      message,
      conversation_id: conversationId || "default",
    });
    return response.data;
  }

  private async askAgent<T>(message: string, conversationId: string): Promise<T> {
    const response = await this.chatWithAgent(message, conversationId);
    return {
      ...(response.data || {}),
      ai_response: response.response,
    } as T;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
