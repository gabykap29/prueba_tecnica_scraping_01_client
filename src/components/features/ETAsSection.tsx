"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Spinner } from "@/components/ui";
import { useETAs } from "@/hooks/useAnalytics";
import { exportData, type ExportFormat } from "@/services/export";

export function ETAsSection() {
  const [restaurant, setRestaurant] = useState("McDonald's");
  const [zone, setZone] = useState("");
  const { data, loading, error, fetch } = useETAs();

  useEffect(() => {
    fetch(restaurant, zone || undefined);
  }, []);

  const handleSearch = () => {
    fetch(restaurant, zone || undefined);
  };

  const handleExport = (format: ExportFormat) => {
    if (data) {
      exportData(data, `etas-${restaurant}`, format);
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
        <CardTitle>Tiempos de entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            label="Restaurante"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            placeholder="McDonald's"
          />
          <Select label="Zona" value={zone} onChange={(e) => setZone(e.target.value)} options={zoneOptions} />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.ETAs.map((eta) => (
                <div key={eta.platform} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium capitalize">{eta.platform}</p>
                  <p className="text-2xl font-bold">{eta.avg_min} min</p>
                  <p className="text-sm text-gray-500">
                    Rango: {eta.min} - {eta.max} min
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
