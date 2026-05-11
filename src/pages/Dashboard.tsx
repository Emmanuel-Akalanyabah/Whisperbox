import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Inbox, Heart, Archive, AlertTriangle,
  Copy, ExternalLink, TrendingUp, Users, Mail, BarChart3,
  Search, Bell, CheckCheck
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import MessageCard from '@/components/messages/MessageCard'
import { MessageSkeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const FILTERS = [
  { key: 'all', label: 'All', icon: Inbox },
  { key: 'unread', label: 'Unread', icon: Mail },
  { key: 'favorites', label: 'Favorites', icon: Heart },
  { key: 'archived', label: 'Archived', icon: Archive },
  { key: 'spam', label: 'Spam', icon: AlertTriangle },
] as const

const analyticsData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  messages: Math.floor(Math.random() * 20) + 2,
}))

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { messages, isLoading, filter, setFilter, unreadCount, updateMessage, deleteMessage, replyToMessage } = useMessages(user?.id)
  const [search, setSearch] = useState('')

  if (!user || !profile) { navigate('/login'); return null }

  const filtered = messages.filter(m => m.content.toLowerCase().includes(search.toLowerCase()))

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/ask/${profile!.username}`)
    toast.success('Link copied!')
  }

  const stats = [
    { label: 'Total Messages', value: profile.message_count || 0, icon: MessageCircle, color: 'text-whisper-500', bg: 'bg-whisper-50 dark:bg-whisper-900/20' },
    { label: 'Unread', value: unreadCount, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Profile Views', value: profile.profile_views || 0, icon: Users, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'This Week', value: analyticsData.reduce((s, d) => s + d.messages, 0), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ]

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-void-50">Hey, {profile.display_name.split(' ')[0]} 👋</h1>
            <p className="text-ink-500 dark:text-void-400 mt-1">You have <strong className="text-whisper-500">{unreadCount}</strong> unread message{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}><Copy size={14} />Copy link</Button>
            <Button size="sm" onClick={() => window.open(`/ask/${profile.username}`, '_blank')}><ExternalLink size={14} />View box</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}><stat.icon size={17} className={stat.color} /></div>
              <p className="text-2xl font-bold text-ink-900 dark:text-void-100">{stat.value}</p>
              <p className="text-xs text-ink-400 dark:text-void-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 dark:text-void-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-void-900 border border-ink-200 dark:border-void-700 text-ink-900 dark:text-void-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-whisper-500" />
                </div>
                <div className="flex gap-1 overflow-x-auto">
                  {FILTERS.map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key as any)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === f.key ? 'bg-whisper-500 text-white shadow-md shadow-whisper-500/20' : 'text-ink-500 dark:text-void-400 hover:bg-ink-100 dark:hover:bg-void-800'}`}>
                      <f.icon size={12} />{f.label}
                      {f.key === 'unread' && unreadCount > 0 && <span className="ml-0.5 bg-white/30 rounded-full px-1.5 py-0.5 text-xs">{unreadCount}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <MessageSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-ink-100 dark:bg-void-800 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={28} className="text-ink-300 dark:text-void-600" />
                  </div>
                  <p className="font-semibold text-ink-600 dark:text-void-300 mb-1">{search ? 'No messages found' : filter === 'all' ? 'No messages yet' : `No ${filter} messages`}</p>
                  {filter === 'all' && !search && <Button size="sm" onClick={copyLink} className="mt-4"><Copy size={14} />Copy your link</Button>}
                </motion.div>
              ) : (
                filtered.map(message => (
                  <MessageCard key={message.id} message={message} onUpdate={updateMessage} onDelete={deleteMessage} onReply={replyToMessage} />
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-ink-800 dark:text-void-200 mb-3 text-sm">Your link</h3>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50 dark:bg-void-900 border border-ink-200 dark:border-void-700 mb-3">
                <span className="text-xs text-ink-500 dark:text-void-400 flex-1 truncate">/ask/<span className="text-whisper-500 font-medium">{profile.username}</span></span>
              </div>
              <Button onClick={copyLink} className="w-full" size="sm"><Copy size={13} />Copy link</Button>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink-800 dark:text-void-200 text-sm">Messages this week</h3>
                <BarChart3 size={15} className="text-ink-400 dark:text-void-500" />
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={analyticsData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#de5a3c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#de5a3c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8f8370' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8f8370' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid #3d3f57', borderRadius: '12px', fontSize: '12px', color: '#f0f0f5' }} cursor={{ stroke: '#de5a3c', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="messages" stroke="#de5a3c" strokeWidth={2} fill="url(#msgGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-5 space-y-2">
              <h3 className="font-semibold text-ink-800 dark:text-void-200 text-sm mb-3">Quick actions</h3>
              <QuickAction icon={<CheckCheck size={14} />} onClick={() => { messages.filter(m => !m.is_read).forEach(m => updateMessage({ id: m.id, updates: { is_read: true } })); toast.success('All marked as read') }}>Mark all as read</QuickAction>
              <QuickAction icon={<Bell size={14} />} onClick={() => navigate('/settings')}>Notification settings</QuickAction>
              <QuickAction icon={<ExternalLink size={14} />} onClick={() => navigate('/settings')}>Edit profile</QuickAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, onClick, children }: { icon: React.ReactNode; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-ink-600 dark:text-void-300 hover:bg-ink-100 dark:hover:bg-void-800 transition-colors text-left">
      <span className="text-ink-400 dark:text-void-500">{icon}</span>{children}
    </button>
  )
}
