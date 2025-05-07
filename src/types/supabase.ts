
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
      rallies: {
        Row: {
          id: string
          title: string
          location: string
          date: string
          status: 'upcoming' | 'in-progress' | 'completed'
          organizer: string
          website: string | null
          image_url: string | null
          description: string | null
          created_at: string
          updated_at: string
          short_code: string
          slug: string
        }
        Insert: {
          id?: string
          title: string
          location: string
          date: string
          status: 'upcoming' | 'in-progress' | 'completed'
          organizer: string
          website?: string | null
          image_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          short_code: string
          slug: string
        }
        Update: {
          id?: string
          title?: string
          location?: string
          date?: string
          status?: 'upcoming' | 'in-progress' | 'completed'
          organizer?: string
          website?: string | null
          image_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          short_code?: string
          slug?: string
        }
      }
      stages: {
        Row: {
          id: string
          name: string
          distance: number
          status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
          start_time: string
          date: string
          time: string
          rally_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          distance: number
          status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
          start_time: string
          date: string
          time: string
          rally_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          distance?: number
          status?: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
          start_time?: string
          date?: string
          time?: string
          rally_id?: string
          created_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          name: string
          birthdate: string | null
          nationality: string
          photo_url: string | null
          bio: string | null
          championships: number
          podiums: number
          slug: string
          created_at: string
          team_id: string | null
        }
        Insert: {
          id?: string
          name: string
          birthdate?: string | null
          nationality: string
          photo_url?: string | null
          bio?: string | null
          championships?: number
          podiums?: number
          slug: string
          created_at?: string
          team_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          birthdate?: string | null
          nationality?: string
          photo_url?: string | null
          bio?: string | null
          championships?: number
          podiums?: number
          slug?: string
          created_at?: string
          team_id?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          country: string
          logo_url: string | null
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          country: string
          logo_url?: string | null
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string
          logo_url?: string | null
          slug?: string
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          make: string
          model: string
          engine_capacity: number | null
          year: number | null
          category: string
          image_url: string | null
          team_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          engine_capacity?: number | null
          year?: number | null
          category: string
          image_url?: string | null
          team_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          engine_capacity?: number | null
          year?: number | null
          category?: string
          image_url?: string | null
          team_id?: string | null
          created_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          number: number
          driver_id: string
          co_driver_id: string | null
          car_id: string
          team_id: string
          category: string
          rally_id: string
          created_at: string
        }
        Insert: {
          id?: string
          number: number
          driver_id: string
          co_driver_id?: string | null
          car_id: string
          team_id: string
          category: string
          rally_id: string
          created_at?: string
        }
        Update: {
          id?: string
          number?: number
          driver_id?: string
          co_driver_id?: string | null
          car_id?: string
          team_id?: string
          category?: string
          rally_id?: string
          created_at?: string
        }
      }
      stage_results: {
        Row: {
          id: string
          stage_id: string
          rally_id: string
          driver_id: string
          co_driver_id: string | null
          time: string
          position: number
          gap: string | null
          car_number: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          stage_id: string
          rally_id: string
          driver_id: string
          co_driver_id?: string | null
          time: string
          position: number
          gap?: string | null
          car_number: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          stage_id?: string
          rally_id?: string
          driver_id?: string
          co_driver_id?: string | null
          time?: string
          position?: number
          gap?: string | null
          car_number?: number
          status?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
