export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          avatar: string
          created_at: string
          daily_goal: number
          weekly_goal: number
        }
        Insert: {
          id?: string
          name: string
          avatar: string
          created_at?: string
          daily_goal?: number
          weekly_goal?: number
        }
        Update: {
          id?: string
          name?: string
          avatar?: string
          created_at?: string
          daily_goal?: number
          weekly_goal?: number
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          date: string
          company: string
          role: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          company: string
          role: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          company?: string
          role?: string
        }
      }
    }
  }
}