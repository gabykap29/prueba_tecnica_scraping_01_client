"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Loading } from "@/components/ui";
import { useSummary } from "@/hooks/useAnalytics";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function SummarySection() {
  const { data, loading, error, fetch } = useSummary();

  useEffect(() => {
    fetch();
  }, []);

  if (loading && !data) {
    return <Loading text="Cargando resumen competitivo..." />;
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Registros" value={formatNumber(data.records)} />
        <Kpi label="Direcciones" value={formatNumber(data.addresses)} />
        <Kpi label="Plataformas" value={formatNumber(data.platforms.length)} />
        <Kpi label="Fuente" value={data.source_type} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de datos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 break-all">
            Dataset activo: <span className="font-medium">{data.dataset_path}</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Cuando existe un scrape live, reemplaza registros puntuales del backup. Lo no
            obtenido en vivo queda cubierto por el snapshot de respaldo.
          </p>
        </CardContent>
      </Card>

      {data.live_scrape_status.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de scrapers live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Plataforma
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Precios
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Stealth
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Error principal
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Evidencia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.live_scrape_status.map((status) => (
                    <tr key={status.platform} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 capitalize">{status.platform}</td>
                      <td className="px-4 py-3">{status.status}</td>
                      <td className="px-4 py-3 text-right">
                        {status.priced_rows}/{status.rows}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {status.stealth_applied === "True" ? "aplicado" : "sin dato"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {status.top_error}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={status.evidence_url || status.search_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-700 underline"
                        >
                          abrir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top 5 insights accionables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.top_insights.map((insight, index) => (
              <article key={insight.category} className="border-l-4 border-primary-600 pl-4">
                <p className="text-sm font-semibold text-gray-500">
                  {index + 1}. {insight.category.replaceAll("_", " ")}
                </p>
                <p className="font-medium text-gray-900">Finding: {insight.finding}</p>
                <p className="text-sm text-gray-600">Impacto: {insight.impact}</p>
                <p className="text-sm text-gray-600">
                  Recomendacion: {insight.recommendation}
                </p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>URLs de navegacion usadas como referencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.source_urls.map((source) => (
              <div key={source.platform} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-lg font-semibold capitalize">{source.platform}</p>
                <a
                  href={source.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-sm text-primary-700 underline break-all"
                >
                  {source.source_url}
                </a>
                <a
                  href={source.sample_search_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-xs text-gray-600 underline break-all"
                >
                  URL configurada: {source.sample_search_url}
                </a>
                {source.evidence_url && (
                  <a
                    href={source.evidence_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2 text-xs text-green-700 underline break-all"
                  >
                    Evidencia live: {source.evidence_url}
                  </a>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Live: {source.live_records} | Backup: {source.backup_records} | Errores:{" "}
                  {source.error_records}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promedios por plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.platform_averages.map((row) => (
              <div key={row.platform} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-lg font-semibold capitalize">{row.platform}</p>
                <p className="text-sm text-gray-600">
                  Costo total: {formatCurrency(row.avg_total_cost)}
                </p>
                <p className="text-sm text-gray-600">ETA: {row.avg_eta_min} min</p>
                <p className="text-sm text-gray-600">
                  Delivery fee: {formatCurrency(row.avg_delivery_fee)}
                </p>
                <p className="text-sm text-gray-600">
                  Promo visible: {Math.round(row.promo_share * 100)}%
                </p>
                <p className="text-xs text-gray-500">
                  Live: {row.live_records} | Backup: {row.backup_records}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}
