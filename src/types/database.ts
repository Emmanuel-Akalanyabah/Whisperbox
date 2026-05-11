export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          theme: string
          allow_anonymous: boolean
          message_count: number
          profile_views: number
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          allow_anonymous?: boolean
          message_count?: number
          profile_views?: number
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          allow_anonymous?: boolean
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          recipient_id: string
          content: string
          is_read: boolean
          is_archived: boolean
          is_favorite: boolean
          is_reported: boolean
          is_spam: boolean
          reply: string | null
          reactions: Json
          sender_ip_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          content: string
          is_read?: boolean
          is_archived?: boolean
          is_favorite?: boolean
          is_reported?: boolean
          is_spam?: boolean
          reply?: string | null
          reactions?: Json
          sender_ip_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          is_read?: boolean
          is_archived?: boolean
          is_favorite?: boolean
          is_reported?: boolean
          is_spam?: boolean
          reply?: string | null
          reactions?: Json
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          message_id: string
          reporter_id: string | null
          reason: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          reporter_id?: string | null
          reason: string
          status?: string
          created_at?: string
        }
        Update: {
          status?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
