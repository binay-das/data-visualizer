import { Search, SlidersHorizontal, Check, Filter, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import type { ColumnFilter } from "./data-table";

interface DataTableToolbarProps {
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    allColumns: string[];
    visibleColumns: Set<string>;
    setVisibleColumns: (val: Set<string>) => void;
    columnFilters: ColumnFilter[];
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
}

export function DataTableToolbar({
    globalFilter, setGlobalFilter, allColumns, visibleColumns, setVisibleColumns,
    columnFilters, setColumnFilters
}: DataTableToolbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const toggleColumn = (col: string) => {
        const next = new Set(visibleColumns);
        if (next.has(col)) {
            next.delete(col);
        } else {
            next.add(col);
        }
        setVisibleColumns(next);
    }

    const addFilter = () => {
        setColumnFilters(prev => [
            ...prev,
            { id: Date.now().toString(), column: allColumns[0], operator: "contains", value: "" }
        ]);
        setShowFilters(true);
    };

    const updateFilter = (index: number, field: keyof ColumnFilter, val: string) => {
        setColumnFilters(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: val };
            return next;
        });
    };

    const removeFilter = (index: number) => {
        setColumnFilters(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col p-4 border-b gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 w-full sm:max-w-sm flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search all columns..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 max-sm:w-full">
                    <Button variant={columnFilters.length > 0 ? "default" : "outline"} size="sm" onClick={() => setShowFilters(!showFilters)} className="max-sm:flex-1">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters ({columnFilters.length})
                    </Button>

                    <div className="relative" ref={dropdownRef}>
                        <Button variant="outline" size="sm" className="flex max-sm:flex-1" onClick={() => setIsOpen(!isOpen)}>
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            View
                        </Button>
                        {isOpen && (
                            <div className="absolute right-0 top-11 w-56 rounded-md border bg-popover p-2 text-popover-foreground shadow-md z-50">
                                <div className="px-2 py-1.5 text-sm font-semibold">Toggle Columns</div>
                                <div className="h-px bg-border my-1" />
                                <div className="max-h-64 overflow-y-auto flex flex-col gap-1 p-1">
                                    {allColumns.map(col => {
                                        const isChecked = visibleColumns.has(col);
                                        return (
                                            <label key={col} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm">
                                                <div className={`flex items-center justify-center h-4 w-4 rounded border ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-primary'}`}>
                                                    {isChecked ? <Check className="h-3 w-3" /> : null}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={isChecked}
                                                    onChange={() => toggleColumn(col)}
                                                />
                                                <span className="truncate">{col}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-col gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                    {columnFilters.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">No active filters.</p>
                    ) : (
                        columnFilters.map((filter, index) => (
                            <div key={filter.id} className="flex flex-wrap items-center gap-2">
                                <select
                                    className="flex h-8 bg-background rounded-md border border-input px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring min-w-[120px] max-w-[200px] truncate"
                                    value={filter.column}
                                    onChange={e => updateFilter(index, "column", e.target.value)}
                                >
                                    {allColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <select
                                    className="flex h-8 bg-background rounded-md border border-input px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring w-32"
                                    value={filter.operator}
                                    onChange={e => updateFilter(index, "operator", e.target.value)}
                                >
                                    <option value="contains">contains</option>
                                    <option value="equals">equals</option>
                                    <option value="greater">greater than</option>
                                    <option value="less">less than</option>
                                </select>

                                <input
                                    type="text"
                                    className="flex h-8 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Value..."
                                    value={filter.value}
                                    onChange={e => updateFilter(index, "value", e.target.value)}
                                />

                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFilter(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                    <div className="flex justify-start mt-1">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={addFilter}>
                            <Plus className="mr-1 h-3 w-3" /> Add Rule
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
