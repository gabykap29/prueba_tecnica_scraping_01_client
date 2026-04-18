"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Spinner } from "@/components/ui";
import { useComparePrices } from "@/hooks/useAnalytics";
import { exportData, type ExportFormat } from "@/services/export";
import { cn, formatCurrency } from "@/lib/utils";
import type { PlatformResult } from "@/types/api";

export function CompareSection() {
  const [product, setProduct] = useState("Big Mac");
  const [zone, setZone] = useState("");
  const { data, loading, error, fetch } = useComparePrices();

  useEffect(() => {
    fetch(product, zone || undefined);
  }, []);

  const handleSearch = () => {
    fetch(product, zone || undefined);
  };

  const handleExport = (format: ExportFormat) => {
    if (data) {
      exportData(data, `compare-${product}-${zone || "all"}`, format);
    }
  };

  const zoneOptions = [
    { value: "", label: "Todas las zonas" },
    { value: "high", label: "High" },
    { value: "mid", label: "Mid" },
    { value: "periphery", label: "Periphery" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparar costo total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            label="Producto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Big Mac"
          />
          <Select
            label="Zona"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            options={zoneOptions}
          />
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Buscar"}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="p-4 mb-4 text-amber-800 bg-amber-50 rounded-lg">
            Consultando backend y refrescando datos live. Esto puede tardar hasta 3 minutos.
          </div>
        )}

        {error && <div className="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">{error}</div>}

        {data && (
          <div>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("xlsx")}>
                Excel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.freshness && (
                <div className="md:col-span-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900">
                  <p className="font-medium">{data.freshness.message}</p>
                  <p className="mt-1 text-xs">
                    Live: {data.freshness.live_records} | Backup: {data.freshness.backup_records}
                    {data.freshness.platforms_without_live.length > 0 &&
                      ` · Sin live: ${data.freshness.platforms_without_live.join(", ")}`}
                  </p>
                </div>
              )}

              {data.results.map((result) => (
                <PlatformCard
                  key={result.platform}
                  result={result}
                  isBest={result.platform === data.best_option}
                />
              ))}
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">
                Mejor opcion: {data.best_option}. Ahorro vs promedio: {" "}
                {formatCurrency(data.savings_vs_avg)}. Posicion Rappi: {" "}
                {data.rappi_position.replace("_", " ")}.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PlatformCard({ result, isBest }: { result: PlatformResult; isBest: boolean }) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 transition-all",
        isBest ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium uppercase text-gray-500">{result.platform}</span>
        {isBest && <span className="text-xs font-medium text-green-700">Mejor costo</span>}
      </div>
      <div className="space-y-1">
        <a
          href={result.evidence_url || result.sample_search_url || result.source_url}
          target="_blank"
          rel="noreferrer"
          className="block text-xs text-primary-700 underline break-all"
        >
          URL usada
        </a>
        <p className="text-sm text-gray-600">
          Producto: <span className="font-medium">{formatCurrency(result.avg_product_price)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Delivery: <span className="font-medium">{formatCurrency(result.avg_delivery_fee)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Service fee: <span className="font-medium">{formatCurrency(result.avg_service_fee)}</span>
        </p>
        <p className="text-sm text-gray-600">ETA: {result.avg_eta_min} min</p>
        <p className="text-lg font-bold">Total: {formatCurrency(result.avg_total_cost)}</p>
        <p className="text-xs text-gray-500">
          Live: {result.live_records} | Backup: {result.backup_records}
        </p>
      </div>
    </div>
  );
}
