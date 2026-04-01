import { useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import { useDatasets } from "@/hooks/useDatasets"
import { DataTable } from "@/components/data-table/data-table"
import { ChartBuilder } from "@/components/chart-builder/chart-builder"
import { CorrelationMatrix } from "@/components/correlation/correlation-matrix"
import { OutlierSummary } from "@/components/outliers/outlier-summary"
import { OutlierTable } from "@/components/outliers/outlier-table"
import { DataCleaningMenu } from "@/components/data-cleaning/data-cleaning-menu"
import { ExportMenu } from "@/components/export/export-menu"

type WorkspaceView = "table" | "charts" | "correlation" | "outliers"

const TABS: { id: WorkspaceView; label: string }[] = [
    { id: "table", label: "Data Table" },
    { id: "charts", label: "Visualizations" },
    { id: "correlation", label: "Correlation" },
    { id: "outliers", label: "Outliers" },
]

export default function DatasetWorkspace() {
    const { id } = useParams()
    const { datasets } = useDatasets()
    const [view, setView] = useState<WorkspaceView>("table")

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
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === tab.id
                                ? 'bg-background shadow text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setView(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <DataCleaningMenu datasetId={dataset.id} columns={dataset.columns} />
                    <ExportMenu datasetId={dataset.id} />
                </div>
            </div>

            <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0 bg-muted/10">
                {view === 'table' && (
                    <DataTable data={dataset.rows} columns={dataset.columns} />
                )}
                {view === 'charts' && (
                    <ChartBuilder data={dataset.rows} columns={dataset.columns} />
                )}
                {view === 'correlation' && (
                    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm p-6 overflow-hidden gap-4">
                        <div>
                            <h2 className="text-base font-semibold">Pearson Correlation Matrix</h2>
                            <p className="text-sm text-muted-foreground">
                                Green = positive correlation, Red = negative. Capped at 20 numeric columns.
                            </p>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {dataset.summary.correlationMatrix ? (
                                <CorrelationMatrix
                                    columns={dataset.summary.correlationMatrix.columns}
                                    matrix={dataset.summary.correlationMatrix.matrix}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                    At least 2 numeric columns are required for correlation analysis.
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {view === 'outliers' && (
                    <div className="flex flex-col h-full gap-6 overflow-auto">
                        <OutlierSummary outliers={dataset.summary.outliers ?? []} />
                        {(dataset.summary.outliers?.length ?? 0) > 0 && (
                            <>
                                <h3 className="text-sm font-semibold -mb-2 text-muted-foreground uppercase tracking-wide">
                                    Rows containing outlier values
                                </h3>
                                <OutlierTable
                                    data={dataset.rows}
                                    columns={dataset.columns}
                                    outliers={dataset.summary.outliers ?? []}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
