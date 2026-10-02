import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppLayout from './components/app/AppLayout'
import Dashboard from './pages/app/Dashboard'
import History from './pages/app/History'
import Queue from './pages/app/Queue'
import Calendar from './pages/app/Calendar'
import Analytics from './pages/app/Analytics'
import Automation from './pages/app/Automation'
import Settings from './pages/app/Settings'
import Create from './pages/app/Create'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="queue" element={<Queue />} />
        <Route path="history" element={<History />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="automation" element={<Automation />} />
        <Route path="settings" element={<Settings />} />
        <Route path="create" element={<Create />} />
      </Route>
    </Routes>
  )
}