import Papa from 'papaparse'
import type { DataRecord } from '@/types/dataset'

export const parseCSV = (file: File): Promise<DataRecord[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data as DataRecord[])
            },
            error: (error) => {
                reject(error)
            }
        })
    })
}




export const parseJSON = async (file: File): Promise<DataRecord[]> => {
    try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (!Array.isArray(data)) {
            throw new Error("JSON file must contain an array of objects")
        }

        if (data.length > 0 && (typeof data[0] !== 'object' || data[0] === null)) {
            throw new Error("JSON array must contain objects")
        }

        return data as DataRecord[]
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}
