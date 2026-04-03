import type { DataRecord } from "../types/dataset";

export function removeDuplicates(rows: DataRecord[]): DataRecord[] {
    const seen = new Set<string>();
    return rows.filter(row => {
        const str = JSON.stringify(row);
        if (seen.has(str)) return false;
        seen.add(str);
        return true;
    });
}



export function fillMissingValues(
    rows: DataRecord[],
    column: string,
    strategy: 'mean' | 'median' | 'mode' | 'zero' | 'empty'
): DataRecord[] {
    let fillValue: string | number | boolean | null = null;

    if (strategy === 'zero') fillValue = 0;
    if (strategy === 'empty') fillValue = "";

    if (strategy === 'mean' || strategy === 'median') {
        const values = rows
            .map(r => r[column])
            .filter(v => v !== null && v !== undefined && v !== "")
            .map(Number)
            .filter(v => !isNaN(v));

        if (values.length > 0) {
            if (strategy === 'mean') {
                fillValue = values.reduce((a, b) => a + b, 0) / values.length;
            } else if (strategy === 'median') {
                const sorted = [...values].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                fillValue = sorted.length % 2 !== 0
                    ? sorted[mid]
                    : (sorted[mid - 1] + sorted[mid]) / 2;
            }
        } else {
            fillValue = 0;
        }
    }


    if (strategy === 'mode') {
        const counts: Record<string, number> = {};
        let maxCount = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let modeValue: any = null;

        for (const row of rows) {
            const val = row[column];
            if (val !== null && val !== undefined && val !== "") {
                const strVal = String(val);
                counts[strVal] = (counts[strVal] || 0) + 1;
                if (counts[strVal] > maxCount) {
                    maxCount = counts[strVal];
                    modeValue = val;
                }
            }
        }
        fillValue = modeValue ?? "";
    }

    return rows.map(row => {
        const val = row[column];
        if (val === null || val === undefined || val === "") {
            return { ...row, [column]: fillValue };
        }
        return row;
    });
}

export function dropColumns(rows: DataRecord[], columnsToDrop: string[]): DataRecord[] {
    const dropSet = new Set(columnsToDrop);
    return rows.map(row => {
        const newRow: DataRecord = {};
        for (const key in row) {
            if (!dropSet.has(key)) {
                newRow[key] = row[key];
            }
        }
        return newRow;
    });
}










export function renameColumn(rows: DataRecord[], oldName: string, newName: string): DataRecord[] {
    return rows.map(row => {
        const newRow: DataRecord = {};
        for (const key in row) {
            if (key === oldName) {
                newRow[newName] = row[key];
            } else {
                newRow[key] = row[key];
            }
        }
        return newRow;
    });
}

export function groupData(
    rows: DataRecord[],
    groupCol: string,
    aggCol: string,
    method: 'sum' | 'avg' | 'count' | 'min' | 'max'
): DataRecord[] {
    const map = new Map<string, number[]>();

    for (const row of rows) {
        const key = String(row[groupCol] || "Unknown");
        if (!map.has(key)) map.set(key, []);

        const val = Number(row[aggCol]);
        if (!isNaN(val)) {
            map.get(key)!.push(val);
        }
    }

    const result: DataRecord[] = [];
    map.forEach((values, key) => {
        let aggValue = 0;
        if (values.length > 0) {
            switch (method) {
                case "sum":
                    aggValue = values.reduce((a, b) => a + b, 0);
                    break;
                case "avg":
                    aggValue = values.reduce((a, b) => a + b, 0) / values.length;
                    break;
                case "count":
                    aggValue = values.length;
                    break;
                case "min":
                    aggValue = Math.min(...values);
                    break;
                case "max":
                    aggValue = Math.max(...values);
                    break;
            }
        }

        result.push({
            [groupCol]: key,
            [`${method}_of_${aggCol}`]: aggValue
        });
    });

    return result;
}
