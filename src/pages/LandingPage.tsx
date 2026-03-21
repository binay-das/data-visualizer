export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                DataScope
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Upload your datasets (CSV, JSON, XLSX) and instantly visualize, analyze, and clean your data in your browser.
            </p>
            <div className="border-2 border-dashed border-muted rounded-xl p-12 w-full max-w-3xl flex flex-col items-center justify-center bg-muted/20">
                <p className="text-muted-foreground mb-4">Drag and drop files here to get started</p>
            </div>
        </div>
    )
}
