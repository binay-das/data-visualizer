import type { DataType, DataRecord, ColumnStats, DatasetSummary } from "@/types/dataset";



export function extractColumnValues(rows: DataRecord[], column: string): any[] {
    return rows.map(row => row[column]);
}

export function detectColumnType(values: any[]): DataType {
    // filter out null/undefined/empty string
    const validValues = values.filter(val => val !== null && val !== undefined && val !== '');

    if (validValues.length === 0) return 'text';

    const sampleSize = Math.min(validValues.length, 100);
    const sample = validValues.slice(0, sampleSize);

    // boolean
    const isBoolean = sample.every(v => {
        if (typeof v === 'boolean') {
            return true;
        }

        if (typeof v === 'string') {
            const lower = String(v).toLowerCase().trim();
            return ['true', 'false', 'yes', 'no', '1', '0'].includes(lower);


        }
        if (typeof v === 'number') {
            return v === 0 || v === 1;

        }

        return false;

    });

    if (isBoolean) return 'boolean';

    // numeric
    const isNumeric = sample.every(v => {
        if (typeof v === 'number') {
            return true;

        }

        if (typeof v === 'string') {
            const trimmed = v.trim();
            if (trimmed === '') {
                return false;
            }


            return !isNaN(Number(trimmed));
        }


        return false;

    })
    if (isNumeric) return 'numeric';

    // datetime
    const isDate = sample.every(v => {
        if (typeof v === 'number') {

            return false;

        }

        if (v instanceof Date) {
            return true;
        }

        if (typeof v === 'string') {
            const trimmed = v.trim();
            if (trimmed === '') {
                return false;
            }

            // If purely a number, don't parse as date
            if (!isNaN(Number(trimmed))) {
                return false;
            }

            return !isNaN(Date.parse(trimmed));
        }
        return false;
    })
    if (isDate) {
        return 'datetime';
    }


    // categorical

    const uniqueItems = new Set(validValues.map(String));
    const uniqueRatio = uniqueItems.size / validValues.length;

    if (uniqueItems.size <= 20 || uniqueRatio < 0.1) {
        return 'categorical';
    }

    return 'text';
}


export function computeColumnStats(
    rows: DataRecord[],
    columns: string[]
): ColumnStats[] {

    return columns.map(column => {
        const values = extractColumnValues(rows, column);

        const type = detectColumnType(values);

        const missingCount = values.filter(
            v => v === null || v === undefined || v === ''
        ).length;

        const validValues = values.filter(
            v => v !== null && v !== undefined && v !== ''
        );

        const uniqueSet = new Set(validValues.map(v => String(v)));
        const uniqueCount = uniqueSet.size;





        let numericStats: any;

        // numeric
        if (type === "numeric") {
            const nums = validValues.map(v => Number(v)).filter(v => !isNaN(v));

            if (nums.length > 0) {
                const sorted = [...nums].sort((a, b) => a - b);

                const mean = nums.reduce((a, b) => a + b, 0) / nums.length;



                const median = sorted.length % 2 === 0
                    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                    : sorted[Math.floor(sorted.length / 2)];

                const variance = nums.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / nums.length;

                const stdDev = Math.sqrt(variance);



                const q1 = sorted[Math.floor(sorted.length * 0.25)];
                const q3 = sorted[Math.floor(sorted.length * 0.75)];
                const iqr = q3 - q1;

                numericStats = {
                    min: Math.min(...nums),
                    max: Math.max(...nums),
                    mean,
                    median,
                    stdDev,
                    q1,
                    q3,
                    iqr


                };
            }
        }

        let topValues: any;

        if (type === "categorical" || type === "boolean") {
            const freqMap: Record<string, number> = {};

            validValues.forEach(v => {
                const key = String(v);
                freqMap[key] = (freqMap[key] || 0) + 1;
            });


            topValues = Object.entries(freqMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([value, count]) => ({ value, count }));


        }

        return {
            name: column,
            type,
            uniqueCount,
            missingCount,
            numericStats,
            topValues


        } as ColumnStats;
    });
}

export function analyzeDataset(rows: DataRecord[]): DatasetSummary {
    if (!rows || rows.length === 0) {
        return {
            rowCount: 0,
            columnCount: 0,
            columns: []
        };

    }

    const columns = Object.keys(rows[0]);
    const columnStats = computeColumnStats(rows, columns);



    return {
        rowCount: rows.length,
        columnCount: columns.length,
        columns: columnStats
    };
}










export function computePearsonCorrelation(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length);
    if (n === 0) return NaN;


    const meanA = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
    const meanB = b.slice(0, n).reduce((s, v) => s + v, 0) / n;



    let num = 0, denomA = 0, denomB = 0;
    for (let i = 0; i < n; i++) {
        const da = a[i] - meanA;
        const db = b[i] - meanB;
        num += da * db;
        denomA += da * da;
        denomB += db * db;
    }



    const denom = Math.sqrt(denomA * denomB);

    
    return denom === 0 ? 0 : num / denom;
}