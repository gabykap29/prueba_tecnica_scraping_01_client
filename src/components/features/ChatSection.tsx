"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { analyticsService } from "@/services";
import type { AgentState, PlotlyFigure } from "@/types/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
  data?: Record<string, any> | null;
}

const BUTTONS = [
  { label: "Comparar", value: "comparar", hasOptions: true },
  { label: "Resumen", value: "resumen", hasOptions: false },
  { label: "Rankings", value: "rankings", hasOptions: true },
  { label: "Precios", value: "precios", hasOptions: true },
  { label: "Tiempos", value: "etas", hasOptions: true },
  { label: "Actualizar", value: "actualizar", hasOptions: false },
  { label: "Ayuda", value: "ayuda", hasOptions: false },
];

const OPTIONS: Record<string, { label: string; value: string }[]> = {
  comparar: [
    { label: "Big Mac", value: "Big Mac" },
    { label: "Whopper", value: "Whopper" },
    { label: "Combo Big Mac", value: "Combo Big Mac" },
    { label: "Combo Whopper", value: "Combo Whopper" },
  ],
  precios: [
    { label: "Zona Polanco", value: "high" },
    { label: "Zona Roma", value: "mid" },
    { label: "Zona Periferia", value: "periphery" },
  ],
  etas: [
    { label: "McDonald's", value: "McDonald's" },
    { label: "Burger King", value: "Burger King" },
    { label: "KFC", value: "KFC" },
  ],
  rankings: [
    { label: "Por precio", value: "price" },
    { label: "Por tiempo", value: "eta" },
    { label: "Por delivery", value: "delivery_fee" },
  ],
};

