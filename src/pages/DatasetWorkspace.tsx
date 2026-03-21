import { useParams } from "react-router-dom"

export default function DatasetWorkspace() {
    const { id } = useParams()

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dataset Workspace</h1>
            </div>
            <div className="flex-1 p-6">
                <div className="border rounded-xl h-full flex items-center justify-center bg-muted/10 text-muted-foreground">
                    Workspace for Dataset ID: {id}
                </div>
            </div>
        </div>
    )
}
