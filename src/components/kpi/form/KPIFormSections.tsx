
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Employee, FormData, CalculatedValues } from './kpiFormTypes';
import { KPIBasicInfo } from './KPIBasicInfo';
import { KPIWorkProductivity } from './KPIWorkProductivity';
import { KPIWorkQuality } from './KPIWorkQuality';
import { KPIAttitude } from './KPIAttitude';
import { KPIProgress } from './KPIProgress';
import { KPIRequirements } from './KPIRequirements';
import { KPIRecruitment } from './KPIRecruitment';
import { KPIRevenue } from './KPIRevenue';

interface KPIFormSectionsProps {
  employees: Employee[];
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
  isEditMode: boolean;
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function KPIFormSections({
  employees,
  register,
  setValue,
  watchedValues,
  calculatedValues,
  isEditMode,
  month,
  year,
  onMonthChange,
  onYearChange
}: KPIFormSectionsProps) {
  return (
    <>
      {/* Basic Information */}
      <KPIBasicInfo
        employees={employees}
        employeeCode={watchedValues.employee_code}
        onEmployeeCodeChange={(value) => setValue('employee_code', value)}
        calculatedValues={calculatedValues}
        isEditMode={isEditMode}
        month={month}
        year={year}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      {/* Work Productivity Section */}
      <KPIWorkProductivity
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
      />

      {/* Work Quality Section */}
      <KPIWorkQuality
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
      />

      {/* Attitude Section */}
      <KPIAttitude
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
      />

      {/* Progress Section */}
      <KPIProgress
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
      />

      {/* Requirements Section */}
      <KPIRequirements
        register={register}
        calculatedValues={calculatedValues}
      />

      {/* Recruitment Section */}
      <KPIRecruitment
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
      />

      {/* Revenue Section */}
      <KPIRevenue register={register} />
    </>
  );
}
