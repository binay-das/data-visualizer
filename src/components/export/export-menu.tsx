import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDatasets } from "@/hooks/useDatasets";
import { exportToCSV, exportToJSON, exportToExcel } from "@/utils/export";
import { toast } from "sonner";
import { getTimestampSuffix } from "@/utils/formatters";

interface ExportMenuProps {
    datasetId: string
}

export function ExportMenu({ datasetId }: ExportMenuProps) {
    const { datasets } = useDatasets();
    const dataset = datasets.find(d => d.id === datasetId);

    if (!dataset) {
        return null;
    }




    const handleExportCSV = () => {
        if (!dataset.rows.length) {
            return toast.error("Dataset is empty");
        }


        try {
            exportToCSV(dataset.rows, `${dataset.name || "export"}_${getTimestampSuffix()}`)
            toast.success("Dataset exported to CSV")
        } catch (e) {
            toast.error("Failed to export to CSV")
        }
    }

    const handleExportJSON = () => {
        if (!dataset.rows.length) {
            return toast.error("Dataset is empty");
        }

        try {
            exportToJSON(dataset.rows, `${dataset.name || "export"}_${getTimestampSuffix()}`);
            toast.success("Dataset exported to JSON")
        } catch (e) {
            toast.error("Failed to export to JSON")
        }
    }

    const handleExportExcel = () => {
        if (!dataset.rows.length) {
            return toast.error("Dataset is empty");
        }

        try {
            exportToExcel(dataset.rows, `${dataset.name || "export"}_${getTimestampSuffix()}`);
            toast.success("Dataset exported to Excel")
        } catch (e) {
            toast.error("Failed to export to Excel")
        }
    }



    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                <Download className="h-4 w-4" />
                Export
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export As</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
