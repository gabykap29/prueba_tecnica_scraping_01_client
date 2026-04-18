"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Spinner } from "@/components/ui";
import { useTrends } from "@/hooks/useAnalytics";
import { exportData, type ExportFormat } from "@/services/export";

export function TrendsSection() {
  const [product, setProduct] = useState("Big Mac");
  const [zone, setZone] = useState("");
  const [days, setDays] = useState(7);
  const { data, loading, error, fetch } = useTrends();

  useEffect(() => {
    fetch(product, zone || undefined, days);
  }, []);

  const handleSearch = () => {
    fetch(product, zone || undefined, days);
  };

  const handleExport = (format: ExportFormat) => {
    if (data) {
      exportData(data, `snapshot-${product}`, format);
    }
  };

  const zoneOptions = [
    { value: "", label: "Todas las zonas" },
    { value: "high", label: "High" },
    { value: "mid", label: "Mid" },
    { value: "periphery", label: "Periphery" },
  ];

  const daysOptions = [
    { value: "7", label: "7 dias" },
    { value: "14", label: "14 dias" },
    { value: "30", label: "30 dias" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snapshot competitivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            label="Producto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Big Mac"
          />
          <Select label="Zona" value={zone} onChange={(e) => setZone(e.target.value)} options={zoneOptions} />
          <Select
            label="Ventana solicitada"
            value={days.toString()}
            onChange={(e) => setDays(parseInt(e.target.value))}
            options={daysOptions}
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
              <Button variant="outline" size="sm" onClick={() => handleExport("json")}>JSON</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>CSV</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("xlsx")}>Excel</Button>
            </div>

            <div className="p-4 mb-4 bg-yellow-50 text-yellow-900 rounded-lg text-sm">
              {data.note}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Plataforma</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">URL</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Producto</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Delivery</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Service</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.snapshot.map((row) => (
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
                      <td className="px-4 py-3 text-right">${row.avg_product_price}</td>
                      <td className="px-4 py-3 text-right">${row.avg_delivery_fee}</td>
                      <td className="px-4 py-3 text-right">${row.avg_service_fee}</td>
                      <td className="px-4 py-3 text-right font-medium">${row.avg_total_cost}</td>
                    </tr>
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
