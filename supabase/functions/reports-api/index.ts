import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Basic realm="reports-api"',
    },
  })
}

function checkBasicAuth(req: Request): boolean {
  const expectedUser = Deno.env.get('REPORTS_API_USERNAME') ?? ''
  const expectedPass = Deno.env.get('REPORTS_API_PASSWORD') ?? ''
  const header = req.headers.get('Authorization') ?? ''
  if (!header.toLowerCase().startsWith('basic ')) return false
  let decoded = ''
  try {
    decoded = atob(header.slice(6).trim())
  } catch {
    return false
  }
  const idx = decoded.indexOf(':')
  if (idx < 0) return false
  const user = decoded.slice(0, idx)
  const pass = decoded.slice(idx + 1)
  return user === expectedUser && pass === expectedPass && expectedUser !== '' && expectedPass !== ''
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
  if (!checkBasicAuth(req)) return unauthorized()

  const url = new URL(req.url)
  const section = (url.searchParams.get('section') ?? 'all').toLowerCase()
  const monthParam = url.searchParams.get('month')
  const yearParam = url.searchParams.get('year')
  const team = url.searchParams.get('team')
  const fromDate = url.searchParams.get('from_date')
  const toDate = url.searchParams.get('to_date')
  const month = monthParam ? Number(monthParam) : null
  const year = yearParam ? Number(yearParam) : null

  if ((monthParam && Number.isNaN(month)) || (yearParam && Number.isNaN(year))) {
    return json({ error: 'month/year must be numbers' }, 400)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const result: Record<string, unknown> = {}

    if (section === 'all' || section === 'revenue-expense' || section === 'thu-chi') {
      let rq = supabase.from('revenue').select('*').order('created_date', { ascending: false })
      let eq = supabase.from('expenses').select('*').order('created_date', { ascending: false })
      if (fromDate) {
        rq = rq.gte('created_date', fromDate)
        eq = eq.gte('created_date', fromDate)
      }
      if (toDate) {
        rq = rq.lte('created_date', toDate)
        eq = eq.lte('created_date', toDate)
      }
      const [revenueRes, expenseRes] = await Promise.all([rq, eq])
      if (revenueRes.error) throw revenueRes.error
      if (expenseRes.error) throw expenseRes.error

      const revenues = revenueRes.data ?? []
      const expenses = expenseRes.data ?? []
      const totalRevenue = revenues.reduce((s: number, r: any) => s + (r.amount_vnd || 0), 0)
      const totalExpense = expenses.reduce((s: number, r: any) => s + (r.amount_vnd || 0), 0)

      result.revenues = revenues
      result.expenses = expenses
      result.summary = {
        total_revenue_vnd: totalRevenue,
        total_expense_vnd: totalExpense,
        balance_vnd: totalRevenue - totalExpense,
      }
    }

    if (section === 'all' || section === 'team') {
      let trq = supabase
        .from('team_reports')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
      if (month !== null) trq = trq.eq('month', month)
      if (year !== null) trq = trq.eq('year', year)
      if (team) trq = trq.eq('team', team)
      const { data: reports, error: reportsError } = await trq
      if (reportsError) throw reportsError

      const teamReports = await Promise.all(
        (reports ?? []).map(async (report: any) => {
          const [{ data: details }, { data: salaryDetails }] = await Promise.all([
            supabase
              .from('team_report_details')
              .select('*')
              .eq('team', report.team)
              .eq('month', report.month)
              .eq('year', report.year),
            supabase
              .from('salary_details')
              .select(
                'total_company_payment, daily_salary, kpi_bonus, insurance_base_amount, total_income, salary_type',
              )
              .eq('team', report.team)
              .eq('month', report.month)
              .eq('year', report.year),
          ])

          const total_internal_team_cost = (salaryDetails ?? []).reduce((sum: number, item: any) => {
            const isSeasonal = item.salary_type
              ? item.salary_type === 'Lương thời vụ'
              : !item.insurance_base_amount
            if (isSeasonal) return sum + (item.total_income || 0)
            return (
              sum +
              (item.total_company_payment || 0) +
              ((item.daily_salary || 0) + (item.kpi_bonus || 0)) / 12
            )
          }, 0)

          if (details && details.length > 0) {
            const final_bill = details.reduce(
              (s: number, i: any) => s + (i.converted_vnd || 0) + (i.package_vnd || 0),
              0,
            )
            const final_pay = details.reduce((s: number, i: any) => s + (i.total_payment || 0), 0)
            const final_save = final_bill * 0.3
            const final_earn = final_bill - final_pay - final_save
            const storage_usd = details.reduce((s: number, i: any) => s + (i.storage_usd || 0), 0)
            const storage_usdt = details.reduce((s: number, i: any) => s + (i.storage_usdt || 0), 0)
            return {
              ...report,
              final_bill,
              final_pay,
              final_save,
              final_earn,
              storage_usd,
              storage_usdt,
              total_internal_team_cost,
              details,
            }
          }

          return { ...report, total_internal_team_cost, details: details ?? [] }
        }),
      )

      result.team_reports = teamReports
    }

    return json({ section, filters: { month, year, team, from_date: fromDate, to_date: toDate }, data: result })
  } catch (error) {
    console.error('reports-api error', error)
    return json({ error: (error as Error).message ?? 'Internal error' }, 500)
  }
})