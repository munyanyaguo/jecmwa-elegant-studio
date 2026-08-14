export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Hand-authored to match `supabase/migrations/*`. Regenerate from the live
 * project once it exists:
 *   npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts
 */

export type PrimaryCategory = "art" | "mirror" | "decor"
export type Room =
  | "terrace" | "lounge" | "corridor" | "washroom" | "bedroom"
  | "office" | "study" | "stairway" | "kitchen" | "dining" | "foyer"
export type PublishStatus = "draft" | "published" | "archived"
export type ImageRole = "hero" | "gallery" | "before" | "after" | "detail"
export type EnquiryStatus = "new" | "contacted" | "quoted" | "scheduled" | "won" | "lost" | "spam"
export type AppRole = "admin" | "editor"

/** Generated tables expose Row/Insert/Update; ours share one shape. */
type Table<Row> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}

type Timestamps = { created_at: string; updated_at: string }

export type SiteSettingsRow = {
  id: boolean
  legal_name: string
  display_name: string
  tagline: string
  phone_display: string
  phone_e164: string
  whatsapp_e164: string
  email: string
  hours: string
  location: string
  street_address: string | null
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  service_areas: string[]
  socials: Json
  stats: Json
  seo_title: string
  seo_description: string
  og_image_path: string | null
  price_disclaimer: string
  currency: string
  updated_at: string
}

export type ContentBlockRow = Timestamps & {
  id: string
  key: string
  eyebrow: string | null
  heading: string | null
  heading_emphasis: string | null
  body: string[]
  image_path: string | null
  image_alt: string | null
  cta_label: string | null
  cta_href: string | null
  status: PublishStatus
}

export type ProjectRow = Timestamps & {
  id: string
  slug: string
  title: string
  caption: string
  summary: string | null
  brief: string | null
  approach: string | null
  outcome: string | null
  category: PrimaryCategory
  room: Room
  location: string | null
  completed_on: string | null
  dimensions: string | null
  frame_finish_id: string | null
  lead_time_days: number | null
  price_from_kes: number | null
  featured: boolean
  sort_order: number
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
}

export type ProjectImageRow = {
  id: string
  project_id: string
  storage_path: string
  alt: string
  role: ImageRole
  width: number | null
  height: number | null
  blur_data_url: string | null
  sort_order: number
  created_at: string
}

export type ServiceRow = Timestamps & {
  id: string
  slug: string
  number: string
  title: string
  body: string
  detail: string | null
  price_from_kes: number | null
  lead_time_days: number | null
  sort_order: number
  status: PublishStatus
}

export type FrameFinishRow = Timestamps & {
  id: string
  slug: string
  name: string
  note: string
  image_path: string | null
  image_alt: string | null
  price_multiplier: number
  sort_order: number
  status: PublishStatus
}

export type SizeOptionRow = Timestamps & {
  id: string
  category: PrimaryCategory
  label: string
  width_cm: number | null
  height_cm: number | null
  diameter_cm: number | null
  base_price_kes: number
  sort_order: number
  status: PublishStatus
}

export type TestimonialRow = Timestamps & {
  id: string
  quote: string
  author_name: string
  author_label: string
  project_id: string | null
  rating: number | null
  given_on: string | null
  sort_order: number
  status: PublishStatus
}

export type FaqRow = Timestamps & {
  id: string
  question: string
  answer: string
  sort_order: number
  status: PublishStatus
}

export type EnquiryRow = Timestamps & {
  id: string
  reference: string
  name: string
  email: string
  phone: string | null
  whatsapp_opt_in: boolean
  service_id: string | null
  category: PrimaryCategory | null
  rooms: Room[]
  budget_band: string | null
  timeline: string | null
  area: string | null
  wall_width_cm: number | null
  wall_height_cm: number | null
  message: string | null
  estimated_total_kes: number | null
  status: EnquiryStatus
  internal_notes: string | null
  quoted_amount_kes: number | null
  source: string | null
  utm: Json
  referrer: string | null
  user_agent: string | null
}

export type EnquiryItemRow = {
  id: string
  enquiry_id: string
  category: PrimaryCategory
  size_option_id: string | null
  frame_finish_id: string | null
  size_label: string | null
  frame_label: string | null
  quantity: number
  estimated_price_kes: number | null
  created_at: string
}

export type EnquiryAttachmentRow = {
  id: string
  enquiry_id: string
  storage_path: string
  file_name: string | null
  content_type: string | null
  byte_size: number | null
  created_at: string
}

export type SubscriberRow = {
  id: string
  email: string
  source: string | null
  confirmed: boolean
  unsubscribed_at: string | null
  created_at: string
}

export type UserRoleRow = {
  id: string
  user_id: string
  role: AppRole
  created_at: string
}

export type AuditLogRow = {
  id: number
  actor_id: string | null
  table_name: string
  record_id: string | null
  action: string
  diff: Json
  created_at: string
}

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      site_settings: Table<SiteSettingsRow>
      content_blocks: Table<ContentBlockRow>
      projects: Table<ProjectRow>
      project_images: Table<ProjectImageRow>
      services: Table<ServiceRow>
      frame_finishes: Table<FrameFinishRow>
      size_options: Table<SizeOptionRow>
      testimonials: Table<TestimonialRow>
      faqs: Table<FaqRow>
      enquiries: Table<EnquiryRow>
      enquiry_items: Table<EnquiryItemRow>
      enquiry_attachments: Table<EnquiryAttachmentRow>
      subscribers: Table<SubscriberRow>
      user_roles: Table<UserRoleRow>
      audit_log: Table<AuditLogRow>
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      is_staff: { Args: Record<string, never>; Returns: boolean }
      has_role: { Args: { _user_id: string; _role: AppRole }; Returns: boolean }
    }
    Enums: {
      primary_category: PrimaryCategory
      room: Room
      publish_status: PublishStatus
      image_role: ImageRole
      enquiry_status: EnquiryStatus
      app_role: AppRole
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
