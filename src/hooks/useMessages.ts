import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useMessages(userId: string | undefined) {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites' | 'archived' | 'spam'>('all')

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', userId, filter],
    queryFn: async () => {
      if (!userId) return []
      let query = supabase.from('messages').select('*').eq('recipient_id', userId).order('created_at', { ascending: false })
      if (filter === 'unread') query = query.eq('is_read', false).eq('is_archived', false).eq('is_spam', false)
      else if (filter === 'favorites') query = query.eq('is_favorite', true).eq('is_archived', false)
      else if (filter === 'archived') query = query.eq('is_archived', true)
      else if (filter === 'spam') query = query.eq('is_spam', true)
      else query = query.eq('is_archived', false).eq('is_spam', false)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`messages:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `recipient_id=eq.${userId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', userId] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, queryClient])

  const updateMessage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase.from('messages').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages', userId] }),
    onError: () => toast.error('Failed to update message'),
  })

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('messages').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['messages', userId] }); toast.success('Message deleted') },
    onError: () => toast.error('Failed to delete message'),
  })

  const replyToMessage = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { error } = await supabase.from('messages').update({ reply, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['messages', userId] }); toast.success('Reply sent!') },
    onError: () => toast.error('Failed to send reply'),
  })

  const unreadCount = (messages as any[]).filter((m: any) => !m.is_read && !m.is_spam && !m.is_archived).length

  return {
    messages: messages as any[],
    isLoading, filter, setFilter, unreadCount,
    updateMessage: updateMessage.mutate,
    deleteMessage: deleteMessage.mutate,
    replyToMessage: replyToMessage.mutate,
  }
}

export async function sendAnonymousMessage(recipientId: string, content: string): Promise<void> {
  const sanitized = content.trim().slice(0, 500)
  if (!sanitized) throw new Error('Message cannot be empty')
  const { error } = await supabase.from('messages').insert({ recipient_id: recipientId, content: sanitized, reactions: {} })
  if (error) throw error
}
