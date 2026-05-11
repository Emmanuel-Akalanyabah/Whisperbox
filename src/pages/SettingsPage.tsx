import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Shield, Palette, Save, Camera } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    username: profile?.username ?? '',
    bio: profile?.bio ?? '',
    allow_anonymous: profile?.allow_anonymous ?? true,
  })

  if (!user || !profile) { navigate('/login'); return null }

  async function saveProfile() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: form.display_name,
        username: form.username.toLowerCase(),
        bio: form.bio,
        allow_anonymous: form.allow_anonymous,
        updated_at: new Date().toISOString(),
      } as any).eq('id', user!.id)
      if (error) throw error
      if (refreshProfile) await refreshProfile()
      toast.success('Settings saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-void-50">Settings</h1>
          <p className="text-ink-500 dark:text-void-400 mt-1">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          <Section icon={<User size={16} />} title="Profile" desc="Update your public profile information">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-whisper-400 to-whisper-600 flex items-center justify-center text-2xl font-bold text-white">
                  {form.display_name[0]?.toUpperCase() ?? '?'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-whisper-500 rounded-lg flex items-center justify-center shadow-md">
                  <Camera size={11} className="text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-ink-800 dark:text-void-200">{profile.display_name}</p>
                <p className="text-sm text-ink-400 dark:text-void-500">@{profile.username}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input label="Display name" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Your name" />
              <Input label="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))} placeholder="username" hint={`Your link: /ask/${form.username || 'username'}`} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-ink-700 dark:text-void-300">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell people about yourself..." rows={3} maxLength={200} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-void-900 border border-ink-200 dark:border-void-700 text-ink-900 dark:text-void-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-whisper-500 resize-none text-sm transition-all" />
                <p className="text-xs text-ink-400 dark:text-void-500 text-right">{form.bio.length}/200</p>
              </div>
            </div>
          </Section>

          <Section icon={<Shield size={16} />} title="Privacy" desc="Control who can message you">
            <Toggle label="Accept anonymous messages" desc="Allow anyone to send you anonymous messages" checked={form.allow_anonymous} onChange={v => setForm(f => ({ ...f, allow_anonymous: v }))} />
          </Section>

          <Section icon={<Palette size={16} />} title="Appearance" desc="Customize how WhisperBox looks">
            <p className="text-sm text-ink-400 dark:text-void-500">Use the sun/moon icon in the navbar to toggle dark/light mode.</p>
          </Section>

          <div className="flex justify-end">
            <Button onClick={saveProfile} isLoading={saving} size="lg">
              <Save size={16} /> Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-whisper-500">{icon}</span>
        <h2 className="font-semibold text-ink-900 dark:text-void-100">{title}</h2>
      </div>
      <p className="text-sm text-ink-400 dark:text-void-500 mb-5">{desc}</p>
      {children}
    </motion.div>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink-800 dark:text-void-200">{label}</p>
        <p className="text-xs text-ink-400 dark:text-void-500">{desc}</p>
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-whisper-500' : 'bg-ink-200 dark:bg-void-700'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
