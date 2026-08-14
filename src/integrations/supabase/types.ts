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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          id: number
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: never
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: never
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          body: string[]
          created_at: string
          cta_href: string | null
          cta_label: string | null
          eyebrow: string | null
          heading: string | null
          heading_emphasis: string | null
          id: string
          image_alt: string | null
          image_path: string | null
          key: string
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          body?: string[]
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          heading?: string | null
          heading_emphasis?: string | null
          id?: string
          image_alt?: string | null
          image_path?: string | null
          key: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          body?: string[]
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          heading?: string | null
          heading_emphasis?: string | null
          id?: string
          image_alt?: string | null
          image_path?: string | null
          key?: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          area: string | null
          budget_band: string | null
          category: Database["public"]["Enums"]["primary_category"] | null
          created_at: string
          email: string
          estimated_total_kes: number | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          phone: string | null
          quoted_amount_kes: number | null
          reference: string
          referrer: string | null
          rooms: Database["public"]["Enums"]["room"][]
          service_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          timeline: string | null
          updated_at: string
          user_agent: string | null
          utm: Json
          wall_height_cm: number | null
          wall_width_cm: number | null
          whatsapp_opt_in: boolean
        }
        Insert: {
          area?: string | null
          budget_band?: string | null
          category?: Database["public"]["Enums"]["primary_category"] | null
          created_at?: string
          email: string
          estimated_total_kes?: number | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          phone?: string | null
          quoted_amount_kes?: number | null
          reference?: string
          referrer?: string | null
          rooms?: Database["public"]["Enums"]["room"][]
          service_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm?: Json
          wall_height_cm?: number | null
          wall_width_cm?: number | null
          whatsapp_opt_in?: boolean
        }
        Update: {
          area?: string | null
          budget_band?: string | null
          category?: Database["public"]["Enums"]["primary_category"] | null
          created_at?: string
          email?: string
          estimated_total_kes?: number | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          quoted_amount_kes?: number | null
          reference?: string
          referrer?: string | null
          rooms?: Database["public"]["Enums"]["room"][]
          service_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm?: Json
          wall_height_cm?: number | null
          wall_width_cm?: number | null
          whatsapp_opt_in?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_attachments: {
        Row: {
          byte_size: number | null
          content_type: string | null
          created_at: string
          enquiry_id: string
          file_name: string | null
          id: string
          storage_path: string
        }
        Insert: {
          byte_size?: number | null
          content_type?: string | null
          created_at?: string
          enquiry_id: string
          file_name?: string | null
          id?: string
          storage_path: string
        }
        Update: {
          byte_size?: number | null
          content_type?: string | null
          created_at?: string
          enquiry_id?: string
          file_name?: string | null
          id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_attachments_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_items: {
        Row: {
          category: Database["public"]["Enums"]["primary_category"]
          created_at: string
          enquiry_id: string
          estimated_price_kes: number | null
          frame_finish_id: string | null
          frame_label: string | null
          id: string
          quantity: number
          size_label: string | null
          size_option_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["primary_category"]
          created_at?: string
          enquiry_id: string
          estimated_price_kes?: number | null
          frame_finish_id?: string | null
          frame_label?: string | null
          id?: string
          quantity?: number
          size_label?: string | null
          size_option_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["primary_category"]
          created_at?: string
          enquiry_id?: string
          estimated_price_kes?: number | null
          frame_finish_id?: string | null
          frame_label?: string | null
          id?: string
          quantity?: number
          size_label?: string | null
          size_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_items_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_items_frame_finish_id_fkey"
            columns: ["frame_finish_id"]
            isOneToOne: false
            referencedRelation: "frame_finishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_items_size_option_id_fkey"
            columns: ["size_option_id"]
            isOneToOne: false
            referencedRelation: "size_options"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      frame_finishes: {
        Row: {
          created_at: string
          id: string
          image_alt: string | null
          image_path: string | null
          name: string
          note: string
          price_multiplier: number
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_path?: string | null
          name: string
          note?: string
          price_multiplier?: number
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_path?: string | null
          name?: string
          note?: string
          price_multiplier?: number
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt: string
          blur_data_url: string | null
          created_at: string
          height: number | null
          id: string
          project_id: string
          role: Database["public"]["Enums"]["image_role"]
          sort_order: number
          storage_path: string
          width: number | null
        }
        Insert: {
          alt?: string
          blur_data_url?: string | null
          created_at?: string
          height?: number | null
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["image_role"]
          sort_order?: number
          storage_path: string
          width?: number | null
        }
        Update: {
          alt?: string
          blur_data_url?: string | null
          created_at?: string
          height?: number | null
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["image_role"]
          sort_order?: number
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approach: string | null
          brief: string | null
          caption: string
          category: Database["public"]["Enums"]["primary_category"]
          completed_on: string | null
          created_at: string
          dimensions: string | null
          featured: boolean
          frame_finish_id: string | null
          id: string
          lead_time_days: number | null
          location: string | null
          outcome: string | null
          price_from_kes: number | null
          published_at: string | null
          room: Database["public"]["Enums"]["room"]
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approach?: string | null
          brief?: string | null
          caption?: string
          category: Database["public"]["Enums"]["primary_category"]
          completed_on?: string | null
          created_at?: string
          dimensions?: string | null
          featured?: boolean
          frame_finish_id?: string | null
          id?: string
          lead_time_days?: number | null
          location?: string | null
          outcome?: string | null
          price_from_kes?: number | null
          published_at?: string | null
          room: Database["public"]["Enums"]["room"]
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approach?: string | null
          brief?: string | null
          caption?: string
          category?: Database["public"]["Enums"]["primary_category"]
          completed_on?: string | null
          created_at?: string
          dimensions?: string | null
          featured?: boolean
          frame_finish_id?: string | null
          id?: string
          lead_time_days?: number | null
          location?: string | null
          outcome?: string | null
          price_from_kes?: number | null
          published_at?: string | null
          room?: Database["public"]["Enums"]["room"]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_frame_finish_fkey"
            columns: ["frame_finish_id"]
            isOneToOne: false
            referencedRelation: "frame_finishes"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          body: string
          created_at: string
          detail: string | null
          id: string
          lead_time_days: number | null
          number: string
          price_from_kes: number | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          detail?: string | null
          id?: string
          lead_time_days?: number | null
          number?: string
          price_from_kes?: number | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          detail?: string | null
          id?: string
          lead_time_days?: number | null
          number?: string
          price_from_kes?: number | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          city: string
          country: string
          currency: string
          display_name: string
          email: string
          hours: string
          id: boolean
          latitude: number | null
          legal_name: string
          location: string
          longitude: number | null
          og_image_path: string | null
          phone_display: string
          phone_e164: string
          price_disclaimer: string
          seo_description: string
          seo_title: string
          service_areas: string[]
          socials: Json
          stats: Json
          street_address: string | null
          tagline: string
          updated_at: string
          whatsapp_e164: string
        }
        Insert: {
          city?: string
          country?: string
          currency?: string
          display_name?: string
          email?: string
          hours?: string
          id?: boolean
          latitude?: number | null
          legal_name?: string
          location?: string
          longitude?: number | null
          og_image_path?: string | null
          phone_display?: string
          phone_e164?: string
          price_disclaimer?: string
          seo_description?: string
          seo_title?: string
          service_areas?: string[]
          socials?: Json
          stats?: Json
          street_address?: string | null
          tagline?: string
          updated_at?: string
          whatsapp_e164?: string
        }
        Update: {
          city?: string
          country?: string
          currency?: string
          display_name?: string
          email?: string
          hours?: string
          id?: boolean
          latitude?: number | null
          legal_name?: string
          location?: string
          longitude?: number | null
          og_image_path?: string | null
          phone_display?: string
          phone_e164?: string
          price_disclaimer?: string
          seo_description?: string
          seo_title?: string
          service_areas?: string[]
          socials?: Json
          stats?: Json
          street_address?: string | null
          tagline?: string
          updated_at?: string
          whatsapp_e164?: string
        }
        Relationships: []
      }
      size_options: {
        Row: {
          base_price_kes: number
          category: Database["public"]["Enums"]["primary_category"]
          created_at: string
          diameter_cm: number | null
          height_cm: number | null
          id: string
          label: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
          width_cm: number | null
        }
        Insert: {
          base_price_kes?: number
          category: Database["public"]["Enums"]["primary_category"]
          created_at?: string
          diameter_cm?: number | null
          height_cm?: number | null
          id?: string
          label: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
          width_cm?: number | null
        }
        Update: {
          base_price_kes?: number
          category?: Database["public"]["Enums"]["primary_category"]
          created_at?: string
          diameter_cm?: number | null
          height_cm?: number | null
          id?: string
          label?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
          width_cm?: number | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          source: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          source?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_label: string
          author_name: string
          created_at: string
          given_on: string | null
          id: string
          project_id: string | null
          quote: string
          rating: number | null
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          author_label?: string
          author_name: string
          created_at?: string
          given_on?: string | null
          id?: string
          project_id?: string | null
          quote: string
          rating?: number | null
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          author_label?: string
          author_name?: string
          created_at?: string
          given_on?: string | null
          id?: string
          project_id?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      slugify: { Args: { value: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "editor"
      enquiry_status:
        | "new"
        | "contacted"
        | "quoted"
        | "scheduled"
        | "won"
        | "lost"
        | "spam"
      image_role: "hero" | "gallery" | "before" | "after" | "detail"
      primary_category: "art" | "mirror" | "decor"
      publish_status: "draft" | "published" | "archived"
      room:
        | "terrace"
        | "lounge"
        | "corridor"
        | "washroom"
        | "bedroom"
        | "office"
        | "study"
        | "stairway"
        | "kitchen"
        | "dining"
        | "foyer"
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
      app_role: ["admin", "editor"],
      enquiry_status: [
        "new",
        "contacted",
        "quoted",
        "scheduled",
        "won",
        "lost",
        "spam",
      ],
      image_role: ["hero", "gallery", "before", "after", "detail"],
      primary_category: ["art", "mirror", "decor"],
      publish_status: ["draft", "published", "archived"],
      room: [
        "terrace",
        "lounge",
        "corridor",
        "washroom",
        "bedroom",
        "office",
        "study",
        "stairway",
        "kitchen",
        "dining",
        "foyer",
      ],
    },
  },
} as const
