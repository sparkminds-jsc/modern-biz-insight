
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';
import { cvCountOptions, recruitmentCostOptions } from './kpiFormOptions';

interface KPIRecruitmentProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
}

export function KPIRecruitment({ register, setValue, watchedValues, calculatedValues }: KPIRecruitmentProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tuyển dụng</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.recruitmentTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>CV tuyển dụng - (0-0.2-0.5-1)</Label>
          <Select
            value={watchedValues.cvCount}
            onValueChange={(value) => setValue('cvCount', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {cvCountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ứng viên vượt qua (*) - (0-1m-2m-3m)</Label>
          <Input
            type="number"
            {...register('passedCandidates', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Chi phí/ứng viên - (0-0.5m-1m-1.5m-2m)</Label>
          <Select
            value={watchedValues.recruitmentCost}
            onValueChange={(value) => setValue('recruitmentCost', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {recruitmentCostOptions.map((option) => (
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
