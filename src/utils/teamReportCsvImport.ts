type EmployeeLookup = {
  employee_code: string;
  full_name: string;
};

type TeamReportImportRow = {
  employee_code: string;
  employee_name: string;
  team: string;
  month: number;
  year: number;
  project_id: null;
  billable_hours: number;
  rate: number;
  fx_rate: number;
  percentage: number;
  package_vnd: number;
  has_salary: boolean;
  gross_salary: number;
  company_payment: number;
  salary_13: number;
  storage_usd: number;
  storage_usdt: number;
  earn_vnd: number;
  earn_usdt: number;
  converted_vnd: number;
  percentage_ratio: number;
  total_payment: number;
  notes: null;
};

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  return rows;
};

const parseMoney = (value?: string): number => {
  if (!value) return 0;
  const normalized = value.replace(/^\uFEFF/, '').replace(/VND/gi, '').replace(/[^\d.-]/g, '');
  return Number(normalized) || 0;
};

export const buildTeamReportRowsFromCsv = ({
  csvText,
  team,
  month,
  year,
  employees,
}: {
  csvText: string;
  team: string;
  month: number;
  year: number;
  employees: EmployeeLookup[];
}) => {
  const employeeByCode = new Map(
    employees.map((employee) => [employee.employee_code.trim(), employee.full_name])
  );
  const csvRows = parseCsv(csvText);
  const matchingRows = csvRows.filter((row) => row[3]?.trim() === team && row[1]?.trim());
  const missingEmployees: string[] = [];

  const rows: TeamReportImportRow[] = matchingRows.reduce<TeamReportImportRow[]>((result, row) => {
    const employeeCode = row[1].trim();
    const employeeName = employeeByCode.get(employeeCode);

    if (!employeeName) {
      missingEmployees.push(employeeCode);
      return result;
    }

    const grossSalary = parseMoney(row[8]) + parseMoney(row[9]);
    const companyPayment = parseMoney(row[44]);
    const overtime = parseMoney(row[10]) + parseMoney(row[11]) + parseMoney(row[12]);

    result.push({
      employee_code: employeeCode,
      employee_name: employeeName,
      team,
      month,
      year,
      project_id: null,
      billable_hours: 0,
      rate: 0,
      fx_rate: 0,
      percentage: 0,
      package_vnd: 0,
      has_salary: true,
      gross_salary: grossSalary,
      company_payment: companyPayment,
      salary_13: overtime,
      storage_usd: 0,
      storage_usdt: 0,
      earn_vnd: 0,
      earn_usdt: 0,
      converted_vnd: 0,
      percentage_ratio: 0,
      total_payment: companyPayment + overtime,
      notes: null,
    });

    return result;
  }, []);

  return {
    rows,
    matchedCount: matchingRows.length,
    missingEmployees: Array.from(new Set(missingEmployees)),
  };
};