import { useState } from "react";
import { Wand2, CopyX, Droplets, Eraser, PenLine } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useDatasets } from "@/hooks/useDatasets";
import {
    removeDuplicates,
    fillMissingValues,
    dropColumns,
    renameColumn
} from "@/utils/dataCleaning"
import { toast } from "sonner";

interface DataCleaningMenuProps {
    datasetId: string
    columns: string[]
}

type CleaningAction = "duplicates" | "missing" | "drop" | "rename" | null

export function DataCleaningMenu({ datasetId, columns }: DataCleaningMenuProps) {
    const { datasets, updateDatasetRows } = useDatasets();
    const dataset = datasets.find(d => d.id === datasetId);

    const [openAction, setOpenAction] = useState<CleaningAction>(null);

    const [missingCol, setMissingCol] = useState(columns[0] || "");
    const [missingStrategy, setMissingStrategy] = useState<'mean' | 'median' | 'mode' | 'zero' | 'empty'>('mean');

    const [dropCol, setDropCol] = useState(columns[0] || "");

    const [renameOld, setRenameOld] = useState(columns[0] || "");
    const [renameNew, setRenameNew] = useState("");

    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    if (!dataset) return null





    const handleInitialApply = () => {
        if (!openAction) {
            return;
        }

        if (openAction === "duplicates" || openAction === "drop") {
            setIsConfirmOpen(true);


        } else {
            executeAction();
        }
    }



    const executeAction = () => {
        if (!openAction) {
            return;

        }

        let newRows = [...dataset.rows];
        let newColumns = [...dataset.columns];

        switch (openAction) {
            case "duplicates":
                newRows = removeDuplicates(newRows);
                break;
            case "missing":
                if (missingCol) {
                    newRows = fillMissingValues(newRows, missingCol, missingStrategy);
                }
                break;
            case "drop":
                if (dropCol) {
                    newRows = dropColumns(newRows, [dropCol]);
                    newColumns = newColumns.filter(c => c !== dropCol);
                }
                break;
            case "rename":
                if (renameOld && renameNew && !newColumns.includes(renameNew)) {
                    newRows = renameColumn(newRows, renameOld, renameNew);
                    newColumns = newColumns.map(c => c === renameOld ? renameNew : c);
                } else {
                    toast.error("Invalid column rename parameters");
                    return;
                }
                break;
        }

        updateDatasetRows(datasetId, newRows, newColumns);
        setOpenAction(null);
        toast.success("Dataset cleaned successfully");
    }

    return (
        <Dialog open={openAction !== null} onOpenChange={(open) => !open && setOpenAction(null)}>
            <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                    <Wand2 className="h-4 w-4" />
                    Clean Data
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Cleaning Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenAction("duplicates")}>
                        <CopyX className="h-4 w-4 mr-2" />
                        Remove Duplicates
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAction("missing")}>
                        <Droplets className="h-4 w-4 mr-2" />
                        Fill Missing Values
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAction("drop")}>
                        <Eraser className="h-4 w-4 mr-2" />
                        Drop Column
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAction("rename")}>
                        <PenLine className="h-4 w-4 mr-2" />
                        Rename Column
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {openAction === "duplicates" && "Remove Duplicates"}
                        {openAction === "missing" && "Fill Missing Values"}
                        {openAction === "drop" && "Drop Column"}
                        {openAction === "rename" && "Rename Column"}
                    </DialogTitle>
                    <DialogDescription>
                        {openAction === "duplicates" && "This will remove all entirely duplicate rows from your dataset. This action cannot be easily undone."}
                        {openAction === "missing" && "Choose a column and a strategy to fill in empty or null values."}
                        {openAction === "drop" && "Select a column to permanently remove from this dataset."}
                        {openAction === "rename" && "Provide a new name for an existing column."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 grid gap-4">
                    {openAction === "missing" && (
                        <>
                            <div className="grid gap-2">
                                <Label>Column</Label>
                                <Select value={missingCol} onValueChange={(val) => { if (val) setMissingCol(val) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Strategy</Label>
                                <Select value={missingStrategy} onValueChange={(val) => { if (val) setMissingStrategy(val as any) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select strategy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mean">Mean (Numeric only)</SelectItem>
                                        <SelectItem value="median">Median (Numeric only)</SelectItem>
                                        <SelectItem value="mode">Mode (Most frequent)</SelectItem>
                                        <SelectItem value="zero">Fill with 0</SelectItem>
                                        <SelectItem value="empty">Fill with empty string</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {openAction === "drop" && (
                        <div className="grid gap-2">
                            <Label>Column to Drop</Label>
                            <Select value={dropCol} onValueChange={(val) => { if (val) setDropCol(val) }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {columns.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {openAction === "rename" && (
                        <>
                            <div className="grid gap-2">
                                <Label>Original Column</Label>
                                <Select value={renameOld} onValueChange={(val) => { if (val) setRenameOld(val) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>New Name</Label>
                                <Input
                                    placeholder="Enter new column name"
                                    value={renameNew}
                                    onChange={e => setRenameNew(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAction(null)}>Cancel</Button>
                    <Button onClick={handleInitialApply}>
                        {openAction === "duplicates" ? "Remove Duplicates" : "Apply Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is destructive and cannot be undone.
                            {openAction === "drop" && ` You are about to permanently remove the "${dropCol}" column.`}
                            {openAction === "duplicates" && " You are about to remove duplicate rows."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setIsConfirmOpen(false)
                            executeAction()
                        }}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    )
}
