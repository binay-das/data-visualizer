import type { DataRecord } from "@/types/dataset";



interface OutlierEntry {
    column: string;
    indices: number[];
    values: number[];
}



interface OutlierTableProps {
    data: DataRecord[];
    columns: string[];
    outliers: OutlierEntry[];
}



export function OutlierTable({ data, columns, outliers }: OutlierTableProps) {
    // Build a fast lookup: outlierSet[rowIndex][colName] = true
    const outlierSet: Record<number, Set<string>> = {};
    outliers.forEach(({ column, indices }) => {
        indices.forEach(idx => {
            if (!outlierSet[idx]) outlierSet[idx] = new Set();
            outlierSet[idx].add(column);
        });
    });



    // at least one outlier
    const outlierRowIndices = new Set(Object.keys(outlierSet).map(Number));


    if (outlierRowIndices.size === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground rounded-lg border bg-muted/20 text-sm">
                No outlier rows to display.
            </div>
        );
    }


    const rows = [...outlierRowIndices].sort((a, b) => a - b).slice(0, 500);



    return (
        <div className="overflow-auto rounded-xl border bg-card shadow-sm text-sm">
            <table className="w-full text-left">
                <thead className="text-xs uppercase bg-muted/50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-muted-foreground w-16">#</th>
                        {columns.map(col => (
                            <th key={col} className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">{col}</th>
                        ))}
                    </tr>
                </thead>

                
                <tbody className="divide-y">
                    {rows.map(rowIdx => (
                        <tr key={rowIdx} className="bg-destructive/5 hover:bg-destructive/10 transition-colors">
                            <td className="px-4 py-2 text-muted-foreground text-xs font-mono">{rowIdx + 1}</td>
                            {columns.map(col => {
                                const isOutlier = outlierSet[rowIdx]?.has(col);
                                return (
                                    <td
                                        key={col}
                                        className={`px-4 py-2 font-mono text-xs max-w-[200px] truncate ${isOutlier
                                                ? 'text-destructive font-bold bg-destructive/15 rounded'
                                                : 'text-muted-foreground'
                                            }`}
                                        title={String(data[rowIdx]?.[col])}
                                    >
                                        {data[rowIdx]?.[col] === null || data[rowIdx]?.[col] === undefined
                                            ? <span className="italic opacity-50">null</span>
                                            : String(data[rowIdx]?.[col])}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    );
}
