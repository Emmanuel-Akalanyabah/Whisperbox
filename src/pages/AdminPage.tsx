import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Flag, Ban } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import type { Profile } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'users' | 'reports'>('overview')
  const [users, setUsers] = useState<Profile[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [stats, setStats] = useState({ users: 0, messages: 0, reports: 0, spam: 0 })

  useEffect(() => {
    if (!profile?.is_admin) { navigate('/dashboard'); return }
    loadData()
  }, [profile])

  async function loadData() {
    const [usersRes, messagesRes, reportsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('messages').select('id, is_spam'),
      supabase.from('reports').select('*, messages(content), profiles(username)').order('created_at', { ascending: false }).limit(50),
    ])
    const msgs = (messagesRes.data ?? []) as { id: string; is_spam: boolean }[]
    setUsers((usersRes.data ?? []) as Profile[])
    setReports(reportsRes.data ?? [])
    setStats({ users: usersRes.data?.length ?? 0, messages: msgs.length, reports: reportsRes.data?.length ?? 0, spam: msgs.filter(m => m.is_spam).length })
  }

  async function resolveReport(id: string) {
    await supabase.from('reports').update({ status: 'resolved' } as any).eq('id', id)
    setReports(r => r.map((rep: any) => rep.id === id ? { ...rep, status: 'resolved' } : rep))
    toast.success('Report resolved')
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1"><Badge variant="danger">Admin</Badge></div>
          <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-void-50">Admin Panel</h1>
        </div>

        <div className="flex gap-1 glass rounded-2xl p-1.5 w-fit mb-8">
          {(['overview', 'users', 'reports'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-whisper-500 text-white shadow-md shadow-whisper-500/20' : 'text-ink-500 dark:text-void-400 hover:bg-ink-100 dark:hover:bg-void-800'}`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Total Messages', value: stats.messages, icon: MessageSquare, color: 'text-whisper-500', bg: 'bg-whisper-50 dark:bg-whisper-900/20' },
              { label: 'Reports', value: stats.reports, icon: Flag, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Spam Caught', value: stats.spam, icon: Ban, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-5">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}><stat.icon size={17} className={stat.color} /></div>
                <p className="text-2xl font-bold text-ink-900 dark:text-void-100">{stat.value}</p>
                <p className="text-xs text-ink-400 dark:text-void-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 dark:border-void-700">
                  {['User', 'Username', 'Messages', 'Joined'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-ink-500 dark:text-void-400">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-ink-50 dark:border-void-800 hover:bg-ink-50/50 dark:hover:bg-void-900/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-whisper-400 to-whisper-600 flex items-center justify-center text-white text-xs font-bold">{u.display_name[0]}</div>
                        <span className="text-sm font-medium text-ink-800 dark:text-void-200">{u.display_name}</span>
                        {u.is_admin && <Badge variant="info">Admin</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-500 dark:text-void-400">@{u.username}</td>
                    <td className="px-5 py-3 text-sm text-ink-700 dark:text-void-300">{u.message_count}</td>
                    <td className="px-5 py-3 text-xs text-ink-400 dark:text-void-500">{formatRelativeTime(u.created_at)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center"><Flag size={28} className="mx-auto text-ink-300 dark:text-void-600 mb-3" /><p className="text-ink-500 dark:text-void-400">No reports yet</p></div>
            ) : reports.map((rep: any, i: number) => (
              <motion.div key={rep.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={rep.status === 'resolved' ? 'success' : 'warning'}>{rep.status}</Badge>
                    <span className="text-xs text-ink-400 dark:text-void-500">{formatRelativeTime(rep.created_at)}</span>
                  </div>
                  <p className="text-sm text-ink-700 dark:text-void-300 mb-1"><strong>Reason:</strong> {rep.reason}</p>
                  {rep.messages?.content && <p className="text-sm text-ink-500 dark:text-void-400 line-clamp-2">"{rep.messages.content}"</p>}
                </div>
                {rep.status !== 'resolved' && <Button size="sm" variant="outline" onClick={() => resolveReport(rep.id)}>Resolve</Button>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
