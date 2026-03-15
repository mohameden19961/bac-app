import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CoursPage from './pages/CoursPage'
import CoursDetailPage from './pages/CoursDetailPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ExercicesPage from './pages/ExercicesPage'
import AssistantPage from './pages/AssistantPage'
import PlanningPage from './pages/PlanningPage'
import Layout from './components/dashboard/Layout'
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" />
  return children
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Outfit, sans-serif' } }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="cours" element={<CoursPage />} />
            <Route path="cours/:id" element={<CoursDetailPage />} />
            <Route path="exercices" element={<ExercicesPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="planning" element={<PlanningPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
