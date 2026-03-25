import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatasets } from "@/hooks/useDatasets";
import { DropZone } from "@/components/file-upload/drop-zone";
import { parseCSV, parseJSON, parseExcel, generateDataset } from "@/utils/fileParser";
import { FileSpreadsheet, Clock, Database, Columns, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { datasets, addDataset, deleteDataset } = useDatasets();

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
        <div className="container mx-auto p-6 md:p-8 max-w-6xl space-y-8 min-h-[calc(100vh-64px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage and analyze your uploaded datasets.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Upload New Dataset</h2>
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <DropZone onFileDrop={handleFileDrop} isProcessing={isProcessing} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Datasets</h2>
                    {datasets.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
                            <Database className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p>No datasets found. Upload one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {datasets.map(dataset => (
                                <div key={dataset.id} className="bg-card border rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-lg max-w-[200px] sm:max-w-[300px] truncate" title={dataset.name}>{dataset.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                                                {dataset.fileType}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap text-sm text-muted-foreground gap-4 mt-2">
                                            <span className="flex items-center gap-1"><Database className="h-3 w-3" /> {dataset.summary.rowCount.toLocaleString()} rows</span>
                                            <span className="flex items-center gap-1"><Columns className="h-3 w-3" /> {dataset.summary.columnCount} columns</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0"
                                            onClick={() => deleteDataset(dataset.id)}
                                            title="Delete dataset"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
