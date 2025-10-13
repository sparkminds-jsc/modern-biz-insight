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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      allocates: {
        Row: {
          call_kh: boolean
          created_at: string
          employee_code: string
          id: string
          position: string
          project_allocations: Json
          role: string
          updated_at: string
        }
        Insert: {
          call_kh?: boolean
          created_at?: string
          employee_code: string
          id?: string
          position?: string
          project_allocations?: Json
          role?: string
          updated_at?: string
        }
        Update: {
          call_kh?: boolean
          created_at?: string
          employee_code?: string
          id?: string
          position?: string
          project_allocations?: Json
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      employee_events: {
        Row: {
          birthday_gift_date: string | null
          birthday_handled: boolean | null
          contract_handled: boolean | null
          contract_signed_date: string | null
          created_at: string | null
          employee_id: string
          id: string
          month: number
          updated_at: string | null
          year: number
        }
        Insert: {
          birthday_gift_date?: string | null
          birthday_handled?: boolean | null
          contract_handled?: boolean | null
          contract_signed_date?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          month: number
          updated_at?: string | null
          year: number
        }
        Update: {
          birthday_gift_date?: string | null
          birthday_handled?: boolean | null
          contract_handled?: boolean | null
          contract_signed_date?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          month?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
      expense_types: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_usd: number
          amount_usdt: number
          amount_vnd: number
          content: string
          created_at: string
          created_date: string
          expense_type: string
          id: string
          invoice_files: Json | null
          is_finalized: boolean
          notes: string | null
          updated_at: string
          wallet_type: string
        }
        Insert: {
          amount_usd?: number
          amount_usdt?: number
          amount_vnd?: number
          content: string
          created_at?: string
          created_date?: string
          expense_type: string
          id?: string
          invoice_files?: Json | null
          is_finalized?: boolean
          notes?: string | null
          updated_at?: string
          wallet_type: string
        }
        Update: {
          amount_usd?: number
          amount_usdt?: number
          amount_vnd?: number
          content?: string
          created_at?: string
          created_date?: string
          expense_type?: string
          id?: string
          invoice_files?: Json | null
          is_finalized?: boolean
          notes?: string | null
          updated_at?: string
          wallet_type?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          note: string | null
          qty: number
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          note?: string | null
          qty?: number
          unit: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          note?: string | null
          qty?: number
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          additional_info: string | null
          created_at: string
          created_date: string
          customer_address: string | null
          customer_name: string
          due_date: string
          id: string
          invoice_name: string
          is_crypto: boolean
          payment_status: string
          payment_unit: string
          project_id: string | null
          remaining_amount: number
          status: string
          total_amount: number
          updated_at: string
          vnd_exchange_rate: number | null
        }
        Insert: {
          additional_info?: string | null
          created_at?: string
          created_date?: string
          customer_address?: string | null
          customer_name: string
          due_date: string
          id?: string
          invoice_name: string
          is_crypto?: boolean
          payment_status?: string
          payment_unit?: string
          project_id?: string | null
          remaining_amount?: number
          status?: string
          total_amount?: number
          updated_at?: string
          vnd_exchange_rate?: number | null
        }
        Update: {
          additional_info?: string | null
          created_at?: string
          created_date?: string
          customer_address?: string | null
          customer_name?: string
          due_date?: string
          id?: string
          invoice_name?: string
          is_crypto?: boolean
          payment_status?: string
          payment_unit?: string
          project_id?: string | null
          remaining_amount?: number
          status?: string
          total_amount?: number
          updated_at?: string
          vnd_exchange_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_details: {
        Row: {
          attitude: Json
          basic_salary: number
          created_at: string
          employee_code: string
          has_kpi_gap: boolean
          id: string
          is_locked: boolean | null
          kpi: number
          kpi_coefficient: number
          month: number
          progress: Json
          recruitment: Json
          requirements: Json
          revenue: Json
          salary_coefficient: number
          total_monthly_kpi: number
          total_salary: number
          updated_at: string
          work_productivity: Json
          work_quality: Json
          year: number
        }
        Insert: {
          attitude?: Json
          basic_salary?: number
          created_at?: string
          employee_code: string
          has_kpi_gap?: boolean
          id?: string
          is_locked?: boolean | null
          kpi?: number
          kpi_coefficient?: number
          month: number
          progress?: Json
          recruitment?: Json
          requirements?: Json
          revenue?: Json
          salary_coefficient?: number
          total_monthly_kpi?: number
          total_salary?: number
          updated_at?: string
          work_productivity?: Json
          work_quality?: Json
          year: number
        }
        Update: {
          attitude?: Json
          basic_salary?: number
          created_at?: string
          employee_code?: string
          has_kpi_gap?: boolean
          id?: string
          is_locked?: boolean | null
          kpi?: number
          kpi_coefficient?: number
          month?: number
          progress?: Json
          recruitment?: Json
          requirements?: Json
          revenue?: Json
          salary_coefficient?: number
          total_monthly_kpi?: number
          total_salary?: number
          updated_at?: string
          work_productivity?: Json
          work_quality?: Json
          year?: number
        }
        Relationships: []
      }
      kpi_records: {
        Row: {
          created_at: string
          id: string
          month: number
          status: string
          total_employees_with_kpi_gap: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          status?: string
          total_employees_with_kpi_gap?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          status?: string
          total_employees_with_kpi_gap?: number
          updated_at?: string
          year?: number
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
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      revenue: {
        Row: {
          amount_usd: number
          amount_usdt: number
          amount_vnd: number
          content: string
          created_at: string
          created_date: string
          id: string
          is_finalized: boolean
          needs_debt_collection: boolean
          project_id: string | null
          revenue_type: string
          updated_at: string
          wallet_type: string
        }
        Insert: {
          amount_usd?: number
          amount_usdt?: number
          amount_vnd?: number
          content: string
          created_at?: string
          created_date?: string
          id?: string
          is_finalized?: boolean
          needs_debt_collection?: boolean
          project_id?: string | null
          revenue_type: string
          updated_at?: string
          wallet_type: string
        }
        Update: {
          amount_usd?: number
          amount_usdt?: number
          amount_vnd?: number
          content?: string
          created_at?: string
          created_date?: string
          id?: string
          is_finalized?: boolean
          needs_debt_collection?: boolean
          project_id?: string | null
          revenue_type?: string
          updated_at?: string
          wallet_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
          is_locked: boolean | null
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
          is_locked?: boolean | null
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
          is_locked?: boolean | null
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
          email_sent: boolean
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
          email_sent?: boolean
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
          email_sent?: boolean
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
      team_report_details: {
        Row: {
          billable_hours: number
          company_payment: number
          converted_vnd: number | null
          created_at: string
          employee_code: string
          employee_name: string
          fx_rate: number
          has_salary: boolean
          id: string
          is_locked: boolean | null
          month: number
          notes: string | null
          package_vnd: number
          percentage: number
          percentage_ratio: number | null
          project_id: string | null
          rate: number
          salary_13: number
          storage_usd: number
          storage_usdt: number
          team: string
          total_payment: number | null
          updated_at: string
          year: number
        }
        Insert: {
          billable_hours?: number
          company_payment?: number
          converted_vnd?: number | null
          created_at?: string
          employee_code: string
          employee_name: string
          fx_rate?: number
          has_salary?: boolean
          id?: string
          is_locked?: boolean | null
          month: number
          notes?: string | null
          package_vnd?: number
          percentage?: number
          percentage_ratio?: number | null
          project_id?: string | null
          rate?: number
          salary_13?: number
          storage_usd?: number
          storage_usdt?: number
          team: string
          total_payment?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          billable_hours?: number
          company_payment?: number
          converted_vnd?: number | null
          created_at?: string
          employee_code?: string
          employee_name?: string
          fx_rate?: number
          has_salary?: boolean
          id?: string
          is_locked?: boolean | null
          month?: number
          notes?: string | null
          package_vnd?: number
          percentage?: number
          percentage_ratio?: number | null
          project_id?: string | null
          rate?: number
          salary_13?: number
          storage_usd?: number
          storage_usdt?: number
          team?: string
          total_payment?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_report_details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_reports: {
        Row: {
          created_at: string
          final_bill: number
          final_earn: number
          final_pay: number
          final_save: number
          id: string
          month: number
          notes: string | null
          storage_usd: number
          storage_usdt: number
          team: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          final_bill?: number
          final_earn?: number
          final_pay?: number
          final_save?: number
          id?: string
          month: number
          notes?: string | null
          storage_usd?: number
          storage_usdt?: number
          team: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          final_bill?: number
          final_earn?: number
          final_pay?: number
          final_save?: number
          id?: string
          month?: number
          notes?: string | null
          storage_usd?: number
          storage_usdt?: number
          team?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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
      app_role: ["admin", "hr", "employee"],
    },
  },
} as const
