import { useState, useMemo } from "react";
import type { DataRecord } from "@/types/dataset";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";



interface DataTableProps {
    data: DataRecord[];
    columns: string[];
}


type SortDirection = "asc" | "desc" | null;



export function DataTable({ data, columns }: DataTableProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);


    const handleSort = (column: string) => {
        if (sortColumn === column) {
            if (sortDirection === "asc") setSortDirection("desc");
            else if (sortDirection === "desc") {
                setSortDirection(null);
                setSortColumn(null);
            }
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
        setCurrentPage(1);
    };

    const sortedData = useMemo(() => {
        if (!sortColumn || !sortDirection) return data;

        return [...data].sort((a, b) => {
            const valA = a[sortColumn];
            const valB = b[sortColumn];


            
            if (valA == null) return sortDirection === "asc" ? 1 : -1;
            if (valB == null) return sortDirection === "asc" ? -1 : 1;


            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === "asc" ? valA - valB : valB - valA;
            }


            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();



            if (strA < strB) return sortDirection === "asc" ? -1 : 1;
            if (strA > strB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50 sticky top-0 z-10 shadow-sm backdrop-blur-md">
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="px-6 py-3 font-medium cursor-pointer hover:bg-muted transition-colors whitespace-nowrap" onClick={() => handleSort(column)}>
                                    <div className="flex items-center gap-1">
                                        {column}
                                        <span className="text-muted-foreground w-4">
                                            {sortColumn === column ? (
                                                sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                            ) : (
                                                <ArrowUpDown className="w-4 h-4 opacity-30" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y text-muted-foreground">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    {columns.map(col => (
                                        <td key={col} className="px-6 py-3 max-w-[300px] truncate" title={String(row[col])}>
                                            {row[col] === null || row[col] === undefined ? <span className="text-muted-foreground/50 italic">null</span> : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t bg-card mt-auto shrink-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page:</span>
                    <select
                        className="bg-muted border border-border rounded px-2 py-1 outline-none text-foreground"
                        value={rowsPerPage}
                        onChange={e => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight className="w-4 h-4" />


                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
