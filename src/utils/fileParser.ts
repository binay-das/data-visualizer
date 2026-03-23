import Papa from 'papaparse'
import * as XLSX from 'xlsx'
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

export const parseExcel = async (file: File): Promise<DataRecord[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                const workbook = XLSX.read(data, {
                    type: 'array'
                })

                const firstSheetName = workbook.SheetNames[0]

                const worksheet = workbook.Sheets[firstSheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet)

                resolve(jsonData as DataRecord[])
            } catch (error) {
                reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`))
            }
        }
        reader.onerror = (error) => reject(error);


        
        reader.readAsArrayBuffer(file);
    })
}
