import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
    onFileDrop: (file: File) => void
    isProcessing?: boolean
}

export function DropZone({ onFileDrop, isProcessing = false }: DropZoneProps) {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [isPasting, setIsPasting] = useState<boolean>(false);
    const [pasteText, setPasteText] = useState<string>("");
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

    const handlePasteSubmit = () => {
        if (!pasteText.trim()) return;

        const isJson = pasteText.trim().startsWith('[') || pasteText.trim().startsWith('{');
        const fileName = isJson ? 'pasted_data.json' : 'pasted_data.csv';
        const file = new File([pasteText], fileName, { type: 'text/plain' });

        onFileDrop(file);

    }

    if (isPasting) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <textarea
                    className="min-h-[250px] w-full p-4 rounded-xl border bg-background text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y font-mono"
                    placeholder="Paste your raw CSV or JSON array here..."
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    disabled={isProcessing}
                />
                <div className="flex justify-end gap-3 flex-wrap">
                    <Button variant="outline" onClick={() => setIsPasting(false)} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button onClick={handlePasteSubmit} disabled={isProcessing || !pasteText.trim()}>
                        {isProcessing ? "Processing..." : "Process Data"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragActive ? "border-foreground bg-muted" : "border-muted-foreground/25 hover:border-foreground/50"
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
                    <UploadCloud className={`h-12 w-12 ${isDragActive ? "text-foreground" : "text-muted-foreground/50"} `} />
                    <div>
                        <h3 className="text-xl font-semibold">Drop your dataset here or click to browse</h3>
                        <p className="text-sm text-muted-foreground mt-2">Supports CSV, JSON, and Excel files</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center pt-2">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setIsPasting(true)} disabled={isProcessing}>
                    <FileText className="w-4 h-4 mr-2" />
                    Or paste raw text
                </Button>
            </div>
        </div>
    )
}
