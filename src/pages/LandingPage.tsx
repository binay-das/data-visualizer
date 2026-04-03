import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatasets } from "@/hooks/useDatasets";
import { Zap, Shield, BarChart3 } from "lucide-react";
import { DropZone } from "@/components/file-upload/drop-zone";
import { parseCSV, parseJSON, parseExcel, generateDataset } from "@/utils/fileParser";

export default function LandingPage() {
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

            }
            else if (extension === 'json') {
                rawData = await parseJSON(file);

            }
            else if (extension === 'xlsx' || extension === 'xls') {
                rawData = await parseExcel(file);
            }

            else {
                throw new Error("Unsupported file format. Please upload CSV, JSON, or Excel");
            }

            const dataset = generateDataset(rawData, fileName, extension || 'unknown');

            if (dataset) {
                addDataset(dataset);
                navigate(`/dataset/${dataset.id}`);
            }

            else {
                throw new Error("Could not extract data from the file");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during file processing");

            console.error(err);

        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-foreground">
                        Analyze Data in Seconds
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A powerful, completely client-side data analysis tool. Upload CSV, JSON, or Excel files to visualize, clean, and extract insights instantly.
                    </p>

                    <div className="mx-auto max-w-3xl mt-12 bg-card rounded-2xl shadow-xl border p-2 relative overflow-hidden">
                        <div className="relative z-10 p-6 md:p-8">
                            {error && (
                                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 text-sm font-medium text-left">
                                    {error}
                                </div>
                            )}
                            <DropZone onFileDrop={handleFileDrop} isProcessing={isProcessing} />
                        </div>
                    </div>
                </div>
            </main>

            <section className="bg-muted/30 border-t py-24">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="bg-muted p-4 rounded-full border shadow-sm">
                                <Zap className="w-8 h-8 text-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">Lightning Fast</h3>
                            <p className="text-muted-foreground">Everything runs in your browser. No server delays, no waiting in queues.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="bg-muted p-4 rounded-full border shadow-sm">
                                <Shield className="w-8 h-8 text-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">100% Private</h3>
                            <p className="text-muted-foreground">Your data never leaves your device. Total security for sensitive datasets.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="bg-muted p-4 rounded-full border shadow-sm">
                                <BarChart3 className="w-8 h-8 text-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">Rich Analytics</h3>
                            <p className="text-muted-foreground">Automatic statistics, type detection, and interactive charts built-in.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
