import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

interface DropZoneProps {
    onFileDrop: (file: File) => void
    isProcessing?: boolean
}

export function DropZone({ onFileDrop, isProcessing = false }: DropZoneProps) {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleClick = () => {
        if (!isProcessing) {
            fileInputRef.current?.click()
        }
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileDrop(e.target.files[0])
            e.target.value = ''
        }
    }

    return (
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            } ${isProcessing ? "opacity-50 pointer-events-none" : "cursor-pointer"} `}

            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".csv,.json,.xlsx"
            />
            <div className="flex flex-col items-center justify-center gap-4">
                <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"} `} />
                <div>
                    <h3 className="text-lg font-semibold">Drop your dataset here or click to browse</h3>
                    <p className="text-sm text-muted-foreground mt-1">Supports CSV, JSON, and Excel files</p>
                </div>
            </div>
        </div>
    )
}
