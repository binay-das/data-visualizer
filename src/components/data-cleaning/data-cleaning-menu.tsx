import { useState } from "react";
import { Wand2, CopyX, Droplets, Eraser, PenLine, TableProperties } from "lucide-react";

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

import { useDatasets } from "@/hooks/useDatasets"
import { useDataCleaning } from "@/hooks/useDataCleaning"

interface DataCleaningMenuProps {
    datasetId: string
    columns: string[]
}

type CleaningAction = "duplicates" | "missing" | "drop" | "rename" | "group" | null

export function DataCleaningMenu({ datasetId, columns }: DataCleaningMenuProps) {
    const { datasets } = useDatasets()
    const { removeDuplicates, fillMissingValues, dropColumn, renameColumn, groupData } = useDataCleaning()
    const dataset = datasets.find(d => d.id === datasetId)

    const [openAction, setOpenAction] = useState<CleaningAction>(null);

    const [missingCol, setMissingCol] = useState(columns[0] || "");
    const [missingStrategy, setMissingStrategy] = useState<'mean' | 'median' | 'mode' | 'zero' | 'empty'>('mean');

    const [dropCol, setDropCol] = useState(columns[0] || "");

    const [renameOld, setRenameOld] = useState(columns[0] || "");
    const [renameNew, setRenameNew] = useState("");

    const [groupCol, setGroupCol] = useState(columns[0] || "");
    const [aggCol, setAggCol] = useState(columns[0] || "");
    const [aggMethod, setAggMethod] = useState<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    if (!dataset) return null

    const isValid = () => {
        if (openAction === "rename") {
            return !!renameOld && !!renameNew;
        }

        if (openAction === "missing") {
            return !!missingCol;
        }

        if (openAction === "drop") {
            return !!dropCol;
        }


        if (openAction === "group") {
            return !!groupCol && !!aggCol;
        }

        return true;
    }



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
        if (!openAction) return

        switch (openAction) {
            case "duplicates":
                removeDuplicates(datasetId);
                break;
            case "missing":
                if (missingCol) {
                    fillMissingValues(datasetId, missingCol, missingStrategy);
                }
                break;
            case "drop":
                if (dropCol) {
                    dropColumn(datasetId, dropCol);
                }
                break
            case "rename":
                renameColumn(datasetId, renameOld, renameNew);
                break;
            case "group":
                groupData(datasetId, groupCol, aggCol, aggMethod);
                break;
        }

        setOpenAction(null);


    }

    return (
        <Dialog open={openAction !== null} onOpenChange={(open) => !open && setOpenAction(null)}>
            <DropdownMenu>
                <DropdownMenuTrigger disabled={!dataset.rows.length} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
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
                    <DropdownMenuItem onClick={() => setOpenAction("group")}>
                        <TableProperties className="h-4 w-4 mr-2" />
                        Group Data (Pivot)
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
                        {openAction === "group" && "Group Data (Pivot)"}
                    </DialogTitle>
                    <DialogDescription>
                        {openAction === "duplicates" && "This will remove all entirely duplicate rows from your dataset. This action cannot be easily undone."}
                        {openAction === "missing" && "Choose a column and a strategy to fill in empty or null values."}
                        {openAction === "drop" && "Select a column to permanently remove from this dataset."}
                        {openAction === "rename" && "Provide a new name for an existing column."}
                        {openAction === "group" && "Select a category column and a numeric column to aggregate data. Note: this will replace the current view with the grouped data."}
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

                    {openAction === "group" && (
                        <>
                            <div className="grid gap-2">
                                <Label>Group By (Category)</Label>
                                <Select value={groupCol} onValueChange={(val) => { if (val) setGroupCol(val) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select column snippet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Aggregate Column (Value)</Label>
                                <Select value={aggCol} onValueChange={(val) => { if (val) setAggCol(val) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select numeric column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Method</Label>
                                <Select value={aggMethod} onValueChange={(val) => { if (val) setAggMethod(val as any) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select aggregation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sum">Sum</SelectItem>
                                        <SelectItem value="avg">Average</SelectItem>
                                        <SelectItem value="count">Count</SelectItem>
                                        <SelectItem value="max">Max</SelectItem>
                                        <SelectItem value="min">Min</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAction(null)}>Cancel</Button>
                    <Button onClick={handleInitialApply} disabled={!isValid()}>
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
