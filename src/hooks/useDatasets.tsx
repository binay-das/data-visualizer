import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import type { Dataset } from "@/types/dataset"

interface DatasetContextType {
    datasets: Dataset[]
    currentDatasetId: string | null
    setCurrentDataset: (id: string | null) => void
    addDataset: (dataset: Dataset) => void
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: ReactNode }) {
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null)

    const setCurrentDataset = (id: string | null) => {
        setCurrentDatasetId(id)
    }

    const addDataset = (dataset: Dataset) => {
        setDatasets(prev => [...prev, dataset])
        setCurrentDatasetId(dataset.id)
    }

    const value: DatasetContextType = {
        datasets,
        currentDatasetId,
        setCurrentDataset,
        addDataset
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
