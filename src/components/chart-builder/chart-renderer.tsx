import type { DataRecord } from "@/types/dataset";
import type { ChartType } from "./chart-builder";

import {
    BarChart, Bar,
    LineChart, Line,
    ScatterChart, Scatter,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface ChartRendererProps {
    type: ChartType;
    data: DataRecord[];
    xAxis: string;
    yAxis?: string;
}

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function ChartRenderer({ type, data, xAxis, yAxis }: ChartRendererProps) {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground font-medium flex items-center justify-center h-full">No data available for charting.</div>;
    }

    if (!xAxis && type !== 'histogram') {
        return <div className="text-muted-foreground font-medium flex items-center justify-center h-full">Please select an X-Axis.</div>;
    }

    if (type === 'bar' || type === 'line' || type === 'scatter') {
        if (!yAxis) return <div className="text-muted-foreground font-medium flex items-center justify-center h-full">Please select a Y-Axis.</div>;

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
                ) : type === 'line' ? (
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                        <Line type="monotone" dataKey={yAxis} stroke="var(--color-primary, #3b82f6)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                ) : (
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey={xAxis} name={xAxis} tick={{ fontSize: 12 }} />
                        <YAxis dataKey={yAxis} name={yAxis} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                        <Scatter name="Data" data={chartData} fill="var(--color-primary, #3b82f6)" />
                    </ScatterChart>
                )}
            </ResponsiveContainer>
        );
    }

    if (type === 'pie') {
        if (!yAxis) return <div className="text-muted-foreground font-medium flex items-center justify-center h-full">Please select a Value Column.</div>;

        const pieDataMap = new Map<string, number>();
        data.forEach(row => {
            const key = String(row[xAxis] || 'Unknown');
            const val = Number(row[yAxis]) || 0;
            pieDataMap.set(key, (pieDataMap.get(key) || 0) + val);
        });

        const pieData = Array.from(pieDataMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 15);

        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        innerRadius={80}
                        fill="var(--color-primary, #3b82f6)"
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    }

    return <div className="text-muted-foreground font-medium flex items-center justify-center h-full">Chart type "{type}" is coming in the next commit!</div>;
}
