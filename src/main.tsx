import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { DatasetProvider } from './hooks/useDatasets.tsx'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="datascope-theme">
      <DatasetProvider>
        <App />
        <Toaster />
      </DatasetProvider>
    </ThemeProvider>
  </StrictMode>,
)
