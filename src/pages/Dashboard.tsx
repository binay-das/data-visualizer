import { useState } from "react";
import { DropZone } from "@/components/file-upload/drop-zone";

export default function Dashboard() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleFileDrop = (file: File) => {
        console.log("File dropped:", file);

    }

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
                <DropZone onFileDrop={handleFileDrop} isProcessing={isProcessing} />
            </div>
        </div>
    )
}
