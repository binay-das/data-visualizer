import { useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import { useDatasets } from "@/hooks/useDatasets"
import { DataTable } from "@/components/data-table/data-table"
import { ChartBuilder } from "@/components/chart-builder/chart-builder"

export default function DatasetWorkspace() {
    const { id } = useParams()
    const { datasets } = useDatasets()
    const [view, setView] = useState<"table" | "charts">("table")

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
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border">
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'table' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setView('table')}
                    >
                        Data Table
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'charts' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setView('charts')}
                    >
                        Visualizations
                    </button>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0 bg-muted/10">
                {view === 'table' ? (
                    <DataTable data={dataset.rows} columns={dataset.columns} />
                ) : (
                    <ChartBuilder data={dataset.rows} columns={dataset.columns} />
                )}
            </div>
        </div>
    )
}
