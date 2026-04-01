import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExport } from "@/hooks/useExport";
import { useDatasets } from "@/hooks/useDatasets";

interface ExportMenuProps {
    datasetId: string
}

export function ExportMenu({ datasetId }: ExportMenuProps) {
    const { datasets } = useDatasets();
    const dataset = datasets.find(d => d.id === datasetId);
    const { exportCSV, exportJSON, exportExcel } = useExport();

    if (!dataset) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={!dataset.rows.length} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                <Download className="h-4 w-4" />
                Export
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export As</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportCSV(dataset.rows, dataset.name)}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportExcel(dataset.rows, dataset.name)}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportJSON(dataset.rows, dataset.name)}>
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
