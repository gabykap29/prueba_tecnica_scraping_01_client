import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type {
  CompareResponse,
  RankingsResponse,
  PriceStats,
  ETAsResponse,
  TrendsResponse,
  SummaryResponse,
} from "@/types/api";

type ExportData =
  | CompareResponse
  | RankingsResponse
  | PriceStats
  | ETAsResponse
  | TrendsResponse
  | SummaryResponse;

export type ExportFormat = "json" | "csv" | "xlsx";

function convertToArray(data: ExportData): Record<string, unknown>[] {
  if ("results" in data && Array.isArray(data.results)) {
    return data.results as unknown as Record<string, unknown>[];
  }
  if ("rankings" in data && Array.isArray(data.rankings)) {
    return data.rankings as unknown as Record<string, unknown>[];
  }
  if ("ETAs" in data && Array.isArray(data.ETAs)) {
    return data.ETAs as unknown as Record<string, unknown>[];
  }
  if ("snapshot" in data && Array.isArray(data.snapshot)) {
    return data.snapshot as unknown as Record<string, unknown>[];
  }
  if ("top_insights" in data && Array.isArray(data.top_insights)) {
    return data.top_insights as unknown as Record<string, unknown>[];
  }
  return [data as unknown as Record<string, unknown>];
}

export function exportToJSON(data: ExportData, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  saveAs(blob, `${filename}.json`);
}

export function exportToCSV(data: ExportData, filename: string): void {
  const arr = convertToArray(data);
  
  if (arr.length === 0) {
    return;
  }

  const headers = Object.keys(arr[0]);
  const csvRows = [
    headers.join(","),
    ...arr.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const escaped = String(value).replace(/"/g, '\\"');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ];

  const csv = csvRows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
}

export function exportToExcel(data: ExportData, filename: string): void {
  const arr = convertToArray(data);

  const worksheet = XLSX.utils.json_to_sheet(arr);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
}

export function exportData(
  data: ExportData,
  filename: string,
  format: ExportFormat
): void {
  switch (format) {
    case "json":
      exportToJSON(data, filename);
      break;
    case "csv":
      exportToCSV(data, filename);
      break;
    case "xlsx":
      exportToExcel(data, filename);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
