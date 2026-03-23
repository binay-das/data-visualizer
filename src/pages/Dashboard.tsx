import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatasets } from "@/hooks/useDatasets";
import { DropZone } from "@/components/file-upload/drop-zone";
import { parseCSV, parseJSON, parseExcel, generateDataset } from "@/utils/fileParser";

export default function Dashboard() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { addDataset } = useDatasets();

    const handleFileDrop = async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            const fileName = file.name;
            const extension = fileName.split('.').pop()?.toLowerCase();
            let rawData: any[] = [];

            if (extension === 'csv') {
                rawData = await parseCSV(file);
            } else if (extension === 'json') {
                rawData = await parseJSON(file);
            } else if (extension === 'xlsx' || extension === 'xls') {
                rawData = await parseExcel(file);
            } else {
                throw new Error("Unsupported file format. Please upload CSV, JSON, or Excel.");
            }

            const dataset = generateDataset(rawData, fileName, extension || 'unknown');

            if (dataset) {
                addDataset(dataset);
                navigate(`/dataset/${dataset.id}`);
            } else {
                throw new Error("Could not extract data from the file.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during file processing");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}
                <DropZone onFileDrop={handleFileDrop} isProcessing={isProcessing} />
            </div>
        </div>
    );
}
