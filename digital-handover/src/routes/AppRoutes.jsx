import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import AIAnalysis from '../pages/AIAnalysis.jsx'
import AuditLogs from '../pages/AuditLogs.jsx'
import Chatbot from '../pages/Chatbot.jsx'
import GitHubCallback from '../components/GitHubCallback.jsx'
import CreateProject from '../pages/CreateProject.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Handover from '../pages/Handover.jsx'
import Integrations from '../pages/Integrations.jsx'
import Landing from '../pages/Landing.jsx'
import Login from '../pages/Login.jsx'
import Projects from '../pages/Projects.jsx'
import ReviewCenter from '../pages/ReviewCenter.jsx'
import Settings from '../pages/Settings.jsx'
import Signup from '../pages/Signup.jsx'
import Verification from '../pages/Verification.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthLayout title="Welcome back" description="Sign in to pick up right where your team left off." footer={<>New to handover? <Link to="/signup">Create an account</Link></>}><Login /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout title="Make handovers a breeze" description="Create your workspace and bring every project detail together." footer={<>Already have an account? <Link to="/login">Sign in</Link></>}><Signup /></AuthLayout>} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<Handover />} />
          <Route path="/reviews" element={<ReviewCenter />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/verification" element={<Verification />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}