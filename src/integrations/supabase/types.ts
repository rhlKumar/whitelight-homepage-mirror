export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_locks: {
        Row: {
          created_at: string | null
          function_instance_id: string | null
          locked_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          function_instance_id?: string | null
          locked_at?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          function_instance_id?: string | null
          locked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      extracted_markers: {
        Row: {
          created_at: string | null
          id: string
          marker_name: string
          reference_range: string | null
          report_date: string
          report_id: string
          unit: string | null
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          marker_name: string
          reference_range?: string | null
          report_date: string
          report_id: string
          unit?: string | null
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          marker_name?: string
          reference_range?: string | null
          report_date?: string
          report_id?: string
          unit?: string | null
          user_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_markers_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      health_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      health_insights: {
        Row: {
          analysis_data: Json
          created_at: string | null
          id: string
          is_invalidated: boolean | null
          last_updated_at: string | null
          last_updated_sections: string[] | null
          questionnaire_id: string | null
          report_ids: string[]
          superseded_by: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          analysis_data: Json
          created_at?: string | null
          id?: string
          is_invalidated?: boolean | null
          last_updated_at?: string | null
          last_updated_sections?: string[] | null
          questionnaire_id?: string | null
          report_ids: string[]
          superseded_by?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          analysis_data?: Json
          created_at?: string | null
          id?: string
          is_invalidated?: boolean | null
          last_updated_at?: string | null
          last_updated_sections?: string[] | null
          questionnaire_id?: string | null
          report_ids?: string[]
          superseded_by?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_insights_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_insights_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "health_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      health_insights_history: {
        Row: {
          analysis_data: Json
          change_summary: Json | null
          created_at: string | null
          id: string
          insight_id: string
          updated_sections: string[] | null
          user_id: string
          version: number
        }
        Insert: {
          analysis_data: Json
          change_summary?: Json | null
          created_at?: string | null
          id?: string
          insight_id: string
          updated_sections?: string[] | null
          user_id: string
          version: number
        }
        Update: {
          analysis_data?: Json
          change_summary?: Json | null
          created_at?: string | null
          id?: string
          insight_id?: string
          updated_sections?: string[] | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          age: number | null
          alcohol_glasses_per_month: number | null
          cigarettes_per_day: number | null
          created_at: string | null
          current_medications: string | null
          diet_history: string | null
          diet_type: string | null
          digestion_notes: string | null
          exercise_frequency: string | null
          exercise_times_per_week: number | null
          family_history: Json | null
          food_habits: string | null
          gender: string | null
          id: string
          location: string | null
          medical_history: Json | null
          mental_health: string | null
          sleep_hours: number | null
          sleep_quality: string | null
          sleep_time_range: string | null
          stress_level: string | null
          symptoms: string | null
          updated_at: string | null
          user_id: string
          water_intake_glasses: number | null
        }
        Insert: {
          age?: number | null
          alcohol_glasses_per_month?: number | null
          cigarettes_per_day?: number | null
          created_at?: string | null
          current_medications?: string | null
          diet_history?: string | null
          diet_type?: string | null
          digestion_notes?: string | null
          exercise_frequency?: string | null
          exercise_times_per_week?: number | null
          family_history?: Json | null
          food_habits?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          medical_history?: Json | null
          mental_health?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          sleep_time_range?: string | null
          stress_level?: string | null
          symptoms?: string | null
          updated_at?: string | null
          user_id: string
          water_intake_glasses?: number | null
        }
        Update: {
          age?: number | null
          alcohol_glasses_per_month?: number | null
          cigarettes_per_day?: number | null
          created_at?: string | null
          current_medications?: string | null
          diet_history?: string | null
          diet_type?: string | null
          digestion_notes?: string | null
          exercise_frequency?: string | null
          exercise_times_per_week?: number | null
          family_history?: Json | null
          food_habits?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          medical_history?: Json | null
          mental_health?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          sleep_time_range?: string | null
          stress_level?: string | null
          symptoms?: string | null
          updated_at?: string | null
          user_id?: string
          water_intake_glasses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          extraction_error: string | null
          extraction_last_retry_at: string | null
          extraction_retry_count: number | null
          extraction_status: string | null
          file_name: string
          file_url: string
          id: string
          is_baseline: boolean | null
          original_filename: string | null
          report_date: string | null
          report_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          extraction_error?: string | null
          extraction_last_retry_at?: string | null
          extraction_retry_count?: number | null
          extraction_status?: string | null
          file_name: string
          file_url: string
          id?: string
          is_baseline?: boolean | null
          original_filename?: string | null
          report_date?: string | null
          report_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          extraction_error?: string | null
          extraction_last_retry_at?: string | null
          extraction_retry_count?: number | null
          extraction_status?: string | null
          file_name?: string
          file_url?: string
          id?: string
          is_baseline?: boolean | null
          original_filename?: string | null
          report_date?: string | null
          report_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
