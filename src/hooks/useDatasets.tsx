import { createContext, useContext, ReactNode } from "react"
import { Dataset } from "@/types/dataset"

interface DatasetContextType {

}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: ReactNode }) {
    const value: DatasetContextType = {

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
