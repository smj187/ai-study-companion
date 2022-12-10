import { Header } from "./components/header"
import { Routes, Route } from "react-router-dom"
import { AppView } from "./views/app-view"
import { UploadView } from "./views/upload-view"
import { RealtimeView } from "./views/realtime-view"
import { AppContextProvider } from "./context/app-context"

export const App: React.FC = () => {
  return (
    <AppContextProvider>
      <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen w-full relative">
        <Header />
        <main className="max-w-7xl mx-auto pt-24">
          <Routes>
            <Route path="/" element={<AppView />} />
            <Route path="/upload" element={<UploadView />} />
            <Route path="/exam" element={<RealtimeView />} />
          </Routes>
        </main>
      </div>
    </AppContextProvider>
  )
}
