import { useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";

interface DropZoneProps {
    onFileDrop: (file: File) => void
    isProcessing?: boolean
}

export function DropZone({ onFileDrop, isProcessing = false }: DropZoneProps) {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);


    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {

        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {

        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            onFileDrop(file)
        }
    }

    return (
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                } ${isProcessing ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}

            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                    <h3 className="text-lg font-semibold">Drop your dataset here</h3>
                    <p className="text-sm text-muted-foreground mt-1">Supports CSV, JSON, and Excel files</p>
                </div>
            </div>
        </div>
    )
}
