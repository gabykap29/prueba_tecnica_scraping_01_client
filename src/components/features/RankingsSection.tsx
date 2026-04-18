"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Select, Spinner } from "@/components/ui";
import { useRankings } from "@/hooks/useAnalytics";
import { exportData, type ExportFormat } from "@/services/export";
import type { Ranking } from "@/types/api";

export function RankingsSection() {
  const [metric, setMetric] = useState("price");
  const [zoneType, setZoneType] = useState("");
  const [limit] = useState(10);
  const { data, loading, error, fetch } = useRankings();

  useEffect(() => {
    fetch(metric, zoneType || undefined, limit);
  }, []);

  const handleSearch = () => {
    fetch(metric, zoneType || undefined, limit);
  };

  const handleExport = (format: ExportFormat) => {
    if (data) {
      exportData(data, `rankings-${metric}`, format);
    }
  };

  const metricOptions = [
    { value: "price", label: "Costo total" },
    { value: "eta", label: "Tiempo de entrega" },
    { value: "delivery_fee", label: "Delivery fee" },
    { value: "service_fee", label: "Service fee" },
  ];

  const zoneOptions = [
    { value: "", label: "Todas las zonas" },
    { value: "high", label: "High" },
    { value: "mid", label: "Mid" },
    { value: "periphery", label: "Periphery" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rankings competitivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select label="Metrica" value={metric} onChange={(e) => setMetric(e.target.value)} options={metricOptions} />
          <Select label="Zona" value={zoneType} onChange={(e) => setZoneType(e.target.value)} options={zoneOptions} />
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Buscar"}
            </Button>
          </div>
        </div>

        {error && <div className="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">{error}</div>}

        {data && (
          <div>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => handleExport("json")}>JSON</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>CSV</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("xlsx")}>Excel</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Plataforma</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Zona</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rankings.map((ranking) => (
                    <RankingRow key={`${ranking.rank}-${ranking.platform}-${ranking.zone_type}`} ranking={ranking} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankingRow({ ranking }: { ranking: Ranking }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{ranking.rank}</td>
      <td className="px-4 py-3 capitalize">{ranking.platform}</td>
      <td className="px-4 py-3">{ranking.zone_type}</td>
      <td className="px-4 py-3 text-right font-medium">{ranking.metric_value}</td>
    </tr>
  );
}
