import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Shield, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'
import { sendAnonymousMessage } from '@/hooks/useMessages'
import { checkRateLimit } from '@/lib/rateLimit'
import Button from '@/components/ui/Button'
import type { Profile } from '@/types/database'
import toast from 'react-hot-toast'

const MAX_CHARS = 500
const EMOJI_PRESETS = ['😊', '❤️', '😂', '🔥', '✨', '👀', '💭', '🤔']

export default function AskPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!username) return
    supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setProfile(data as Profile)
        setLoading(false)
      })
  }, [username])

  useEffect(() => {
    if (profile?.username) {
      (async () => { try { await supabase.rpc('increment_profile_views', { username: profile.username }) } catch {} })()
    }
  }, [profile?.username])

  async function handleSend() {
    if (!profile || !message.trim()) return
    if (!checkRateLimit(`send:${profile.id}`, 3, 60000)) {
      toast.error('Sending too fast — wait a moment.')
      return
    }
    setSending(true)
    try {
      await sendAnonymousMessage(profile.id, message.trim())
      setSent(true)
      setMessage('')
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#de5a3c', '#e87c60', '#f0a993'] })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-whisper-500 border-t-transparent animate-spin" />
    </div>
  )

  if (notFound || !profile) return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-ink-100 dark:bg-void-800 flex items-center justify-center mx-auto mb-6">
          <MessageCircle size={32} className="text-ink-300 dark:text-void-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-void-100 mb-2">User not found</h1>
        <p className="text-ink-500 dark:text-void-400 mb-6">This WhisperBox doesn't exist yet.</p>
        <Button onClick={() => navigate('/signup')}>Create yours for free</Button>
      </div>
    </div>
  )

  if (!profile.allow_anonymous) return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="font-display text-xl font-bold text-ink-900 dark:text-void-100 mb-2">Messages paused</h1>
        <p className="text-ink-500 dark:text-void-400">@{profile.username} is not accepting messages right now.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-whisper-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-void-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-ink-400 dark:text-void-500 hover:text-ink-700 dark:hover:text-void-300 transition-colors mb-6">
          <ArrowLeft size={15} /> WhisperBox
        </button>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-strong rounded-3xl p-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-green-500" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-void-100 mb-2">Whisper sent! 🎉</h2>
              <p className="text-ink-500 dark:text-void-400 mb-8">Your anonymous message was delivered to <strong className="text-ink-700 dark:text-void-200">@{profile.username}</strong>.</p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => setSent(false)}>Send another</Button>
                <Button onClick={() => navigate('/signup')} variant="outline">Create your own WhisperBox</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-strong rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-6 bg-gradient-to-br from-whisper-500/10 to-void-600/10 border-b border-ink-200/50 dark:border-void-700/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-whisper-400 to-whisper-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
                    {profile.display_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h1 className="font-display text-xl font-bold text-ink-900 dark:text-void-100">{profile.display_name}</h1>
                    <p className="text-sm text-whisper-500">@{profile.username}</p>
                    {profile.bio && <p className="text-sm text-ink-500 dark:text-void-400 mt-1 line-clamp-2">{profile.bio}</p>}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <label className="block text-sm font-semibold text-ink-800 dark:text-void-200 mb-3">Send an anonymous message 👇</label>
                <div className="flex gap-2 mb-3">
                  {EMOJI_PRESETS.map(e => (
                    <button key={e} type="button" onClick={() => setMessage(m => m + e)} className="w-8 h-8 rounded-lg hover:bg-ink-100 dark:hover:bg-void-800 flex items-center justify-center text-lg transition-colors">{e}</button>
                  ))}
                </div>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                    placeholder={`Ask ${profile.display_name} anything, or just say hi...`}
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-void-900 border border-ink-200 dark:border-void-700 text-ink-900 dark:text-void-50 placeholder:text-ink-400 dark:placeholder:text-void-500 focus:outline-none focus:ring-2 focus:ring-whisper-500 resize-none text-sm leading-relaxed"
                  />
                  <div className={`absolute bottom-3 right-3 text-xs ${message.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-ink-300 dark:text-void-600'}`}>
                    {message.length}/{MAX_CHARS}
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={handleSend} isLoading={sending} disabled={!message.trim()} className="w-full" size="lg">
                    <Send size={16} /> Send anonymously
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-400 dark:text-void-500">
                  <Shield size={12} />
                  <span>100% anonymous — your identity is never revealed</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!sent && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-sm text-ink-400 dark:text-void-500 mt-6">
            Want your own?{' '}
            <button onClick={() => navigate('/signup')} className="text-whisper-500 hover:text-whisper-600 font-medium transition-colors">
              Create a free WhisperBox →
            </button>
          </motion.p>
        )}
      </div>
    </div>
  )
}
