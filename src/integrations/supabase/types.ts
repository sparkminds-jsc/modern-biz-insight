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
      contracts: {
        Row: {
          auto_renewal: boolean | null
          contract_code: string
          contract_files: Json | null
          contract_name: string
          created_at: string
          customer_name: string
          expire_date: string
          id: string
          sign_date: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_renewal?: boolean | null
          contract_code: string
          contract_files?: Json | null
          contract_name: string
          created_at?: string
          customer_name: string
          expire_date: string
          id?: string
          sign_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_renewal?: boolean | null
          contract_code?: string
          contract_files?: Json | null
          contract_name?: string
          created_at?: string
          customer_name?: string
          expire_date?: string
          id?: string
          sign_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          birth_date: string | null
          contract_end_date: string | null
          contract_type: string
          created_at: string
          email: string
          employee_code: string
          full_name: string
          id: string
          position: string
          status: string
          team: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          contract_end_date?: string | null
          contract_type: string
          created_at?: string
          email: string
          employee_code: string
          full_name: string
          id?: string
          position: string
          status?: string
          team: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          contract_end_date?: string | null
          contract_type?: string
          created_at?: string
          email?: string
          employee_code?: string
          full_name?: string
          id?: string
          position?: string
          status?: string
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      salary_details: {
        Row: {
          actual_payment: number
          advance_payment: number
          bhdn_bhtn: number
          bhdn_bhxh: number
          bhdn_bhyt: number
          bhdn_tnld: number
          bhnld_bhtn: number
          bhnld_bhxh: number
          bhnld_bhyt: number
          created_at: string
          daily_rate: number
          daily_salary: number
          dependent_count: number
          dependent_deduction: number
          employee_code: string
          employee_name: string
          gross_salary: number
          id: string
          insurance_base_amount: number
          insurance_deduction: number
          kpi_bonus: number
          month: number
          net_salary: number
          overtime_1_5: number
          overtime_2: number
          overtime_3: number
          personal_deduction: number
          salary_sheet_id: string
          tax_10_percent: number
          tax_15_percent: number
          tax_20_percent: number
          tax_25_percent: number
          tax_30_percent: number
          tax_35_percent: number
          tax_5_percent: number
          taxable_income: number
          team: string
          total_bhdn: number
          total_bhnld: number
          total_company_payment: number
          total_deduction: number
          total_income: number
          total_personal_income_tax: number
          updated_at: string
          working_days: number
          year: number
        }
        Insert: {
          actual_payment?: number
          advance_payment?: number
          bhdn_bhtn?: number
          bhdn_bhxh?: number
          bhdn_bhyt?: number
          bhdn_tnld?: number
          bhnld_bhtn?: number
          bhnld_bhxh?: number
          bhnld_bhyt?: number
          created_at?: string
          daily_rate?: number
          daily_salary?: number
          dependent_count?: number
          dependent_deduction?: number
          employee_code: string
          employee_name: string
          gross_salary?: number
          id?: string
          insurance_base_amount?: number
          insurance_deduction?: number
          kpi_bonus?: number
          month: number
          net_salary?: number
          overtime_1_5?: number
          overtime_2?: number
          overtime_3?: number
          personal_deduction?: number
          salary_sheet_id: string
          tax_10_percent?: number
          tax_15_percent?: number
          tax_20_percent?: number
          tax_25_percent?: number
          tax_30_percent?: number
          tax_35_percent?: number
          tax_5_percent?: number
          taxable_income?: number
          team: string
          total_bhdn?: number
          total_bhnld?: number
          total_company_payment?: number
          total_deduction?: number
          total_income?: number
          total_personal_income_tax?: number
          updated_at?: string
          working_days?: number
          year: number
        }
        Update: {
          actual_payment?: number
          advance_payment?: number
          bhdn_bhtn?: number
          bhdn_bhxh?: number
          bhdn_bhyt?: number
          bhdn_tnld?: number
          bhnld_bhtn?: number
          bhnld_bhxh?: number
          bhnld_bhyt?: number
          created_at?: string
          daily_rate?: number
          daily_salary?: number
          dependent_count?: number
          dependent_deduction?: number
          employee_code?: string
          employee_name?: string
          gross_salary?: number
          id?: string
          insurance_base_amount?: number
          insurance_deduction?: number
          kpi_bonus?: number
          month?: number
          net_salary?: number
          overtime_1_5?: number
          overtime_2?: number
          overtime_3?: number
          personal_deduction?: number
          salary_sheet_id?: string
          tax_10_percent?: number
          tax_15_percent?: number
          tax_20_percent?: number
          tax_25_percent?: number
          tax_30_percent?: number
          tax_35_percent?: number
          tax_5_percent?: number
          taxable_income?: number
          team?: string
          total_bhdn?: number
          total_bhnld?: number
          total_company_payment?: number
          total_deduction?: number
          total_income?: number
          total_personal_income_tax?: number
          updated_at?: string
          working_days?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "salary_details_salary_sheet_id_fkey"
            columns: ["salary_sheet_id"]
            isOneToOne: false
            referencedRelation: "salary_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_sheets: {
        Row: {
          created_at: string
          id: string
          month: number
          status: string
          total_company_insurance: number
          total_net_salary: number
          total_payment: number
          total_personal_income_tax: number
          total_personal_insurance: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          status?: string
          total_company_insurance?: number
          total_net_salary?: number
          total_payment?: number
          total_personal_income_tax?: number
          total_personal_insurance?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          status?: string
          total_company_insurance?: number
          total_net_salary?: number
          total_payment?: number
          total_personal_income_tax?: number
          total_personal_insurance?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr" | "employee"
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
    Enums: {
      app_role: ["admin", "hr", "employee"],
    },
  },
} as const
