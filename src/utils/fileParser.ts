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
