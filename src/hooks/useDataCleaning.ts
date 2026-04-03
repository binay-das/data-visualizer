import { toast } from "sonner";
import { useDatasets } from "@/hooks/useDatasets";
import {
    removeDuplicates,
    fillMissingValues,
    dropColumns,
    renameColumn,
    groupData
} from "@/utils/dataCleaning";

export function useDataCleaning() {
    const { datasets, updateDatasetRows } = useDatasets();

    const handleRemoveDuplicates = (datasetId: string) => {
        const dataset = datasets.find(d => d.id === datasetId);
        if (!dataset) {
            return;
        }

        const newRows = removeDuplicates(dataset.rows);
        updateDatasetRows(datasetId, newRows, dataset.columns);
        toast.success("Duplicate rows removed successfully");
    }

    const handleFillMissingValues = (datasetId: string, column: string, strategy: 'mean' | 'median' | 'mode' | 'zero' | 'empty') => {
        const dataset = datasets.find(d => d.id === datasetId);
        if (!dataset) {
            return;
        }


        if (!column) {
            toast.error("Please select a column");
            return;
        }

        const newRows = fillMissingValues(dataset.rows, column, strategy);
        updateDatasetRows(datasetId, newRows, dataset.columns);
        toast.success(`Missing values in ${column} filled using ${strategy}`);
    }

    const handleDropColumn = (datasetId: string, column: string) => {
        const dataset = datasets.find(d => d.id === datasetId);
        if (!dataset) {
            return;
        }


        if (!column) {
            toast.error("Please select a column to drop");
            return;
        }

        const newRows = dropColumns(dataset.rows, [column]);
        const newColumns = dataset.columns.filter(c => c !== column);
        updateDatasetRows(datasetId, newRows, newColumns);
        toast.success(`Column ${column} dropped successfully`);
    }

    const handleRenameColumn = (datasetId: string, oldName: string, newName: string) => {
        const dataset = datasets.find(d => d.id === datasetId);
        if (!dataset) {
            return;
        }


        if (!oldName || !newName || dataset.columns.includes(newName)) {
            toast.error("Invalid column rename parameters");
            return
        }

        const newRows = renameColumn(dataset.rows, oldName, newName);
        const newColumns = dataset.columns.map(c => c === oldName ? newName : c);
        updateDatasetRows(datasetId, newRows, newColumns);
        toast.success(`Column ${oldName} renamed to ${newName}`);
    }

    const handleGroupData = (datasetId: string, groupCol: string, aggCol: string, method: 'sum' | 'avg' | 'count' | 'min' | 'max') => {
        const dataset = datasets.find(d => d.id === datasetId);
        if (!dataset) return;

        if (!groupCol || !aggCol) {
            toast.error("Please select valid columns for grouping and aggregation");
            return;
        }

        const newRows = groupData(dataset.rows, groupCol, aggCol, method);
        const newColumns = Object.keys(newRows[0] || {});
        updateDatasetRows(datasetId, newRows, newColumns);
        toast.success(`Data grouped by ${groupCol} using ${method} of ${aggCol}`);
    };

    return {
        removeDuplicates: handleRemoveDuplicates,
        fillMissingValues: handleFillMissingValues,
        dropColumn: handleDropColumn,
        renameColumn: handleRenameColumn,
        groupData: handleGroupData
    }
}
