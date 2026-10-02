import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppLayout from './components/app/AppLayout'
import Dashboard from './pages/app/Dashboard'
import Placeholder from './components/app/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Placeholder title="Create Content" />} />
        <Route path="queue" element={<Placeholder title="Queue" />} />
        <Route path="calendar" element={<Placeholder title="Calendar" />} />
        <Route path="history" element={<Placeholder title="History" />} />
        <Route path="analytics" element={<Placeholder title="Analytics" />} />
        <Route path="automation" element={<Placeholder title="Automation" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>
    </Routes>
  )
}