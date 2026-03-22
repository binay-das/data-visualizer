import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { Dataset, DataRecord } from "@/types/dataset"

interface DatasetContextType {
    datasets: Dataset[]
    currentDatasetId: string | null
    setCurrentDataset: (id: string | null) => void
    addDataset: (dataset: Dataset) => void
    deleteDataset: (id: string) => void
    updateDatasetRows: (id: string, newRows: DataRecord[]) => void
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: ReactNode }) {
    const [datasets, setDatasets] = useState<Dataset[]>(() => {
        try {
            const saved = localStorage.getItem("datascope-datasets")
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })
    const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null)

    useEffect(() => {
        localStorage.setItem("datascope-datasets", JSON.stringify(datasets))
    }, [datasets])

    const setCurrentDataset = (id: string | null) => {
        setCurrentDatasetId(id)
    }

    const addDataset = (dataset: Dataset) => {
        setDatasets(prev => [...prev, dataset])
        setCurrentDatasetId(dataset.id)
    }

    const deleteDataset = (id: string) => {
        setDatasets(prev => prev.filter(d => d.id !== id))
        if (currentDatasetId === id) {
            setCurrentDatasetId(null)
        }
    }

    const updateDatasetRows = (id: string, newRows: DataRecord[]) => {
        setDatasets(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, rows: newRows, summary: { ...d.summary, rowCount: newRows.length } }
                    : d
            )
        )
    }

    const value: DatasetContextType = {
        datasets,
        currentDatasetId,
        setCurrentDataset,
        addDataset,
        deleteDataset,
        updateDatasetRows
    }

    return (
        <DatasetContext.Provider value={value}>
            {children}
        </DatasetContext.Provider>
    )
}

export function useDatasets() {
    const context = useContext(DatasetContext)
    if (context === undefined) {
        throw new Error("useDatasets must be used within a DatasetProvider")
    }
    return context
}
