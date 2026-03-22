export type DataType = "numeric" | "categorical" | "boolean" | "datetime" | "text"

export interface ColumnStats {
    name: string
    type: DataType
    uniqueCount: number
    missingCount: number

    // numeric columns
    numericStats?: {
        min: number
        max: number
        mean: number
        median: number
        stdDev: number
        q1: number
        q3: number
        iqr: number
    }

    // categorical columns
    topValues?: Array<{
        value: string
        count: number
    }>
}

export interface DatasetSummary {
    rowCount: number
    columnCount: number
    columns: ColumnStats[]
    correlationMatrix?: {
        columns: string[]
        matrix: number[][]
    }
    outliers?: Array<{
        column: string
        indices: number[]
        values: number[]
    }>
}

export type DataRecord = Record<string, string | number | boolean | null>

export interface Dataset {
    id: string
    name: string
    uploadedAt: string
    rows: DataRecord[]
    columns: string[]
    summary: DatasetSummary
    fileType: string
}
