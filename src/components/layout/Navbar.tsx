import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, MessageCircle, LogOut, Settings, User, Copy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, theme, setTheme, signOut } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  function copyLink() {
    if (profile) {
      navigator.clipboard.writeText(`${window.location.origin}/ask/${profile.username}`)
      toast.success('Link copied!')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-ink-200/50 dark:border-void-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-whisper-500 flex items-center justify-center shadow-lg shadow-whisper-500/30 group-hover:scale-105 transition-transform">
              <MessageCircle size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg text-ink-950 dark:text-void-50">
              Whisper<span className="text-whisper-500">Box</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-ink-100 dark:hover:bg-void-800 transition-colors text-ink-500 dark:text-void-400"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user && profile ? (
              <>
                <button
                  onClick={copyLink}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-whisper-50 dark:bg-whisper-900/20 text-whisper-600 dark:text-whisper-400 border border-whisper-200 dark:border-whisper-800/50 hover:bg-whisper-100 dark:hover:bg-whisper-900/30 transition-colors"
                >
                  <Copy size={12} /> Copy link
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-ink-100 dark:hover:bg-void-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-whisper-400 to-whisper-600 flex items-center justify-center text-white text-xs font-semibold">
                      {profile.display_name[0]?.toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-ink-800 dark:text-void-200">{profile.display_name}</span>
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl shadow-2xl border border-ink-200/50 dark:border-void-700/50 z-20 overflow-hidden"
                        >
                          <div className="p-3 border-b border-ink-100 dark:border-void-700/50">
                            <p className="text-sm font-semibold text-ink-900 dark:text-void-100">{profile.display_name}</p>
                            <p className="text-xs text-ink-400 dark:text-void-500">@{profile.username}</p>
                          </div>
                          <div className="p-1.5">
                            <MenuItem icon={<User size={14} />} onClick={() => { navigate('/dashboard'); setShowMenu(false) }}>Dashboard</MenuItem>
                            <MenuItem icon={<Settings size={14} />} onClick={() => { navigate('/settings'); setShowMenu(false) }}>Settings</MenuItem>
                            {profile.is_admin && (
                              <MenuItem icon={<MessageCircle size={14} />} onClick={() => { navigate('/admin'); setShowMenu(false) }}>Admin Panel</MenuItem>
                            )}
                            <div className="border-t border-ink-100 dark:border-void-700/50 mt-1 pt-1">
                              <MenuItem icon={<LogOut size={14} />} onClick={async () => { await signOut(); navigate('/') }} danger>Sign out</MenuItem>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
                <Button size="sm" onClick={() => navigate('/signup')}>Get started</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function MenuItem({ icon, onClick, children, danger = false }: {
  icon: React.ReactNode; onClick: () => void; children: React.ReactNode; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
        danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-ink-700 dark:text-void-300 hover:bg-ink-100 dark:hover:bg-void-700/50'
      }`}
    >
      {icon}{children}
    </button>
  )
}
