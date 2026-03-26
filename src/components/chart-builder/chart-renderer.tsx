import type { DataRecord } from "@/types/dataset";
import type { ChartType } from "./chart-builder";

import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface ChartRendererProps {
    type: ChartType;
    data: DataRecord[];
    xAxis: string;
    yAxis?: string;

}



export function ChartRenderer({ type, data, xAxis, yAxis }: ChartRendererProps) {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground font-medium">No data available for charting.</div>;
    }


    if (!xAxis && type !== 'histogram') {
        return <div className="text-muted-foreground font-medium">Please select an X-Axis.</div>;
    }

    if (type === 'bar' || type === 'line') {
        if (!yAxis) return <div className="text-muted-foreground font-medium">Please select a Y-Axis.</div>;

        const chartData = data.slice(0, 1000);

        return (
            <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                        <Bar dataKey={yAxis} fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                        <Line type="monotone" dataKey={yAxis} stroke="var(--color-primary, #3b82f6)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                )}
            </ResponsiveContainer>
        );
    }
    

    return <div className="text-muted-foreground font-medium">Chart type "{type}" is coming in the next commit!</div>;
}
