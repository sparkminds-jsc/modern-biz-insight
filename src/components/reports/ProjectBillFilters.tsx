import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectBillFiltersProps {
  onFilter: (filters: {
    projectId?: string;
    months: number[];
    years: number[];
    team?: string;
    exchangeRate?: number;
  }) => void;
}

export function ProjectBillFilters({ onFilter }: ProjectBillFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [selectedProject, setSelectedProject] = useState<string>(() => {
    return searchParams.get('billProject') || 'all';
  });
  const [selectedMonths, setSelectedMonths] = useState<number[]>(() => {
    const monthsParam = searchParams.get('billMonths');
    return monthsParam ? monthsParam.split(',').map(Number) : [];
  });
  const [selectedYears, setSelectedYears] = useState<number[]>(() => {
    const yearsParam = searchParams.get('billYears');
    return yearsParam ? yearsParam.split(',').map(Number) : [];
  });
  const [selectedTeam, setSelectedTeam] = useState<string>(() => {
    return searchParams.get('billTeam') || 'all';
  });
  const [selectedExchangeRate, setSelectedExchangeRate] = useState<number>(() => {
    const rateParam = searchParams.get('billRate');
    return rateParam ? Number(rateParam) : 25000;
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const months = [
    { value: 1, label: 'Tháng 01' },
    { value: 2, label: 'Tháng 02' },
    { value: 3, label: 'Tháng 03' },
    { value: 4, label: 'Tháng 04' },
    { value: 5, label: 'Tháng 05' },
    { value: 6, label: 'Tháng 06' },
    { value: 7, label: 'Tháng 07' },
    { value: 8, label: 'Tháng 08' },
    { value: 9, label: 'Tháng 09' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  const years = Array.from({ length: 11 }, (_, i) => 2021 + i);
  const exchangeRates = [24000, 25000, 26000, 27000, 28000, 29000, 30000];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');
        
        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name')
          .order('name');
        
        if (teamsError) throw teamsError;
        setTeams(teamsData || []);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Auto-apply filters from URL params after data is loaded
  useEffect(() => {
    if (!isInitialized) return;
    
    const hasFilters = searchParams.get('billProject') || 
                       searchParams.get('billMonths') || 
                       searchParams.get('billYears') || 
                       searchParams.get('billTeam');
    
    if (hasFilters) {
      onFilter({
        projectId: selectedProject === 'all' ? undefined : selectedProject,
        months: selectedMonths,
        years: selectedYears,
        team: selectedTeam === 'all' ? undefined : selectedTeam,
        exchangeRate: selectedExchangeRate,
      });
    }
  }, [isInitialized]);

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleYearToggle = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleSearch = () => {
    // Store filters in URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'project-bills');
    
    if (selectedProject !== 'all') {
      newParams.set('billProject', selectedProject);
    } else {
      newParams.delete('billProject');
    }
    if (selectedMonths.length > 0) {
      newParams.set('billMonths', selectedMonths.join(','));
    } else {
      newParams.delete('billMonths');
    }
    if (selectedYears.length > 0) {
      newParams.set('billYears', selectedYears.join(','));
    } else {
      newParams.delete('billYears');
    }
    if (selectedTeam !== 'all') {
      newParams.set('billTeam', selectedTeam);
    } else {
      newParams.delete('billTeam');
    }
    newParams.set('billRate', selectedExchangeRate.toString());
    
    setSearchParams(newParams, { replace: true });
    
    onFilter({
      projectId: selectedProject === 'all' ? undefined : selectedProject,
      months: selectedMonths,
      years: selectedYears,
      team: selectedTeam === 'all' ? undefined : selectedTeam,
      exchangeRate: selectedExchangeRate,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Filter */}
          <div className="space-y-2">
            <Label>Dự án</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">Tất cả dự án</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Filter */}
          <div className="space-y-2">
            <Label>Team</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">Tất cả team</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.name}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exchange Rate Filter */}
          <div className="space-y-2">
            <Label>Tỷ giá</Label>
            <Select value={selectedExchangeRate.toString()} onValueChange={(value) => setSelectedExchangeRate(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {exchangeRates.map((rate) => (
                  <SelectItem key={rate} value={rate.toString()}>
                    {rate.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Month Filter */}
        <div className="space-y-2">
          <Label>Tháng</Label>
          <div className="grid grid-cols-6 gap-2">
            {months.map((month) => (
              <div key={month.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`month-${month.value}`}
                  checked={selectedMonths.includes(month.value)}
                  onCheckedChange={() => handleMonthToggle(month.value)}
                />
                <Label htmlFor={`month-${month.value}`} className="text-sm">
                  {month.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <Label>Năm</Label>
          <div className="grid grid-cols-6 gap-2">
            {years.map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleYearToggle(year)}
                />
                <Label htmlFor={`year-${year}`} className="text-sm">
                  {year}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}