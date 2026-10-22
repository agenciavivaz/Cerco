
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "audit_logs": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"diff": Json | null,"entity_id": string | null,"entity_type": string,"id": string,"ip": string | null,"workspace_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"diff"?: Json | null,"entity_id"?: string | null,"entity_type": string,"id"?: string,"ip"?: string | null,"workspace_id"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"diff"?: Json | null,"entity_id"?: string | null,"entity_type"?: string,"id"?: string,"ip"?: string | null,"workspace_id"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"clients": {
                  Row: {
                    "billing_day": number | null,"billing_notes": string | null,"cnpj": string | null,"contract_value_brl": number | null,"created_at": string,"id": string,"legal_name": string | null,"main_contact_email": string | null,"main_contact_name": string | null,"name": string,"notes": string | null,"plan": string | null,"started_at": string | null,"status": Database["public"]['Enums']["client_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "billing_day"?: number | null,"billing_notes"?: string | null,"cnpj"?: string | null,"contract_value_brl"?: number | null,"created_at"?: string,"id"?: string,"legal_name"?: string | null,"main_contact_email"?: string | null,"main_contact_name"?: string | null,"name": string,"notes"?: string | null,"plan"?: string | null,"started_at"?: string | null,"status"?: Database["public"]['Enums']["client_status"],"updated_at"?: string
                  }
                  Update: {
                    "billing_day"?: number | null,"billing_notes"?: string | null,"cnpj"?: string | null,"contract_value_brl"?: number | null,"created_at"?: string,"id"?: string,"legal_name"?: string | null,"main_contact_email"?: string | null,"main_contact_name"?: string | null,"name"?: string,"notes"?: string | null,"plan"?: string | null,"started_at"?: string | null,"status"?: Database["public"]['Enums']["client_status"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"platform_settings": {
                  Row: {
                    "created_at": string,"key": string,"updated_at": string,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"key": string,"updated_at"?: string,"value"?: NonNullable<Json>
                  }
                  Update: {
                    "created_at"?: string,"key"?: string,"updated_at"?: string,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string,"full_name": string | null,"id": string,"is_platform_admin": boolean,"last_seen_at": string | null,"phone": string | null,"status": Database["public"]['Enums']["profile_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email": string,"full_name"?: string | null,"id": string,"is_platform_admin"?: boolean,"last_seen_at"?: string | null,"phone"?: string | null,"status"?: Database["public"]['Enums']["profile_status"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"full_name"?: string | null,"id"?: string,"is_platform_admin"?: boolean,"last_seen_at"?: string | null,"phone"?: string | null,"status"?: Database["public"]['Enums']["profile_status"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"workspace_members": {
                  Row: {
                    "created_at": string,"role": Database["public"]['Enums']["member_role"],"updated_at": string,"user_id": string,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"role": Database["public"]['Enums']["member_role"],"updated_at"?: string,"user_id": string,"workspace_id": string
                  }
                  Update: {
                    "created_at"?: string,"role"?: Database["public"]['Enums']["member_role"],"updated_at"?: string,"user_id"?: string,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workspace_members_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "workspace_members_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"workspaces": {
                  Row: {
                    "ai_monthly_budget_usd": number,"client_id": string,"created_at": string,"feature_flags": NonNullable<Json>,"id": string,"name": string,"settings": NonNullable<Json>,"slug": string,"status": Database["public"]['Enums']["workspace_status"],"timezone": string,"tracking_public_key": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "ai_monthly_budget_usd"?: number,"client_id": string,"created_at"?: string,"feature_flags"?: NonNullable<Json>,"id"?: string,"name": string,"settings"?: NonNullable<Json>,"slug": string,"status"?: Database["public"]['Enums']["workspace_status"],"timezone"?: string,"tracking_public_key"?: string,"updated_at"?: string
                  }
                  Update: {
                    "ai_monthly_budget_usd"?: number,"client_id"?: string,"created_at"?: string,"feature_flags"?: NonNullable<Json>,"id"?: string,"name"?: string,"settings"?: NonNullable<Json>,"slug"?: string,"status"?: Database["public"]['Enums']["workspace_status"],"timezone"?: string,"tracking_public_key"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workspaces_client_id_fkey"
      columns: ["client_id"]
isOneToOne: false
      referencedRelation: "clients"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "has_role":
{ Args: { "roles": (string)[],"ws": string }; Returns: boolean
                           },
"is_member":
{ Args: { "ws": string }; Returns: boolean
                           },
"is_platform_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"member_role":
{ Args: { "ws": string }; Returns: Database["public"]['Enums']["member_role"]
                           },
"shares_workspace_with":
{ Args: { "other": string }; Returns: boolean
                           }
          }
          Enums: {
            "client_status": "design_partner"|"active"|"paused"|"churned","member_role": "manager"|"bdr"|"viewer","profile_status": "active"|"disabled","workspace_status": "active"|"paused"|"archived"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "client_status": ["design_partner", "active", "paused", "churned"],"member_role": ["manager", "bdr", "viewer"],"profile_status": ["active", "disabled"],"workspace_status": ["active", "paused", "archived"]
          }
        }
} as const
