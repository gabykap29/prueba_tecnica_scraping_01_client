"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Select, Spinner } from "@/components/ui";
import { usePrices } from "@/hooks/useAnalytics";
import { exportData, type ExportFormat } from "@/services/export";
import { formatNumber } from "@/lib/utils";

export function PricesSection() {
  const [zoneType, setZoneType] = useState("");
  const [startDate, setStartDate] = useState("2026-04-17");
  const [endDate, setEndDate] = useState("2026-04-17");
  const { data, loading, error, fetch } = usePrices();

  useEffect(() => {
    fetch(zoneType || undefined, startDate, endDate);
  }, []);

  const handleSearch = () => {
    fetch(zoneType || undefined, startDate, endDate);
  };

  const handleExport = (format: ExportFormat) => {
    if (data) {
      exportData(data, `prices-${zoneType || "all"}`, format);
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
        <CardTitle>Fees, tiempos y promociones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select label="Zona" value={zoneType} onChange={(e) => setZoneType(e.target.value)} options={zoneOptions} />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Delivery promedio" value={`$${data.avg_delivery_fee}`} />
              <StatCard label="Tiempo promedio" value={`${data.avg_eta_min} min`} />
              <StatCard label="Registros" value={formatNumber(data.total_records)} />
              <StatCard label="Zona" value={data.zone_type} />
            </div>

            <div className="mb-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Plataforma</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">URL</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Delivery</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Service</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">ETA</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Promo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.platform_averages.map((row) => (
                      <tr key={row.platform} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 capitalize">{row.platform}</td>
                        <td className="px-4 py-3">
                          <a
                            href={row.sample_search_url || row.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-700 underline"
                          >
                            fuente
                          </a>
                        </td>
                        <td className="px-4 py-3 text-right">${row.avg_total_cost}</td>
                      <td className="px-4 py-3 text-right">${row.avg_delivery_fee}</td>
                      <td className="px-4 py-3 text-right">${row.avg_service_fee}</td>
                      <td className="px-4 py-3 text-right">{row.avg_eta_min} min</td>
                      <td className="px-4 py-3 text-right">{Math.round(row.promo_share * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top promociones</h4>
              <div className="flex flex-wrap gap-2">
                {data.top_promos.map((promo, i) => (
                  <div key={i} className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm">
                    {promo.platform}: {promo.promo} ({promo.count})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
