import type { DataRecord } from "@/types/dataset";
import type { ChartType } from "./chart-builder";


interface ChartRendererProps {
    type: ChartType;
    data: DataRecord[];
    xAxis: string;
    yAxis?: string;

}



export function ChartRenderer({ type, data, xAxis, yAxis }: ChartRendererProps) {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground">No data available for charting.</div>;
    }


    if (!xAxis && type !== 'histogram') {
        return <div className="text-muted-foreground">Please select an X-Axis.</div>;
    }



    
    return (
        <div className="text-muted-foreground flex flex-col items-center gap-2">
            <p>Chart type "{type}" will be rendered here.</p>
            <p className="text-sm">X-Axis: {xAxis}</p>
            {yAxis && <p className="text-sm">Y-Axis: {yAxis}</p>}
        </div>
    );
}
