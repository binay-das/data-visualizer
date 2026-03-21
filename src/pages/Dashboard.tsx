export default function Dashboard() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center h-48 cursor-pointer hover:border-primary transition-colors">
                    <p className="font-medium text-lg">+ Upload New Dataset</p>
                </div>
            </div>
        </div>
    )
}
