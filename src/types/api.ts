export interface PlatformResult {
  platform: string;
  source_url: string;
  sample_search_url: string;
  evidence_url?: string;
  avg_product_price: number;
  avg_delivery_fee: number;
  avg_service_fee: number;
  avg_total_cost: number;
  avg_eta_min: number;
  promo_share: number;
  availability_rate: number;
  live_records: number;
  backup_records: number;
  error_records: number;
  records: number;
}

export interface PlotlyFigure {
  data: Array<Record<string, unknown>>;
  layout: Record<string, unknown>;
}

export interface LiveScrapeStatus {
  platform: string;
  file: string;
  rows: number;
  priced_rows: number;
  status: string;
  top_error: string;
  stealth_applied?: string;
  evidence_url?: string;
  search_url?: string;
}

export interface CompareFreshness {
  status: "live" | "partial_live" | "fallback_csv";
  message: string;
  live_records: number;
  backup_records: number;
  platforms_without_live: string[];
}

export interface CompareDataSource {
  dataset_path: string;
  live_records: number;
  backup_records: number;
  live_scrape_status: LiveScrapeStatus[];
  refresh_attempt: {
    attempted: boolean;
    platforms?: Array<{ platform: string; status: string; output?: string; error?: string }>;
    snapshot?: { status: string; output?: string; error?: string };
  };
}

export interface CompareResponse {
  product: string;
  zone: string;
  period: {
    start: string;
    end: string;
  };
  results: PlatformResult[];
  best_option: string;
  rappi_position: "cheaper" | "similar" | "more_expensive" | "no_data";
  savings_vs_avg: number;
  data_source?: CompareDataSource;
  freshness?: CompareFreshness;
  plotly?: PlotlyFigure;
  ai_response?: string;
  timestamp: string;
}

export interface Ranking {
  rank: number;
  platform: string;
  zone_type: string;
  metric_value: number;
}

export interface RankingsResponse {
  metric: string;
  zone_type: string;
  limit: number;
  rankings: Ranking[];
  plotly?: PlotlyFigure;
  ai_response?: string;
  timestamp: string;
}

export interface PriceStats {
  zone_type: string;
  period: {
    start: string;
    end: string;
  };
  restaurant: string;
  avg_delivery_fee: number;
  avg_eta_min: number;
  total_records: number;
  platform_averages: PlatformResult[];
  top_promos: Array<{
    platform: string;
    promo: string;
    count: number;
  }>;
  plotly?: PlotlyFigure;
  ai_response?: string;
  timestamp: string;
}

export interface ETA {
  platform: string;
  avg_min: number;
  min: number;
  max: number;
}

export interface ETAsResponse {
  restaurant: string;
  zone: string;
  ETAs: ETA[];
  plotly?: PlotlyFigure;
  ai_response?: string;
  timestamp: string;
}

export interface Trend {
  platform: string;
  source_url: string;
  sample_search_url: string;
  avg_product_price: number;
  avg_delivery_fee: number;
  avg_service_fee: number;
  avg_total_cost: number;
  avg_eta_min: number;
  promo_share: number;
  availability_rate: number;
  records: number;
}

export interface TrendsResponse {
  product: string;
  zone: string;
  days: number;
  note: string;
  snapshot: Trend[];
  plotly?: PlotlyFigure;
  ai_response?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export type ZoneType = "high" | "mid" | "periphery";
export type MetricType = "price" | "eta" | "delivery_fee" | "service_fee";

export interface ZoneSummary {
  zone_type: string;
  platform: string;
  avg_total_cost: number;
  avg_eta_min: number;
  avg_delivery_fee: number;
  avg_service_fee: number;
  records: number;
}

export interface PromoSummary {
  platform: string;
  promo: string;
  count: number;
}

export interface CompetitiveInsight {
  finding: string;
  impact: string;
  recommendation: string;
  category: string;
}

export interface SummaryResponse {
  dataset_path: string;
  source_type: string;
  live_scrape_status: LiveScrapeStatus[];
  records: number;
  addresses: number;
  platforms: string[];
  source_urls: Array<{
    platform: string;
    source_url: string;
    sample_search_url: string;
    evidence_url: string;
    live_records: number;
    backup_records: number;
    error_records: number;
  }>;
  products: string[];
  platform_averages: PlatformResult[];
  zones: ZoneSummary[];
  promos: PromoSummary[];
  top_insights: CompetitiveInsight[];
  plotly?: Record<string, PlotlyFigure>;
  ai_response?: string;
  timestamp: string;
}

export interface UpdateKnowledgeResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface KnowledgeBaseStatusResponse {
  status: "ready" | "empty";
  records: number;
  scrape_status: LiveScrapeStatus[];
  timestamp: string;
}

export interface AgentState {
  status: string;
  message: string;
  progress: number;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  response_text?: string;
  timestamp: string;
}

export interface AgentChatResponse {
  conversation_id: string;
  response: string;
  data?: Record<string, unknown>;
  states: AgentState[];
  timestamp: string;
}
