import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <p>Loading your workspace…</p>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}