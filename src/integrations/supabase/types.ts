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
      employee_events: {
        Row: {
          birthday_handled: boolean | null
          contract_handled: boolean | null
          created_at: string | null
          employee_id: string
          id: string
          month: number
          updated_at: string | null
          year: number
        }
        Insert: {
          birthday_handled?: boolean | null
          contract_handled?: boolean | null
          created_at?: string | null
          employee_id: string
          id?: string
          month: number
          updated_at?: string | null
          year: number
        }
        Update: {
          birthday_handled?: boolean | null
          contract_handled?: boolean | null
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
          remaining_amount?: number
          status?: string
          total_amount?: number
          updated_at?: string
          vnd_exchange_rate?: number | null
        }
        Relationships: []
      }
      kpi_details: {
        Row: {
          attitude: Json
          basic_salary: number
          created_at: string
          employee_code: string
          has_kpi_gap: boolean
          id: string
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
          total_employees_with_kpi_gap: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          total_employees_with_kpi_gap?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
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
          revenue_type?: string
          updated_at?: string
          wallet_type?: string
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
          month: number
          notes: string | null
          package_vnd: number
          percentage: number
          percentage_ratio: number | null
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
          month: number
          notes?: string | null
          package_vnd?: number
          percentage?: number
          percentage_ratio?: number | null
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
          month?: number
          notes?: string | null
          package_vnd?: number
          percentage?: number
          percentage_ratio?: number | null
          rate?: number
          salary_13?: number
          storage_usd?: number
          storage_usdt?: number
          team?: string
          total_payment?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: []
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
