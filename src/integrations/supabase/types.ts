export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: {
          category: string
          created_at: string
          engine_capacity: number | null
          id: string
          image_url: string | null
          make: string
          model: string
          team_id: string | null
          year: number | null
        }
        Insert: {
          category: string
          created_at?: string
          engine_capacity?: number | null
          id?: string
          image_url?: string | null
          make: string
          model: string
          team_id?: string | null
          year?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          engine_capacity?: number | null
          id?: string
          image_url?: string | null
          make?: string
          model?: string
          team_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cars_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          bio: string | null
          birthdate: string | null
          championships: number
          created_at: string
          id: string
          name: string
          nationality: string
          photo_url: string | null
          podiums: number
          slug: string
          team_id: string | null
        }
        Insert: {
          bio?: string | null
          birthdate?: string | null
          championships?: number
          created_at?: string
          id?: string
          name: string
          nationality: string
          photo_url?: string | null
          podiums?: number
          slug: string
          team_id?: string | null
        }
        Update: {
          bio?: string | null
          birthdate?: string | null
          championships?: number
          created_at?: string
          id?: string
          name?: string
          nationality?: string
          photo_url?: string | null
          podiums?: number
          slug?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      entries: {
        Row: {
          car_id: string
          category: string
          co_driver_id: string | null
          created_at: string
          driver_id: string
          id: string
          number: number
          rally_id: string
          team_id: string
        }
        Insert: {
          car_id: string
          category: string
          co_driver_id?: string | null
          created_at?: string
          driver_id: string
          id?: string
          number: number
          rally_id: string
          team_id: string
        }
        Update: {
          car_id?: string
          category?: string
          co_driver_id?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          number?: number
          rally_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_co_driver_id_fkey"
            columns: ["co_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_rally_id_fkey"
            columns: ["rally_id"]
            isOneToOne: false
            referencedRelation: "rallies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      rallies: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          organizer: string
          short_code: string
          slug: string
          status: string
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          organizer: string
          short_code: string
          slug: string
          status: string
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          organizer?: string
          short_code?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      stage_results: {
        Row: {
          car_number: number
          co_driver_id: string | null
          created_at: string
          driver_id: string
          gap: string | null
          id: string
          position: number
          rally_id: string
          stage_id: string
          status: string
          time: string
        }
        Insert: {
          car_number: number
          co_driver_id?: string | null
          created_at?: string
          driver_id: string
          gap?: string | null
          id?: string
          position: number
          rally_id: string
          stage_id: string
          status: string
          time: string
        }
        Update: {
          car_number?: number
          co_driver_id?: string | null
          created_at?: string
          driver_id?: string
          gap?: string | null
          id?: string
          position?: number
          rally_id?: string
          stage_id?: string
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_results_co_driver_id_fkey"
            columns: ["co_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_results_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_results_rally_id_fkey"
            columns: ["rally_id"]
            isOneToOne: false
            referencedRelation: "rallies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_results_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      stages: {
        Row: {
          created_at: string
          date: string
          distance: number
          id: string
          name: string
          rally_id: string
          start_time: string
          status: string
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          distance: number
          id?: string
          name: string
          rally_id: string
          start_time: string
          status: string
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          distance?: number
          id?: string
          name?: string
          rally_id?: string
          start_time?: string
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "stages_rally_id_fkey"
            columns: ["rally_id"]
            isOneToOne: false
            referencedRelation: "rallies"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          country: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
