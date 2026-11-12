import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <Header />
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}