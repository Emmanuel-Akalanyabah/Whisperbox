import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, MessageCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { isValidUsername } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'auth' | 'reset'>('auth')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!isLogin && !form.displayName) e.displayName = 'Display name is required'
    if (!isLogin && !form.username) e.username = 'Username is required'
    else if (!isLogin && !isValidUsername(form.username)) e.username = 'Use 3-30 lowercase letters, numbers or underscores'
    if (mode !== 'reset') {
      if (!form.password) e.password = 'Password is required'
      else if (!isLogin && form.password.length < 8) e.password = 'Minimum 8 characters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      if (mode === 'reset') {
        await resetPassword(form.email)
        toast.success('Password reset email sent!')
        setMode('auth')
      } else if (isLogin) {
        await signIn(form.email, form.password)
        navigate('/dashboard')
        toast.success('Welcome back!')
      } else {
        await signUp(form.email, form.password, form.username, form.displayName)
        navigate('/dashboard')
        toast.success('Account created! Welcome to WhisperBox 🎉')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center px-4 py-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-whisper-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-void-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to home */}
        <Link to="/" className="flex items-center gap-2 text-sm text-ink-400 dark:text-void-500 hover:text-ink-700 dark:hover:text-void-300 mb-8 transition-colors w-fit">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-whisper-500 flex items-center justify-center shadow-lg shadow-whisper-500/30">
              <MessageCircle size={18} className="text-white" />
            </div>
            <span className="font-display font-semibold text-xl text-ink-950 dark:text-void-50">
              Whisper<span className="text-whisper-500">Box</span>
            </span>
          </div>

          {mode === 'reset' ? (
            <>
              <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-void-50 mb-2">Reset password</h1>
              <p className="text-sm text-ink-500 dark:text-void-400 mb-6">We'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
                <Button type="submit" isLoading={isLoading} className="w-full">Send reset link</Button>
                <button type="button" onClick={() => setMode('auth')} className="w-full text-sm text-ink-400 dark:text-void-500 hover:text-ink-700 dark:hover:text-void-300 transition-colors">
                  Back to sign in
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-void-50 mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm text-ink-500 dark:text-void-400 mb-6">
                {isLogin ? "Sign in to your WhisperBox" : "Start receiving anonymous messages today"}
              </p>

              {/* Google */}
              <button
                type="button"
                onClick={async () => { try { await signInWithGoogle() } catch { toast.error('Google sign-in failed') } }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-ink-200 dark:border-void-700 hover:bg-ink-50 dark:hover:bg-void-800 transition-colors text-sm font-medium text-ink-700 dark:text-void-200 mb-6"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-ink-200 dark:bg-void-700" />
                <span className="text-xs text-ink-400 dark:text-void-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-ink-200 dark:bg-void-700" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <Input label="Display name" placeholder="Your name" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} error={errors.displayName} />
                    <Input label="Username" placeholder="yourname" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))} error={errors.username} hint="whisperbox.app/ask/yourname" />
                  </>
                )}
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
                <div className="relative">
                  <Input label="Password" type={showPass ? 'text' : 'password'} placeholder={isLogin ? '••••••••' : 'Min. 8 characters'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 bottom-2.5 text-ink-400 dark:text-void-500 hover:text-ink-700 dark:hover:text-void-300">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode('reset')} className="text-xs text-whisper-500 hover:text-whisper-600 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                  {isLogin ? 'Sign in' : 'Create account'}
                </Button>
              </form>

              <p className="text-center text-sm text-ink-500 dark:text-void-400 mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link to={isLogin ? '/signup' : '/login'} className="text-whisper-500 hover:text-whisper-600 font-medium transition-colors">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
