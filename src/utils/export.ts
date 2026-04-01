import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { DataRecord } from "../types/dataset";

export function exportToCSV(rows: DataRecord[], filename: string): void {
    if (!rows || rows.length === 0) return;
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
}

export function exportToJSON(rows: DataRecord[], filename: string): void {
    if (!rows || rows.length === 0) return;
    const json = JSON.stringify(rows, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, `${filename}.json`);
}



export function exportToExcel(rows: DataRecord[], filename: string): void {
    if (!rows || rows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    downloadBlob(blob, `${filename}.xlsx`);
}



function downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
