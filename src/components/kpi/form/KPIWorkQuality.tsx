
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';
import { mergeRatioOptions } from './kpiFormOptions';
import { formatNumber } from '@/utils/numberFormat';

interface KPIWorkQualityProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
}

export function KPIWorkQuality({ register, setValue, watchedValues, calculatedValues }: KPIWorkQualityProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chất lượng công việc</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={formatNumber(calculatedValues.workQualityTotal, 6)}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Số bug được tạo ra sau khi deploy lên môi trường thực tế - (-0.0005*số bug)</Label>
          <Input
            type="number"
            {...register('prodBugs', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Số bug được tạo ra sau khi deploy lên môi trường KH thực nghiệm - (-0.00001*số bug)</Label>
          <Input
            type="number"
            {...register('testBugs', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Đạt tỷ lệ pull request được merge không cần chỉnh sửa ({'>'}30%) - (0.005)</Label>
          <Select
            value={watchedValues.mergeRatio}
            onValueChange={(value) => setValue('mergeRatio', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {mergeRatioOptions.map((option) => (
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
