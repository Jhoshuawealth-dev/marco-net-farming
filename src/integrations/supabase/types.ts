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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ad_billing: {
        Row: {
          ad_id: string | null
          admin_share: number | null
          cost_per_view: number | null
          created_at: string | null
          id: string
          total_spent: number | null
        }
        Insert: {
          ad_id?: string | null
          admin_share?: number | null
          cost_per_view?: number | null
          created_at?: string | null
          id?: string
          total_spent?: number | null
        }
        Update: {
          ad_id?: string | null
          admin_share?: number | null
          cost_per_view?: number | null
          created_at?: string | null
          id?: string
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_billing_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_daily_impressions: {
        Row: {
          ad_id: string
          created_at: string | null
          id: string
          impression_count: number | null
          impression_date: string
          updated_at: string | null
        }
        Insert: {
          ad_id: string
          created_at?: string | null
          id?: string
          impression_count?: number | null
          impression_date?: string
          updated_at?: string | null
        }
        Update: {
          ad_id?: string
          created_at?: string | null
          id?: string
          impression_count?: number | null
          impression_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_daily_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "adverts"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_impressions: {
        Row: {
          ad_id: string | null
          created_at: string | null
          id: string
          impression_type: string
          user_id: string | null
        }
        Insert: {
          ad_id?: string | null
          created_at?: string | null
          id?: string
          impression_type: string
          user_id?: string | null
        }
        Update: {
          ad_id?: string | null
          created_at?: string | null
          id?: string
          impression_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_impressions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          ad_type: string | null
          budget: number
          caption: string | null
          content_url: string
          created_at: string | null
          id: string
          spent: number | null
          status: string | null
          target_age_range: unknown
          target_country: string[] | null
          user_id: string | null
        }
        Insert: {
          ad_type?: string | null
          budget: number
          caption?: string | null
          content_url: string
          created_at?: string | null
          id?: string
          spent?: number | null
          status?: string | null
          target_age_range?: unknown
          target_country?: string[] | null
          user_id?: string | null
        }
        Update: {
          ad_type?: string | null
          budget?: number
          caption?: string | null
          content_url?: string
          created_at?: string | null
          id?: string
          spent?: number | null
          status?: string | null
          target_age_range?: unknown
          target_country?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      adverts: {
        Row: {
          approval_status: string | null
          budget: number | null
          caption: string | null
          created_at: string
          end_date: string | null
          id: string
          is_boosted: boolean | null
          media_url: string | null
          payment_method: string | null
          spent: number | null
          start_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          budget?: number | null
          caption?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_boosted?: boolean | null
          media_url?: string | null
          payment_method?: string | null
          spent?: number | null
          start_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          budget?: number | null
          caption?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_boosted?: boolean | null
          media_url?: string | null
          payment_method?: string | null
          spent?: number | null
          start_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          splash_completed: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          splash_completed?: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          splash_completed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean | null
          course_id: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reward: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reward?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reward?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      currency_rates: {
        Row: {
          currency_code: string
          id: string
          rate_to_usd: number
          updated_at: string | null
        }
        Insert: {
          currency_code: string
          id?: string
          rate_to_usd: number
          updated_at?: string | null
        }
        Update: {
          currency_code?: string
          id?: string
          rate_to_usd?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_limits: {
        Row: {
          comments_given: number | null
          created_at: string | null
          id: string
          likes_given: number | null
          limit_date: string
          posts_created: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comments_given?: number | null
          created_at?: string | null
          id?: string
          likes_given?: number | null
          limit_date?: string
          posts_created?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comments_given?: number | null
          created_at?: string | null
          id?: string
          likes_given?: number | null
          limit_date?: string
          posts_created?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      investment_records: {
        Row: {
          created_at: string | null
          id: string
          investment_name: string
          profit: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_name: string
          profit?: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_name?: string
          profit?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_records: {
        Row: {
          created_at: string | null
          date_mined: string
          id: string
          mined_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_mined?: string
          id?: string
          mined_amount: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_mined?: string
          id?: string
          mined_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mining_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          approval_status: string | null
          content: string | null
          created_at: string
          id: string
          media_url: string | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          content?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          content?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          location: string | null
          occupation: string | null
          phone: string | null
          posts_count: number | null
          privacy_settings: Json | null
          social_links: Json | null
          splash_completed: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          location?: string | null
          occupation?: string | null
          phone?: string | null
          posts_count?: number | null
          privacy_settings?: Json | null
          social_links?: Json | null
          splash_completed?: boolean | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          location?: string | null
          occupation?: string | null
          phone?: string | null
          posts_count?: number | null
          privacy_settings?: Json | null
          social_links?: Json | null
          splash_completed?: boolean | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      revenue_records: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          source: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          source: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          source?: string
        }
        Relationships: []
      }
      social_engagement: {
        Row: {
          created_at: string | null
          engagement_type: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          engagement_type: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          engagement_type?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_engagement_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          country: string
          created_at: string | null
          currency_code: string
          email: string
          full_name: string
          id: string
          updated_at: string | null
          verification_document_type: string | null
          verification_document_url: string | null
          verification_status: string | null
          wallet_balance: number
          zuka_balance: number
        }
        Insert: {
          country: string
          created_at?: string | null
          currency_code: string
          email: string
          full_name: string
          id?: string
          updated_at?: string | null
          verification_document_type?: string | null
          verification_document_url?: string | null
          verification_status?: string | null
          wallet_balance?: number
          zuka_balance?: number
        }
        Update: {
          country?: string
          created_at?: string | null
          currency_code?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string | null
          verification_document_type?: string | null
          verification_document_url?: string | null
          verification_status?: string | null
          wallet_balance?: number
          zuka_balance?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_show_ad_today: { Args: { ad_uuid: string }; Returns: boolean }
      can_view_profile: { Args: { profile_user_id: string }; Returns: boolean }
      check_daily_engagement_limit: {
        Args: { engagement_type: string }
        Returns: boolean
      }
      check_daily_post_limit: { Args: never; Returns: boolean }
      filter_profile_data: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          location: string | null
          occupation: string | null
          phone: string | null
          posts_count: number | null
          privacy_settings: Json | null
          social_links: Json | null
          splash_completed: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        SetofOptions: {
          from: "profiles"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_ad_impression: { Args: { ad_uuid: string }; Returns: undefined }
      increment_daily_limit: {
        Args: { limit_type: string }
        Returns: undefined
      }
      reward_for_action: { Args: { action: string }; Returns: number }
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
