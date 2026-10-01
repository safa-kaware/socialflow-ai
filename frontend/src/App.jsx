import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={
          <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">
            The application arrives in Step 3.
          </div>
        }
      />
    </Routes>
  )
}