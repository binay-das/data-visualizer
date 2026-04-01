import { toast } from "sonner";
import type { DataRecord } from "@/types/dataset";
import { getTimestampSuffix } from "@/utils/formatters";


import { exportToCSV, exportToJSON, exportToExcel } from "@/utils/export";


export function useExport() {
    const handleExportCSV = (rows: DataRecord[], name: string) => {
        if (!rows.length) return toast.error("Dataset is empty")
        try {
            exportToCSV(rows, `${name || "export"}_${getTimestampSuffix()}`)
            toast.success("Dataset exported to CSV")
        } catch (e) {
            toast.error("Failed to export to CSV")
        }

    }

    const handleExportJSON = (rows: DataRecord[], name: string) => {
        if (!rows.length) {
            return toast.error("Dataset is empty");
        }

        
        try {
            exportToJSON(rows, `${name || "export"}_${getTimestampSuffix()}`);
            toast.success("Dataset exported to JSON");
        } catch (e) {
            toast.error("Failed to export to JSON");
        }
    }


    const handleExportExcel = (rows: DataRecord[], name: string) => {
        if (!rows.length) {
            return toast.error("Dataset is empty");
        }

        try {
            exportToExcel(rows, `${name || "export"}_${getTimestampSuffix()}`);
            toast.success("Dataset exported to Excel");
        } catch (e) {
            toast.error("Failed to export to Excel");
        }
    }


    return {
        exportCSV: handleExportCSV,
        exportJSON: handleExportJSON,
        exportExcel: handleExportExcel,
    }
}
