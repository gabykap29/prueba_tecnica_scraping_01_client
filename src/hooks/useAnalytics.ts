import { useState, useCallback } from "react";
import { analyticsService } from "@/services";
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
} from "@/types/api";

interface UseAnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAnalyticsActions {
  refetch: () => Promise<void>;
}

export function useComparePrices() {
  const [state, setState] = useState<UseAnalyticsState<CompareResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (product: string, zone?: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await analyticsService.comparePrices(product, zone);
        setState({ data, loading: false, error: null });
      } catch (e) {
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    },
    []
  );

  return { ...state, fetch };
}

export function useRankings() {
  const [state, setState] = useState<UseAnalyticsState<RankingsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (metric: string = "price", zoneType?: string, limit: number = 10) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await analyticsService.getRankings(metric, zoneType, limit);
        setState({ data, loading: false, error: null });
      } catch (e) {
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    },
    []
  );

  return { ...state, fetch };
}

export function usePrices() {
  const [state, setState] = useState<UseAnalyticsState<PriceStats>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (zoneType?: string, startDate?: string, endDate?: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await analyticsService.getPrices(zoneType, startDate, endDate);
        setState({ data, loading: false, error: null });
      } catch (e) {
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    },
    []
  );

  return { ...state, fetch };
}

export function useETAs() {
  const [state, setState] = useState<UseAnalyticsState<ETAsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (restaurant: string, zone?: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await analyticsService.getETAs(restaurant, zone);
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }, []);

  return { ...state, fetch };
}

export function useTrends() {
  const [state, setState] = useState<UseAnalyticsState<TrendsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (product: string, zone?: string, days: number = 7) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await analyticsService.getTrends(product, zone, days);
        setState({ data, loading: false, error: null });
      } catch (e) {
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    },
    []
  );

  return { ...state, fetch };
}

export function useHealth() {
  const [state, setState] = useState<UseAnalyticsState<HealthResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await analyticsService.checkHealth();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }, []);

  return { ...state, fetch };
}

export function useSummary() {
  const [state, setState] = useState<UseAnalyticsState<SummaryResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await analyticsService.getSummary();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }, []);

  return { ...state, fetch };
}

export function useKnowledgeBase() {
  const [state, setState] = useState<UseAnalyticsState<KnowledgeBaseStatusResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await analyticsService.getKnowledgeBaseStatus();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }, []);

  const update = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await analyticsService.updateKnowledgeBase();
      setState({ data: null, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }, []);

  return { ...state, fetch, update };
}
