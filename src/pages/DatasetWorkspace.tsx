import { useParams, Navigate } from "react-router-dom"
import { useDatasets } from "@/hooks/useDatasets"
import { DataTable } from "@/components/data-table/data-table"

export default function DatasetWorkspace() {
    const { id } = useParams()
    const { datasets } = useDatasets()

    if (!id) return <Navigate to="/dashboard" />

    const dataset = datasets.find(d => d.id === id)

    if (!dataset) {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center">
                <h2 className="text-xl font-bold">Dataset not found</h2>
                <p className="text-muted-foreground">It may have been deleted.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <div className="border-b px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{dataset.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {dataset.summary.rowCount.toLocaleString()} rows • {dataset.summary.columnCount} columns
                    </p>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0 bg-muted/10">
                <DataTable data={dataset.rows} columns={dataset.columns} />
            </div>
        </div>
    )
}
