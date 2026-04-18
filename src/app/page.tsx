"use client";

import { useEffect } from "react";
import { ChatSection } from "@/components/features";
import { ProductTour } from "@/components/features/ProductTour";
import { Badge, Loading, useHealth } from "@/components/ui";

export default function Home() {
  const { data: health, loading: healthLoading, error: healthError, fetch: checkHealth } = useHealth();

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rappi-ink">Competitive Intelligence</h2>
          <p className="text-[#7a4030]">
            Rappi vs Uber Eats vs DiDi Food · Asistente AI
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div data-tour="status">
            {healthLoading || (!health && !healthError) ? (
              <Loading text="Verificando API..." />
            ) : health ? (
              <Badge variant="success">API conectada</Badge>
            ) : (
              <Badge variant="error">API desconectada</Badge>
            )}
          </div>
          <ProductTour />
        </div>
      </div>

      <ChatSection />
    </div>
  );
}
