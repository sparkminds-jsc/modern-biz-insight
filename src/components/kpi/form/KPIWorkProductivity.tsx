
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';
import { performanceOptions, taskTargetOptions, effortRatioOptions, gitActivityOptions } from './kpiFormOptions';
import { formatKPINumber } from '@/utils/numberFormat';

interface KPIWorkProductivityProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
}

export function KPIWorkProductivity({
  register,
  setValue,
  watchedValues,
  calculatedValues
}: KPIWorkProductivityProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Năng suất công việc</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={formatKPINumber(calculatedValues.workProductivityTotal)}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Hoàn thành task đúng deadline - (0.25)</Label>
          <Select
            value={watchedValues.completedOnTime}
            onValueChange={(value) => setValue('completedOnTime', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {performanceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Số lượng task bị trễ deadline - (-0.01*số task)</Label>
          <Input
            type="number"
            {...register('overdueTask', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Đạt chỉ tiêu task (10) - (0.2)</Label>
          <Select
            value={watchedValues.taskTarget}
            onValueChange={(value) => setValue('taskTarget', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {taskTargetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>LOC vượt chỉ tiêu (10000) - (+1đ/LOC)</Label>
          <Input
            type="number"
            {...register('locTarget', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>LOT vượt chỉ tiêu (1000) - (+1đ/LOT)</Label>
          <Input
            type="number"
            {...register('lotTarget', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Tỷ lệ effort ({'>'}80%) - (0.1)</Label>
          <Select
            value={watchedValues.effortRatio}
            onValueChange={(value) => setValue('effortRatio', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {effortRatioOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Git activity (5) - (0.05)</Label>
          <Select
            value={watchedValues.gitActivity}
            onValueChange={(value) => setValue('gitActivity', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {gitActivityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
