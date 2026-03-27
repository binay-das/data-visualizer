interface OutlierEntry {
    column: string;
    indices: number[];
    values: number[];
}


interface OutlierSummaryProps {
    outliers: OutlierEntry[];
}


export function OutlierSummary({ outliers }: OutlierSummaryProps) {
    if (!outliers || outliers.length === 0) {

        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground rounded-lg border bg-muted/20 text-sm">
                No outliers detected in any numeric column.
            </div>
        );


    }

    return (
        <div className="overflow-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50">

                    <tr>
                        <th className="px-6 py-3 font-semibold text-muted-foreground">Column</th>
                        <th className="px-6 py-3 font-semibold text-muted-foreground text-right">Outlier Count</th>
                        <th className="px-6 py-3 font-semibold text-muted-foreground text-right">Min Outlier</th>
                        <th className="px-6 py-3 font-semibold text-muted-foreground text-right">Max Outlier</th>
                    </tr>
                </thead>



                <tbody className="divide-y">
                    {outliers.map(({ column, values }) => (
                        <tr key={column} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-3 font-medium">{column}</td>
                            <td className="px-6 py-3 text-right">
                                <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-0.5">
                                    {values.length}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-muted-foreground">
                                {Math.min(...values).toFixed(3)}
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-muted-foreground">
                                {Math.max(...values).toFixed(3)}
                            </td>
                        </tr>

                        
                    ))}
                </tbody>
            </table>

        </div>
    );
}
