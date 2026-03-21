import { Link, Outlet } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold text-xl">DataScope</span>
                        </Link>
                        <nav className="flex gap-6">
                            <Link
                                to="/dashboard"
                                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Dashboard
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
