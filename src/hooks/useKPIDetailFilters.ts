
import { useState, useEffect } from 'react';
import { KPIDetail, KPIDetailData } from '@/types/kpiDetail';
import { transformKPIDetailData } from './useKPIDetailData';

export const useKPIDetailFilters = (kpiDetails: KPIDetail[]) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [hasKPIGap, setHasKPIGap] = useState('all');
  const [filteredData, setFilteredData] = useState<KPIDetailData[]>([]);

  const handleSearch = () => {
    let filtered = [...kpiDetails];
    
    if (employeeCode) {
      filtered = filtered.filter(item => 
        item.employee_code.toLowerCase().includes(employeeCode.toLowerCase())
      );
    }
    
    if (hasKPIGap !== 'all') {
      const hasGap = hasKPIGap === 'yes';
      filtered = filtered.filter(item => item.has_kpi_gap === hasGap);
    }
    
    const transformedData = filtered.map(transformKPIDetailData);
    setFilteredData(transformedData);
  };

  useEffect(() => {
    handleSearch();
  }, [kpiDetails]);

  return {
    employeeCode,
    setEmployeeCode,
    employeeName,
    setEmployeeName,
    hasKPIGap,
    setHasKPIGap,
    filteredData,
    setFilteredData,
    handleSearch
  };
};
