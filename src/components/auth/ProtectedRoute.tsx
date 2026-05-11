import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-whisper-500 border-t-transparent animate-spin" />
          <p className="text-sm text-ink-400 dark:text-void-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireAdmin && !profile?.is_admin) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
