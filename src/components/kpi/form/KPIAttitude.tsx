
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';
import { positiveAttitudeOptions, teamManagementOptions } from './kpiFormOptions';
import { formatKPINumber } from '@/utils/numberFormat';

interface KPIAttitudeProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedValues: FormData;
  calculatedValues: CalculatedValues;
}

export function KPIAttitude({ register, setValue, watchedValues, calculatedValues }: KPIAttitudeProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thái độ và đóng góp</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={formatKPINumber(calculatedValues.attitudeTotal)}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Thái độ tích cực - (0.0005)</Label>
          <Select
            value={watchedValues.positiveAttitude}
            onValueChange={(value) => setValue('positiveAttitude', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {positiveAttitudeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tech sharing - (+0.001*số lần)</Label>
          <Input
            type="number"
            {...register('techSharing', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Bài viết kỹ thuật - (+0.001*số bài)</Label>
          <Input
            type="number"
            {...register('techArticles', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Số nhân sự (fresher/thực tập sinh) phụ trách đào tạo - (100,000đ/bạn)</Label>
          <Input
            type="number"
            {...register('mentoring', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Tham gia quản lý team và đảm bảo công việc hiệu quả của team member - (+2,000,000đ)</Label>
          <Select
            value={watchedValues.teamManagement}
            onValueChange={(value) => setValue('teamManagement', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {teamManagementOptions.map((option) => (
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
