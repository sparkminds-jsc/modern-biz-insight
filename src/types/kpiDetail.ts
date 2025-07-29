
export interface KPIDetail {
  id: string;
  employee_code: string;
  has_kpi_gap: boolean;
  basic_salary: number;
  kpi: number;
  total_salary: number;
  salary_coefficient: number;
  kpi_coefficient: number;
  total_monthly_kpi: number;
  work_productivity: any;
  work_quality: any;
  attitude: any;
  progress: any;
  requirements: any;
  recruitment: any;
  revenue: any;
  is_locked?: boolean;
}

export interface KPIDetailData {
  id: string;
  employeeCode: string;
  hasKPIGap: boolean;
  basicSalary: number;
  kpi: number;
  totalSalary: number;
  salaryCoefficient: number;
  kpiCoefficient: number;
  totalMonthlyKPI: number;
  isLocked?: boolean;
  workProductivity: {
    total: number;
    completedOnTime: number;
    overdueTask: number;
    taskTarget: number;
    locTarget: number;
    lotTarget: number;
    effortRatio: number;
    gitActivity: number;
  };
  workQuality: {
    total: number;
    prodBugs: number;
    testBugs: number;
    mergeRatio: number;
  };
  attitude: {
    total: number;
    positiveAttitude: number;
    techSharing: number;
    techArticles: number;
    mentoring: number;
    teamManagement: number;
  };
  progress: {
    total: number;
    onTimeCompletion: number;
    storyPointAccuracy: number;
    planChanges: number;
  };
  requirements: {
    total: number;
    changeRequests: number;
    misunderstandingErrors: number;
  };
  recruitment: {
    total: number;
    cvCount: number;
    passedCandidates: number;
    recruitmentCost: number;
  };
  revenue: {
    clientsOver100M: number;
  };
}
