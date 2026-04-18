"use client";

import { useEffect, useState } from "react";
import { useKnowledgeBase } from "@/hooks/useAnalytics";
import { Badge, Button, Card, CardContent, Loading, Spinner } from "@/components/ui";

export function KnowledgeBaseSection() {
  const { data, loading, error, fetch, update } = useKnowledgeBase();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await update();
    } finally {
      setUpdating(false);
      setTimeout(() => fetch(), 2000);
    }
  };

  if (loading && !data) {
    return <Loading text="Cargando estado de base de conocimiento..." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Actualizar Base de Conocimiento
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Ejecuta los scrapers para actualizar los datos de precios.
              </p>
            </div>
            <Button
              onClick={handleUpdate}
              disabled={updating}
              variant="primary"
            >
              {updating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Base de Datos"
              )}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Estado</p>
              <div className="mt-1">
                {data?.status === "ready" ? (
                  <Badge variant="success">Listo</Badge>
                ) : (
                  <Badge variant="warning">{data?.status || "desconocido"}</Badge>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Registros</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {data?.records || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="text-sm text-gray-900 mt-1">
                {data?.timestamp
                  ? new Date(data.timestamp).toLocaleString("es-MX")
                  : "N/A"}
              </p>
            </div>
          </div>

          {data?.scrape_status && data.scrape_status.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Estado de Scrapers
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Plataforma
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Filas
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Con precios
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.scrape_status.map((status) => (
                      <tr key={status.platform}>
                        <td className="px-3 py-2 text-sm text-gray-900 capitalize">
                          {status.platform}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {status.rows}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {status.priced_rows}
                        </td>
                        <td className="px-3 py-2">
                          {status.status === "ok" ? (
                            <Badge variant="success">OK</Badge>
                          ) : (
                            <Badge variant="warning">{status.status}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}