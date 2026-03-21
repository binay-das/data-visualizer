import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import DatasetWorkspace from "./pages/DatasetWorkspace"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dataset/:id" element={<DatasetWorkspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
