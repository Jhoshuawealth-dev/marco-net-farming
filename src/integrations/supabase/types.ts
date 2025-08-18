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
      advertisements: {
        Row: {
          ad_type: Database["public"]["Enums"]["ad_type"]
          click_url: string | null
          content_url: string | null
          created_at: string
          created_by: string
          daily_budget: number | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          max_views_per_user: number
          reward_zukacoin: number
          start_date: string
          target_audience: Json | null
          title: string
          total_budget: number | null
          updated_at: string
        }
        Insert: {
          ad_type: Database["public"]["Enums"]["ad_type"]
          click_url?: string | null
          content_url?: string | null
          created_at?: string
          created_by: string
          daily_budget?: number | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          max_views_per_user?: number
          reward_zukacoin?: number
          start_date: string
          target_audience?: Json | null
          title: string
          total_budget?: number | null
          updated_at?: string
        }
        Update: {
          ad_type?: Database["public"]["Enums"]["ad_type"]
          click_url?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string
          daily_budget?: number | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          max_views_per_user?: number
          reward_zukacoin?: number
          start_date?: string
          target_audience?: Json | null
          title?: string
          total_budget?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      course_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category_id: string
          content: Json
          created_at: string
          created_by: string
          description: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          duration_minutes: number
          id: string
          is_published: boolean
          reward_zukacoin: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          content: Json
          created_at?: string
          created_by: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          duration_minutes: number
          id?: string
          is_published?: boolean
          reward_zukacoin?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          duration_minutes?: number
          id?: string
          is_published?: boolean
          reward_zukacoin?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_transactions: {
        Row: {
          amount: number
          created_at: string
          crypto_id: string
          fees: number
          id: string
          price_per_unit: number
          total_value: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          crypto_id: string
          fees?: number
          id?: string
          price_per_unit: number
          total_value: number
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          crypto_id?: string
          fees?: number
          id?: string
          price_per_unit?: number
          total_value?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_transactions_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "cryptocurrencies"
            referencedColumns: ["id"]
          },
        ]
      }
      cryptocurrencies: {
        Row: {
          created_at: string
          current_price: number
          id: string
          last_updated: string
          logo_url: string | null
          market_cap: number | null
          name: string
          price_change_24h: number
          symbol: string
          volume_24h: number | null
        }
        Insert: {
          created_at?: string
          current_price?: number
          id?: string
          last_updated?: string
          logo_url?: string | null
          market_cap?: number | null
          name: string
          price_change_24h?: number
          symbol: string
          volume_24h?: number | null
        }
        Update: {
          created_at?: string
          current_price?: number
          id?: string
          last_updated?: string
          logo_url?: string | null
          market_cap?: number | null
          name?: string
          price_change_24h?: number
          symbol?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_participations: {
        Row: {
          completed: boolean
          completion_date: string | null
          event_id: string
          id: string
          joined_at: string
          reward_claimed: boolean
          user_id: string
        }
        Insert: {
          completed?: boolean
          completion_date?: string | null
          event_id: string
          id?: string
          joined_at?: string
          reward_claimed?: boolean
          user_id: string
        }
        Update: {
          completed?: boolean
          completion_date?: string | null
          event_id?: string
          id?: string
          joined_at?: string
          reward_claimed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category_id: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          max_participants: number | null
          requirements: Json | null
          reward_description: string | null
          reward_zukacoin: number
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          max_participants?: number | null
          requirements?: Json | null
          reward_description?: string | null
          reward_zukacoin?: number
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          max_participants?: number | null
          requirements?: Json | null
          reward_description?: string | null
          reward_zukacoin?: number
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      investment_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          duration_days: number | null
          expected_return_rate: number
          id: string
          image_url: string | null
          investment_type: Database["public"]["Enums"]["investment_type"]
          is_active: boolean
          minimum_amount: number
          name: string
          risk_level: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          duration_days?: number | null
          expected_return_rate: number
          id?: string
          image_url?: string | null
          investment_type: Database["public"]["Enums"]["investment_type"]
          is_active?: boolean
          minimum_amount: number
          name: string
          risk_level: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          duration_days?: number | null
          expected_return_rate?: number
          id?: string
          image_url?: string | null
          investment_type?: Database["public"]["Enums"]["investment_type"]
          is_active?: boolean
          minimum_amount?: number
          name?: string
          risk_level?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "investment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_equipment: {
        Row: {
          cost_real_money: number | null
          cost_zukacoin: number
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          power_boost: number
        }
        Insert: {
          cost_real_money?: number | null
          cost_zukacoin: number
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          power_boost: number
        }
        Update: {
          cost_real_money?: number | null
          cost_zukacoin?: number
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          power_boost?: number
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          bonus_multiplier: number
          created_at: string
          id: string
          mining_duration: number
          user_id: string
          zukacoin_earned: number
        }
        Insert: {
          bonus_multiplier?: number
          created_at?: string
          id?: string
          mining_duration: number
          user_id: string
          zukacoin_earned: number
        }
        Update: {
          bonus_multiplier?: number
          created_at?: string
          id?: string
          mining_duration?: number
          user_id?: string
          zukacoin_earned?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_pinned: boolean
          likes_count: number
          poll_options: Json | null
          post_type: Database["public"]["Enums"]["post_type"]
          shares_count: number
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          likes_count?: number
          poll_options?: Json | null
          post_type?: Database["public"]["Enums"]["post_type"]
          shares_count?: number
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          likes_count?: number
          poll_options?: Json | null
          post_type?: Database["public"]["Enums"]["post_type"]
          shares_count?: number
          updated_at?: string
          user_id?: string
          video_url?: string | null
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
          gender: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          occupation: string | null
          phone: string | null
          posts_count: number | null
          preferences: Json | null
          privacy_settings: Json | null
          social_links: Json | null
          splash_completed: boolean
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
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          occupation?: string | null
          phone?: string | null
          posts_count?: number | null
          preferences?: Json | null
          privacy_settings?: Json | null
          social_links?: Json | null
          splash_completed?: boolean
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
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          occupation?: string | null
          phone?: string | null
          posts_count?: number | null
          preferences?: Json | null
          privacy_settings?: Json | null
          social_links?: Json | null
          splash_completed?: boolean
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_table: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_table?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_table?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          badge_url: string | null
          course_id: string | null
          description: string | null
          earned_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          badge_url?: string | null
          course_id?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          badge_url?: string | null
          course_id?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ad_interactions: {
        Row: {
          ad_id: string
          created_at: string
          id: string
          interaction_type: string
          reward_earned: number
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          id?: string
          interaction_type: string
          reward_earned?: number
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          id?: string
          interaction_type?: string
          reward_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ad_interactions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed: boolean
          completion_date: string | null
          course_id: string
          current_lesson: number
          id: string
          progress_percentage: number
          started_at: string
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completion_date?: string | null
          course_id: string
          current_lesson?: number
          id?: string
          progress_percentage?: number
          started_at?: string
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completion_date?: string | null
          course_id?: string
          current_lesson?: number
          id?: string
          progress_percentage?: number
          started_at?: string
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_crypto_holdings: {
        Row: {
          amount: number
          average_buy_price: number
          created_at: string
          crypto_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          average_buy_price?: number
          created_at?: string
          crypto_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          average_buy_price?: number
          created_at?: string
          crypto_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_crypto_holdings_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "cryptocurrencies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_equipment: {
        Row: {
          equipment_id: string
          expires_at: string | null
          id: string
          purchased_at: string
          quantity: number
          user_id: string
        }
        Insert: {
          equipment_id: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          quantity?: number
          user_id: string
        }
        Update: {
          equipment_id?: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "mining_equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      user_investments: {
        Row: {
          amount_invested: number
          created_at: string
          current_value: number
          end_date: string | null
          id: string
          investment_id: string
          profit_loss: number
          start_date: string
          status: Database["public"]["Enums"]["investment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_invested: number
          created_at?: string
          current_value?: number
          end_date?: string | null
          id?: string
          investment_id: string
          profit_loss?: number
          start_date?: string
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_invested?: number
          created_at?: string
          current_value?: number
          end_date?: string | null
          id?: string
          investment_id?: string
          profit_loss?: number
          start_date?: string
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_investments_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mining: {
        Row: {
          consecutive_days: number
          created_at: string
          id: string
          last_mining_session: string | null
          mining_power: number
          total_mined: number
          updated_at: string
          user_id: string
          zukacoin_balance: number
        }
        Insert: {
          consecutive_days?: number
          created_at?: string
          id?: string
          last_mining_session?: string | null
          mining_power?: number
          total_mined?: number
          updated_at?: string
          user_id: string
          zukacoin_balance?: number
        }
        Update: {
          consecutive_days?: number
          created_at?: string
          id?: string
          last_mining_session?: string | null
          mining_power?: number
          total_mined?: number
          updated_at?: string
          user_id?: string
          zukacoin_balance?: number
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
      ad_type: "banner" | "video" | "interactive" | "sponsored_post"
      course_difficulty: "beginner" | "intermediate" | "advanced"
      event_status: "upcoming" | "active" | "completed" | "cancelled"
      investment_status: "active" | "completed" | "paused"
      investment_type: "virtual" | "real"
      post_type: "text" | "image" | "video" | "poll"
      transaction_type:
        | "mining_reward"
        | "investment_profit"
        | "social_reward"
        | "event_reward"
        | "ad_reward"
        | "purchase"
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
      ad_type: ["banner", "video", "interactive", "sponsored_post"],
      course_difficulty: ["beginner", "intermediate", "advanced"],
      event_status: ["upcoming", "active", "completed", "cancelled"],
      investment_status: ["active", "completed", "paused"],
      investment_type: ["virtual", "real"],
      post_type: ["text", "image", "video", "poll"],
      transaction_type: [
        "mining_reward",
        "investment_profit",
        "social_reward",
        "event_reward",
        "ad_reward",
        "purchase",
      ],
    },
  },
} as const
