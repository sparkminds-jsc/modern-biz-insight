
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
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
    <TooltipProvider>
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
            <div className="flex items-center gap-1">
              <Label>Hoàn thành task đúng deadline</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chú thích (0.25)</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
            <div className="flex items-center gap-1">
              <Label>Số lượng task bị trễ deadline</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chú thích (-0.01*số task)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              {...register('overdueTask', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label>Đạt chỉ tiêu task (10)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chú thích (0.2)</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
            <div className="flex items-center gap-1">
              <Label>LOC vượt chỉ tiêu (10000)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>(+1đ/LOC)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              {...register('locTarget', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label>LOT vượt chỉ tiêu (1000)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>(+1đ/LOT)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              {...register('lotTarget', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label>Tỷ lệ effort ({'>'}80%)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chú thích (0.1)</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
            <div className="flex items-center gap-1">
              <Label>Git activity (5)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chú thích (0.05)</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
    </TooltipProvider>
  );
}
