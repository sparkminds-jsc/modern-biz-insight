
export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
}

export interface SalaryData {
  gross_salary: number;
  kpi_bonus: number;
  overtime_1_5: number;
  overtime_2: number;
  overtime_3: number;
}

export interface FormData {
  employee_code: string;
  // Work productivity fields
  completedOnTime: string;
  overdueTask: number;
  taskTarget: string;
  locTarget: number;
  lotTarget: number;
  effortRatio: string;
  gitActivity: string;
  // Work quality fields
  prodBugs: number;
  testBugs: number;
  // Pull request fields
  mergeRatio: number;
  // Attitude fields
  positiveAttitude: number;
  techContribution: number;
  techSharing: number;
  techArticles: number;
  mentoring: number;
  teamManagement: number;
  // Progress fields
  onTimeCompletion: number;
  storyPointAccuracy: number;
  planChanges: number;
  // Requirements fields
  changeRequests: number;
  misunderstandingErrors: number;
  // Recruitment fields
  cvCount: number;
  passedCandidates: number;
  recruitmentCost: number;
  // Revenue fields
  clientsOver100M: number;
}

export interface CalculatedValues {
  basicSalary: number;
  kpi: number;
  totalSalary: number;
  salaryCoefficient: number;
  kpiCoefficient: number;
  totalMonthlyKPI: number;
  hasKPIGap: boolean;
  workProductivityTotal: number;
  workQualityTotal: number;
  pullRequestMergeRatio: number;
  attitudeTotal: number;
  progressTotal: number;
  requirementsTotal: number;
  recruitmentTotal: number;
}
