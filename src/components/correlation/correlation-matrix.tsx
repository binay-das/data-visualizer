interface CorrelationMatrixProps {
    columns: string[];
    matrix: number[][];
}

function cellColor(r: number): string {
    // r ∈ [-1, 1] → red=-1, neutral=0, green=+1
    const clamped = Math.max(-1, Math.min(1, r));
    if (clamped >= 0) {
        // 0 → white, 1 → green
        const g = Math.round(140 + 115 * clamped);
        const rb = Math.round(255 - 115 * clamped);

        
        return `rgb(${rb},${g},${rb})`;


    } else {
        // 0 → white, -1 → red
        const abs = -clamped;
        const r2 = Math.round(255);
        const gb = Math.round(255 - 140 * abs);
        
        return `rgb(${r2},${gb},${gb})`;


    }
}

function textColor(r: number): string {
    return Math.abs(r) > 0.5 ? '#fff' : 'inherit';
}




export function CorrelationMatrix({ columns, matrix }: CorrelationMatrixProps) {
    if (!columns.length) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                No numeric columns available for correlation analysis.
            </div>
        );
    }


    const truncate = (s: string, n = 10) => s.length > n ? s.slice(0, n) + '…' : s;



    return (
        <div className="overflow-auto h-full">
            <table className="border-collapse text-xs font-mono select-none mx-auto">
                <thead>

                    <tr>
                        <th className="w-24 p-1" />
                        {columns.map(col => (
                            <th
                                key={col}
                                className="p-1 text-center max-w-[60px] overflow-hidden text-ellipsis text-muted-foreground font-semibold whitespace-nowrap"
                                title={col}
                            >
                                {truncate(col)}
                            </th>
                        ))}
                    </tr>



                </thead>
                <tbody>
                    {matrix.map((row, i) => (

                        <tr key={columns[i]}>
                            <td
                                className="p-1 pr-2 text-right text-muted-foreground font-semibold whitespace-nowrap"
                                title={columns[i]}
                            >
                                {truncate(columns[i])}
                            </td>
                            {row.map((val, j) => (
                                <td
                                    key={j}
                                    className="w-14 h-14 text-center align-middle border border-border/30 rounded-sm"
                                    style={{
                                        backgroundColor: cellColor(val),
                                        color: textColor(val),
                                        minWidth: '3.5rem',
                                        minHeight: '3.5rem',
                                    }}
                                    title={`${columns[i]} × ${columns[j]}: ${val.toFixed(3)}`}
                                >
                                    {val.toFixed(2)}

                                </td>

                            ))}
                        </tr>




                    ))}
                </tbody>
            </table>
        </div>
    );
}
