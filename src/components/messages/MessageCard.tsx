import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Archive, Heart, Flag, Reply, MailOpen, Mail, CornerDownRight } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { Message } from '@/types/database'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface MessageCardProps {
  message: Message
  onUpdate: (params: { id: string; updates: Partial<Message> }) => void
  onDelete: (id: string) => void
  onReply: (params: { id: string; reply: string }) => void
}

export default function MessageCard({ message, onUpdate, onDelete, onReply }: MessageCardProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState(message.reply || '')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'glass rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg group',
        !message.is_read && 'ring-1 ring-whisper-500/30'
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ink-200 to-ink-300 dark:from-void-700 dark:to-void-600 flex items-center justify-center text-sm">👤</div>
            <div>
              <p className="text-xs font-semibold text-ink-500 dark:text-void-400">Anonymous</p>
              <p className="text-xs text-ink-400 dark:text-void-500">{formatRelativeTime(message.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionBtn icon={message.is_read ? <Mail size={14}/> : <MailOpen size={14}/>} title={message.is_read ? 'Mark unread' : 'Mark read'} onClick={() => onUpdate({ id: message.id, updates: { is_read: !message.is_read } })} />
            <ActionBtn icon={<Heart size={14}/>} title="Favorite" onClick={() => onUpdate({ id: message.id, updates: { is_favorite: !message.is_favorite } })} active={message.is_favorite} activeColor="text-red-500" />
            <ActionBtn icon={<Reply size={14}/>} title="Reply" onClick={() => setShowReply(!showReply)} active={showReply} />
            <ActionBtn icon={<Archive size={14}/>} title="Archive" onClick={() => onUpdate({ id: message.id, updates: { is_archived: true } })} />
            <ActionBtn icon={<Flag size={14}/>} title="Report" onClick={() => onUpdate({ id: message.id, updates: { is_reported: true, is_spam: true } })} />
            <ActionBtn icon={<Trash2 size={14}/>} title="Delete" onClick={() => onDelete(message.id)} danger />
          </div>
        </div>

        <p className="text-ink-800 dark:text-void-200 text-sm leading-relaxed">{message.content}</p>

        {!message.is_read && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-whisper-500" />
            <span className="text-xs text-whisper-500 font-medium">New</span>
          </div>
        )}

        {message.reply && !showReply && (
          <div className="mt-4 pl-4 border-l-2 border-whisper-300 dark:border-whisper-700">
            <div className="flex items-center gap-1.5 mb-1">
              <CornerDownRight size={12} className="text-whisper-400" />
              <span className="text-xs font-medium text-whisper-500">Your reply</span>
            </div>
            <p className="text-sm text-ink-600 dark:text-void-300">{message.reply}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-100 dark:border-void-700/50"
          >
            <div className="p-4 bg-ink-50/50 dark:bg-void-900/50 space-y-3">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-void-800 border border-ink-200 dark:border-void-700 text-ink-900 dark:text-void-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-whisper-500 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowReply(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { if (replyText.trim()) { onReply({ id: message.id, reply: replyText.trim() }); setShowReply(false) } }} disabled={!replyText.trim()}>Post reply</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ActionBtn({ icon, title, onClick, active = false, activeColor = 'text-whisper-500', danger = false }: {
  icon: React.ReactNode; title: string; onClick: () => void; active?: boolean; activeColor?: string; danger?: boolean
}) {
  return (
    <button title={title} onClick={onClick} className={cn(
      'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
      danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-ink-400 hover:text-red-500'
             : active ? `bg-whisper-50 dark:bg-whisper-900/20 ${activeColor}`
             : 'hover:bg-ink-100 dark:hover:bg-void-700 text-ink-400 dark:text-void-500 hover:text-ink-700 dark:hover:text-void-300'
    )}>{icon}</button>
  )
}
