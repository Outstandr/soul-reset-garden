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
      course_modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          module_number: number
          passing_score: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          module_number: number
          passing_score?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          module_number?: number
          passing_score?: number
          title?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          challenges: string | null
          created_at: string
          energy_level: number | null
          entry_date: string
          goals: string | null
          gratitude: string | null
          id: string
          mood: string | null
          reflection: string | null
          updated_at: string
          user_id: string
          wins: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string
          energy_level?: number | null
          entry_date: string
          goals?: string | null
          gratitude?: string | null
          id?: string
          mood?: string | null
          reflection?: string | null
          updated_at?: string
          user_id: string
          wins?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string
          energy_level?: number | null
          entry_date?: string
          goals?: string | null
          gratitude?: string | null
          id?: string
          mood?: string | null
          reflection?: string | null
          updated_at?: string
          user_id?: string
          wins?: string | null
        }
        Relationships: []
      }
      masterclass_lessons: {
        Row: {
          action_step: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          interactive_config: Json | null
          interactive_type: string
          key_takeaways: Json | null
          lesson_number: number
          module_name: string
          reflection_prompt: string | null
          subtitle_en_url: string | null
          subtitle_nl_url: string | null
          subtitle_ru_url: string | null
          title: string
          video_end_time: string
          video_start_time: string
          word_count: number | null
        }
        Insert: {
          action_step?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          interactive_config?: Json | null
          interactive_type: string
          key_takeaways?: Json | null
          lesson_number: number
          module_name: string
          reflection_prompt?: string | null
          subtitle_en_url?: string | null
          subtitle_nl_url?: string | null
          subtitle_ru_url?: string | null
          title: string
          video_end_time: string
          video_start_time: string
          word_count?: number | null
        }
        Update: {
          action_step?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          interactive_config?: Json | null
          interactive_type?: string
          key_takeaways?: Json | null
          lesson_number?: number
          module_name?: string
          reflection_prompt?: string | null
          subtitle_en_url?: string | null
          subtitle_nl_url?: string | null
          subtitle_ru_url?: string | null
          title?: string
          video_end_time?: string
          video_start_time?: string
          word_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          has_completed_onboarding: boolean | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          lesson_id: string
          options: Json | null
          order_number: number
          points: number
          question_text: string
          question_type: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          lesson_id: string
          options?: Json | null
          order_number: number
          points?: number
          question_text: string
          question_type: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          lesson_id?: string
          options?: Json | null
          order_number?: number
          points?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "masterclass_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      subtitle_generation_jobs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          lesson_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          lesson_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          lesson_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subtitle_generation_jobs_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "masterclass_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certificates: {
        Row: {
          certificate_number: string
          course_name: string
          created_at: string
          final_score: number
          id: string
          issue_date: string
          module_name: string | null
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_name: string
          created_at?: string
          final_score: number
          id?: string
          issue_date?: string
          module_name?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_name?: string
          created_at?: string
          final_score?: number
          id?: string
          issue_date?: string
          module_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_discovery: {
        Row: {
          ai_report: Json | null
          biggest_challenge: string | null
          biggest_life_priority: string | null
          biggest_nutrition_challenge: string | null
          commitment_level: number | null
          created_at: string
          decision_making: string | null
          describe_yourself: string | null
          dietary_restrictions: string | null
          discipline_level: number | null
          eating_style: string | null
          energy_level: number | null
          family_situation: string | null
          fitness_goal: string | null
          health_level: number | null
          hydration_level: number | null
          id: string
          job_industry: string | null
          job_title: string | null
          meals_per_day: number | null
          motivation_style: string | null
          occupation_type: string | null
          personality_type: string | null
          personalized_diet_plan: Json | null
          personalized_training_plan: Json | null
          preferred_workout: string | null
          primary_goal: string | null
          recommended_lessons: string[] | null
          report_generated_at: string | null
          secondary_goals: string[] | null
          sleep_hours: number | null
          sleep_quality: number | null
          stress_level: number | null
          time_available: string | null
          updated_at: string
          user_id: string
          wake_up_time: string | null
          what_holds_you_back: string | null
          where_you_want_to_be: string | null
          workout_frequency: string | null
        }
        Insert: {
          ai_report?: Json | null
          biggest_challenge?: string | null
          biggest_life_priority?: string | null
          biggest_nutrition_challenge?: string | null
          commitment_level?: number | null
          created_at?: string
          decision_making?: string | null
          describe_yourself?: string | null
          dietary_restrictions?: string | null
          discipline_level?: number | null
          eating_style?: string | null
          energy_level?: number | null
          family_situation?: string | null
          fitness_goal?: string | null
          health_level?: number | null
          hydration_level?: number | null
          id?: string
          job_industry?: string | null
          job_title?: string | null
          meals_per_day?: number | null
          motivation_style?: string | null
          occupation_type?: string | null
          personality_type?: string | null
          personalized_diet_plan?: Json | null
          personalized_training_plan?: Json | null
          preferred_workout?: string | null
          primary_goal?: string | null
          recommended_lessons?: string[] | null
          report_generated_at?: string | null
          secondary_goals?: string[] | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          time_available?: string | null
          updated_at?: string
          user_id: string
          wake_up_time?: string | null
          what_holds_you_back?: string | null
          where_you_want_to_be?: string | null
          workout_frequency?: string | null
        }
        Update: {
          ai_report?: Json | null
          biggest_challenge?: string | null
          biggest_life_priority?: string | null
          biggest_nutrition_challenge?: string | null
          commitment_level?: number | null
          created_at?: string
          decision_making?: string | null
          describe_yourself?: string | null
          dietary_restrictions?: string | null
          discipline_level?: number | null
          eating_style?: string | null
          energy_level?: number | null
          family_situation?: string | null
          fitness_goal?: string | null
          health_level?: number | null
          hydration_level?: number | null
          id?: string
          job_industry?: string | null
          job_title?: string | null
          meals_per_day?: number | null
          motivation_style?: string | null
          occupation_type?: string | null
          personality_type?: string | null
          personalized_diet_plan?: Json | null
          personalized_training_plan?: Json | null
          preferred_workout?: string | null
          primary_goal?: string | null
          recommended_lessons?: string[] | null
          report_generated_at?: string | null
          secondary_goals?: string[] | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          time_available?: string | null
          updated_at?: string
          user_id?: string
          wake_up_time?: string | null
          what_holds_you_back?: string | null
          where_you_want_to_be?: string | null
          workout_frequency?: string | null
        }
        Relationships: []
      }
      user_highlights: {
        Row: {
          created_at: string
          highlight_text: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          highlight_text: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          highlight_text?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          assignment_responses: Json | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          interactive_responses: Json | null
          lesson_id: string
          updated_at: string
          user_id: string
          video_progress: number | null
        }
        Insert: {
          assignment_responses?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          interactive_responses?: Json | null
          lesson_id: string
          updated_at?: string
          user_id: string
          video_progress?: number | null
        }
        Update: {
          assignment_responses?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          interactive_responses?: Json | null
          lesson_id?: string
          updated_at?: string
          user_id?: string
          video_progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "masterclass_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          completed_at: string
          created_at: string
          id: string
          lesson_id: string
          passed: boolean
          percentage: number
          score: number
          total_points: number
          user_id: string
        }
        Insert: {
          answers: Json
          attempt_number?: number
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id: string
          passed: boolean
          percentage: number
          score: number
          total_points: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id?: string
          passed?: boolean
          percentage?: number
          score?: number
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "masterclass_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reflections: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          reflection_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          reflection_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          reflection_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          id: string
          lessons_completed: number | null
          streak_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lessons_completed?: number | null
          streak_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lessons_completed?: number | null
          streak_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
