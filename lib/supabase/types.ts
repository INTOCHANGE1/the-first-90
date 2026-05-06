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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      daily_entries: {
        Row: {
          day_number: number
          evening: Json | null
          evening_completed_at: string | null
          id: string
          morning: Json | null
          morning_completed_at: string | null
          phase: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          day_number: number
          evening?: Json | null
          evening_completed_at?: string | null
          id?: string
          morning?: Json | null
          morning_completed_at?: string | null
          phase: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          day_number?: number
          evening?: Json | null
          evening_completed_at?: string | null
          id?: string
          morning?: Json | null
          morning_completed_at?: string | null
          phase?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      final_reviews: {
        Row: {
          committing_to: string | null
          completed_at: string | null
          habit_for_life: string | null
          id: string
          most_important_lesson: string | null
          relationships_changed: string | null
          still_needs_work: string | null
          truth_now_known: string | null
          updated_at: string | null
          user_id: string
          who_am_i_when_alone: string | null
        }
        Insert: {
          committing_to?: string | null
          completed_at?: string | null
          habit_for_life?: string | null
          id?: string
          most_important_lesson?: string | null
          relationships_changed?: string | null
          still_needs_work?: string | null
          truth_now_known?: string | null
          updated_at?: string | null
          user_id: string
          who_am_i_when_alone?: string | null
        }
        Update: {
          committing_to?: string | null
          completed_at?: string | null
          habit_for_life?: string | null
          id?: string
          most_important_lesson?: string | null
          relationships_changed?: string | null
          still_needs_work?: string | null
          truth_now_known?: string | null
          updated_at?: string | null
          user_id?: string
          who_am_i_when_alone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "final_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      four_pillars_entries: {
        Row: {
          children_text: string | null
          id: string
          moment: string
          partner_text: string | null
          reflection: string | null
          self_text: string | null
          updated_at: string | null
          user_id: string
          work_text: string | null
        }
        Insert: {
          children_text?: string | null
          id?: string
          moment: string
          partner_text?: string | null
          reflection?: string | null
          self_text?: string | null
          updated_at?: string | null
          user_id: string
          work_text?: string | null
        }
        Update: {
          children_text?: string | null
          id?: string
          moment?: string
          partner_text?: string | null
          reflection?: string | null
          self_text?: string | null
          updated_at?: string | null
          user_id?: string
          work_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "four_pillars_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freeform_entries: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freeform_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      front_matter_entries: {
        Row: {
          content: Json | null
          id: string
          page_key: string
          signed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          id?: string
          page_key: string
          signed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json | null
          id?: string
          page_key?: string
          signed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "front_matter_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gap_entries: {
        Row: {
          be: Json | null
          do_section: Json | null
          have: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          be?: Json | null
          do_section?: Json | null
          have?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          be?: Json | null
          do_section?: Json | null
          have?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gap_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrity_inventory_entries: {
        Row: {
          broken_to_children: string | null
          broken_to_partner: string | null
          broken_to_self: string | null
          broken_to_work: string | null
          id: string
          reflection: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          broken_to_children?: string | null
          broken_to_partner?: string | null
          broken_to_self?: string | null
          broken_to_work?: string | null
          id?: string
          reflection?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          broken_to_children?: string | null
          broken_to_partner?: string | null
          broken_to_self?: string | null
          broken_to_work?: string | null
          id?: string
          reflection?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrity_inventory_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string | null
          is_active: boolean | null
          program_source: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          is_active?: boolean | null
          program_source: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          is_active?: boolean | null
          program_source?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_entries: {
        Row: {
          bigger_work: string | null
          brotherhood_say: string | null
          children_remember: string | null
          id: string
          partner_say: string | null
          ten_year_legacy: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bigger_work?: string | null
          brotherhood_say?: string | null
          children_remember?: string | null
          id?: string
          partner_say?: string | null
          ten_year_legacy?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bigger_work?: string | null
          brotherhood_say?: string | null
          children_remember?: string | null
          id?: string
          partner_say?: string | null
          ten_year_legacy?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      man_comparison_entries: {
        Row: {
          becoming: string[] | null
          been: string[] | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          becoming?: string[] | null
          been?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          becoming?: string[] | null
          been?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "man_comparison_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      morning_night_routines: {
        Row: {
          benefits: string | null
          description: string | null
          id: string
          non_negotiables: string[] | null
          reflection: string | null
          routine_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          benefits?: string | null
          description?: string | null
          id?: string
          non_negotiables?: string[] | null
          reflection?: string | null
          routine_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          benefits?: string | null
          description?: string | null
          id?: string
          non_negotiables?: string[] | null
          reflection?: string | null
          routine_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "morning_night_routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_habit_grids: {
        Row: {
          habits: string[] | null
          id: string
          phase: number
          reflection: string | null
          ticks: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          habits?: string[] | null
          id?: string
          phase: number
          reflection?: string | null
          ticks?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          habits?: string[] | null
          id?: string
          phase?: number
          reflection?: string | null
          ticks?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_habit_grids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_resets: {
        Row: {
          completed_at: string | null
          id: string
          phase: number
          reflections: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          phase: number
          reflections?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          phase?: number
          reflections?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_resets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_day: number | null
          current_phase: number | null
          display_name: string | null
          email: string
          id: string
          invite_code_used: string | null
          program_source: string | null
          started_at: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_day?: number | null
          current_phase?: number | null
          display_name?: string | null
          email: string
          id: string
          invite_code_used?: string | null
          program_source?: string | null
          started_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_day?: number | null
          current_phase?: number | null
          display_name?: string | null
          email?: string
          id?: string
          invite_code_used?: string | null
          program_source?: string | null
          started_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          context: string | null
          created_at: string | null
          email_error: string | null
          email_sent_at: string | null
          id: string
          recipient_email: string | null
          recipient_name: string
          recipient_phone: string | null
          referrer_id: string
          referrer_name: string | null
          why: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          email_error?: string | null
          email_sent_at?: string | null
          id?: string
          recipient_email?: string | null
          recipient_name: string
          recipient_phone?: string | null
          referrer_id: string
          referrer_name?: string | null
          why?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          email_error?: string | null
          email_sent_at?: string | null
          id?: string
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string | null
          referrer_id?: string
          referrer_name?: string | null
          why?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reset_events: {
        Row: {
          created_at: string | null
          id: string
          missed_days: number | null
          reflections: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          missed_days?: number | null
          reflections?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          missed_days?: number | null
          reflections?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reset_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_entries: {
        Row: {
          focus: Json | null
          focus_completed_at: string | null
          id: string
          phase: number
          review_completed_at: string | null
          sunday_review: Json | null
          updated_at: string | null
          user_id: string
          week_number: number
        }
        Insert: {
          focus?: Json | null
          focus_completed_at?: string | null
          id?: string
          phase: number
          review_completed_at?: string | null
          sunday_review?: Json | null
          updated_at?: string | null
          user_id: string
          week_number: number
        }
        Update: {
          focus?: Json | null
          focus_completed_at?: string | null
          id?: string
          phase?: number
          review_completed_at?: string | null
          sunday_review?: Json | null
          updated_at?: string | null
          user_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wheel_entries: {
        Row: {
          completed_at: string | null
          debrief: Json | null
          id: string
          moment: string
          ratings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          debrief?: Json | null
          id?: string
          moment: string
          ratings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          debrief?: Json | null
          id?: string
          moment?: string
          ratings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wheel_entries_user_id_fkey"
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
      redeem_invite_code: { Args: { code_input: string }; Returns: boolean }
      validate_invite_code: { Args: { code_input: string }; Returns: boolean }
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
