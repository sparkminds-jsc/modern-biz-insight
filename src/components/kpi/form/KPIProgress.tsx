
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';
import { onTimeCompletionOptions, storyPointAccuracyOptions } from './kpiFormOptions';

interface KPIProgressProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
}

export function KPIProgress({ register, setValue, watchedValues, calculatedValues }: KPIProgressProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tiến độ & kế hoạch</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.progressTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Hoàn thành đúng tiến độ</Label>
          <Select
            value={watchedValues.onTimeCompletion}
            onValueChange={(value) => setValue('onTimeCompletion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {onTimeCompletionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Story point đúng plan</Label>
          <Select
            value={watchedValues.storyPointAccuracy}
            onValueChange={(value) => setValue('storyPointAccuracy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {storyPointAccuracyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Thay đổi kế hoạch</Label>
          <Input
            type="number"
            {...register('planChanges', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
