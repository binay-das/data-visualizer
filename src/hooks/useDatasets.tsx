import { createContext, useContext, ReactNode, useState } from "react"
import { Dataset } from "@/types/dataset"

interface DatasetContextType {
    datasets: Dataset[]
    currentDatasetId: string | null
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: ReactNode }) {
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null)

    const value: DatasetContextType = {
        datasets,
        currentDatasetId
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
