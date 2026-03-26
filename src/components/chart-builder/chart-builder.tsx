import { useState } from "react";
import type { DataRecord } from "@/types/dataset";
import { ChartRenderer } from "./chart-renderer";


interface ChartBuilderProps {
    data: DataRecord[];
    columns: string[];
}



export type ChartType = "bar" | "line" | "scatter" | "pie" | "histogram";


export function ChartBuilder({ data, columns }: ChartBuilderProps) {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [xAxis, setXAxis] = useState<string>(columns[0] || "");
    const [yAxis, setYAxis] = useState<string>(columns[1] || columns[0] || "");




    return (
        <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden p-4 gap-4">
            <div className="flex flex-wrap gap-4 items-end bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Chart Type</label>
                    <select
                        className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as ChartType)}
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="pie">Pie Chart</option>
                        <option value="histogram">Histogram</option>
                    </select>
                </div>


                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{chartType === 'pie' ? 'Label Column' : 'X-Axis / Category'}</label>
                    <select
                        className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                        value={xAxis}
                        onChange={(e) => setXAxis(e.target.value)}
                    >
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>


                {chartType !== 'histogram' && (
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">{chartType === 'pie' ? 'Value Column' : 'Y-Axis / Measure'}</label>
                        <select
                            className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                            value={yAxis}
                            onChange={(e) => setYAxis(e.target.value)}
                        >
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                )}


            </div>

            <div className="flex-1 min-h-[400px] border rounded-lg bg-card flex items-center justify-center p-4">
                <ChartRenderer
                    type={chartType}
                    data={data}
                    xAxis={xAxis}
                    yAxis={chartType === 'histogram' ? undefined : yAxis}
                />

                
            </div>
        </div>
    );
}