export function ChatSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState<AgentState | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleButtonClick = (value: string, hasOptions: boolean) => {
    if (hasOptions && OPTIONS[value]) {
      setSelectedButton(value);
      setShowOptions(true);
      setPendingOption(value);
    } else {
      sendMessage(value);
    }
  };

  const handleOptionClick = (value: string) => {
    const fullMessage = `${selectedButton} ${value}`;
    setShowOptions(false);
    setSelectedButton(null);
    sendMessage(fullMessage, `${BUTTONS.find(b => b.value === selectedButton)?.label}: ${value}`);
  };

  const sendMessage = async (text: string, displayText?: string) => {
    if (!text || loading) return;

    const userContent = displayText || text;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setLoading(true);
    setCurrentState(null);
    setShowOptions(false);
    setPendingOption(null);

    try {
      const response = await analyticsService.chatWithAgent(text);
      
      setMessages((prev) => {
        const newMsgs = [...prev];
        const lastIndex = newMsgs.findIndex(m => m.isLoading);
        if (lastIndex !== -1) {
          newMsgs[lastIndex] = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.response || "Completado",
            timestamp: response.timestamp,
            data: response.data || null,
          };
        }
        return newMsgs;
      });
      
      setCurrentState(response.states?.[response.states.length - 1] || null);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMsgs = [...prev];
        const lastIndex = newMsgs.findIndex(m => m.isLoading);
        if (lastIndex !== -1) {
          newMsgs[lastIndex] = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Error al conectar. Intenta de nuevo.",
            timestamp: new Date().toISOString(),
          };
        }
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-lg border border-[#ffd0bd] bg-white/90 p-4 mb-4 shadow-sm">
        <div data-tour="quick-actions" className="flex flex-wrap gap-2">
          {BUTTONS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleButtonClick(btn.value, btn.hasOptions)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-white border border-[#ffb299] rounded-lg hover:bg-[#fff1ed] disabled:opacity-50 text-rappi-ink"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {showOptions && selectedButton && OPTIONS[selectedButton] && (
          <div data-tour="options" className="mt-3 flex flex-wrap gap-2">
            {OPTIONS[selectedButton].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOptionClick(opt.value)}
                disabled={loading}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-rappi-red to-rappi-orange text-white rounded-md hover:brightness-105 disabled:opacity-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div data-tour="chat-input" className="flex gap-2 mt-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-[#ffb299] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-rappi-ink"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-rappi-red to-rappi-orange text-white rounded-lg hover:brightness-105 disabled:opacity-50"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>

      {loading && currentState && (
        <div className="bg-[#fff1ed] rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
            <span className="text-sm text-rappi-ink">{currentState.message}</span>
          </div>
          {currentState.progress !== undefined && (
            <div className="w-full bg-[#ffd0bd] rounded-full h-1.5 mt-2">
              <div
                className="bg-gradient-to-r from-rappi-red to-rappi-orange h-1.5 rounded-full transition-all"
                style={{ width: `${currentState.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <div data-tour="results" className="flex flex-col gap-2 pb-20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-gradient-to-r from-rappi-red to-rappi-orange text-white ml-8"
                : msg.isLoading
                ? "bg-[#fff1ed] text-rappi-ink mr-8"
                : "bg-white text-rappi-ink mr-8 border border-[#ffd0bd]"
            }`}
          >
            {msg.isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
                <span className="text-sm text-[#7a4030]">Buscando...</span>
              </div>
            ) : msg.role === "assistant" ? (
              <div className="space-y-3">
                <ReactMarkdown className="text-sm prose prose-sm max-w-none prose-p:my-1">
                  {msg.content}
                </ReactMarkdown>
                <StructuredResult data={msg.data} />
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            )}
            {!msg.isLoading && (
              <p className={`text-xs mt-1 ${
                msg.role === "user" ? "text-white/80" : "text-[#9a5a45]"
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function StructuredResult({ data }: { data?: Record<string, any> | null }) {
  if (!data) return null;

  const plotly = pickPlotlyFigure(data.plotly);

  return (
    <div className="space-y-3">
      {plotly && <PlotlyPreview figure={plotly} />}
      {Array.isArray(data.rankings) && <RankingsResult rows={data.rankings} />}
      {Array.isArray(data.results) && <PlatformResultCards rows={data.results} />}
      {Array.isArray(data.platform_averages) && (
        <PlatformResultCards rows={data.platform_averages} />
      )}
      {Array.isArray(data.ETAs) && <EtaResult rows={data.ETAs} />}
      {Array.isArray(data.snapshot) && <PlatformResultCards rows={data.snapshot} />}
      {Array.isArray(data.top_insights) && <InsightsResult rows={data.top_insights} />}
      {Array.isArray(data.sources) && <SourcesResult rows={data.sources} />}
      {!Array.isArray(data.sources) && Array.isArray(data.source_urls) && (
        <SourcesResult rows={data.source_urls} />
      )}
    </div>
  );
}

function pickPlotlyFigure(plotly: unknown): PlotlyFigure | null {
  if (!plotly || typeof plotly !== "object") return null;
  const maybeFigure = plotly as PlotlyFigure;
  if (Array.isArray(maybeFigure.data)) return maybeFigure;

  const values = Object.values(plotly as Record<string, unknown>);
  const firstFigure = values.find(
    (value) => value && typeof value === "object" && Array.isArray((value as PlotlyFigure).data)
  );
  return (firstFigure as PlotlyFigure | undefined) || null;
}

function PlotlyPreview({ figure }: { figure: PlotlyFigure }) {
  const trace = figure.data?.[0] as { x?: unknown[]; y?: unknown[]; name?: string } | undefined;
  const x = (trace?.x || []).map(String);
  const y = (trace?.y || []).map((value) => Number(value) || 0);
  const max = Math.max(...y, 1);
  const title =
    typeof figure.layout?.title === "string"
      ? figure.layout.title
      : "Grafico generado";

  if (!x.length || !y.length) return null;

  return (
    <div className="rounded-md border border-[#ffd0bd] bg-white p-3">
      <p className="mb-2 text-xs font-semibold text-rappi-ink">{title}</p>
      <div className="space-y-2">
        {x.map((label, index) => (
          <div key={`${label}-${index}`} className="grid grid-cols-[88px_1fr_56px] items-center gap-2">
            <span className="truncate text-xs capitalize text-[#7a4030]">{label}</span>
            <div className="h-5 overflow-hidden rounded bg-[#fff1ed]">
              <div
                className="h-full rounded bg-gradient-to-r from-rappi-red to-rappi-orange"
                style={{ width: `${Math.max((y[index] / max) * 100, 3)}%` }}
              />
            </div>
            <span className="text-right text-xs font-medium text-rappi-ink">
              {Number.isInteger(y[index]) ? y[index] : y[index].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankingsResult({ rows }: { rows: Array<Record<string, any>> }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-md border border-[#ffd0bd] bg-white">
      <table className="w-full text-xs">
        <thead className="bg-[#fff1ed] text-[#7a4030]">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Plataforma</th>
            <th className="px-3 py-2 text-left">Zona</th>
            <th className="px-3 py-2 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.platform}-${row.zone_type}-${index}`} className="border-t border-[#ffe0d5]">
              <td className="px-3 py-2">{row.rank || index + 1}</td>
              <td className="px-3 py-2 capitalize">{row.platform}</td>
              <td className="px-3 py-2">{row.zone_type || "all"}</td>
              <td className="px-3 py-2 text-right font-medium">
                {formatValue(row.metric_value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlatformResultCards({ rows }: { rows: Array<Record<string, any>> }) {
  if (!rows.length) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {rows.map((row, index) => (
        <div key={`${row.platform}-${index}`} className="rounded-md border border-[#ffd0bd] bg-white p-3">
          <p className="text-xs font-semibold uppercase text-[#9a3c22]">{row.platform}</p>
          <p className="mt-1 text-lg font-bold text-rappi-ink">
            ${formatValue(row.avg_total_cost ?? row.product_price ?? row.best_price)}
          </p>
          <p className="text-xs text-[#7a4030]">
            Producto: ${formatValue(row.avg_product_price ?? row.product_price)}
          </p>
          <p className="text-xs text-[#7a4030]">
            Delivery: ${formatValue(row.avg_delivery_fee ?? row.delivery_fee)}
          </p>
          <p className="text-xs text-[#7a4030]">
            ETA: {formatValue(row.avg_eta_min ?? row.estimated_time_min)} min
          </p>
        </div>
      ))}
    </div>
  );
}

function EtaResult({ rows }: { rows: Array<Record<string, any>> }) {
  if (!rows.length) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.platform} className="rounded-md border border-[#ffd0bd] bg-white p-3">
          <p className="text-xs font-semibold uppercase text-[#9a3c22]">{row.platform}</p>
          <p className="mt-1 text-lg font-bold text-rappi-ink">{row.avg_min} min</p>
          <p className="text-xs text-[#7a4030]">
            Rango: {row.min} - {row.max} min
          </p>
        </div>
      ))}
    </div>
  );
}

function InsightsResult({ rows }: { rows: Array<Record<string, any> | string> }) {
  if (!rows.length) return null;
  return (
    <div className="space-y-2">
      {rows.slice(0, 5).map((row, index) => (
        <div key={`${typeof row === "string" ? row : row.category}-${index}`} className="rounded-md border border-[#ffd0bd] bg-white p-3">
          {typeof row === "string" ? (
            <p className="text-sm font-medium text-rappi-ink">{row}</p>
          ) : (
            <>
              <p className="text-xs font-semibold text-[#9a3c22]">{row.category}</p>
              <p className="text-sm font-medium text-rappi-ink">{row.finding}</p>
              <p className="mt-1 text-xs text-[#7a4030]">{row.recommendation}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function SourcesResult({ rows }: { rows: Array<Record<string, any>> }) {
  const sources = rows
    .map((row) => ({
      platform: row.platform || "fuente",
      restaurant: row.restaurant,
      product: row.product,
      url: row.url || row.source_url || row.evidence_url,
      confidence: row.confidence,
    }))
    .filter((row) => typeof row.url === "string" && row.url.length > 0)
    .slice(0, 6);

  if (!sources.length) return null;

  return (
    <div className="rounded-md border border-[#ffd0bd] bg-white p-3">
      <p className="mb-2 text-xs font-semibold uppercase text-[#9a3c22]">Fuentes</p>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <a
            key={`${source.url}-${index}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded border border-[#ffe0d5] px-3 py-2 text-xs text-primary-700 hover:bg-[#fff1ed]"
          >
            <span className="font-semibold capitalize">{source.platform}</span>
            {source.product ? <span className="text-[#7a4030]"> · {source.product}</span> : null}
            {source.restaurant ? <span className="text-[#9a5a45]"> · {source.restaurant}</span> : null}
            {typeof source.confidence === "number" ? (
              <span className="text-[#9a5a45]"> · confianza {(source.confidence * 100).toFixed(0)}%</span>
            ) : null}
            <span className="mt-1 block truncate text-[#9a5a45]">{source.url}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function formatValue(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}
