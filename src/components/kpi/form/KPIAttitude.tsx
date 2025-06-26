
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';

interface KPIAttitudeProps {
  register: UseFormRegister<FormData>;
  calculatedValues: CalculatedValues;
}

export function KPIAttitude({ register, calculatedValues }: KPIAttitudeProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thái độ và đóng góp</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.attitudeTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Thái độ tích cực</Label>
          <Input
            type="number"
            {...register('positiveAttitude', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Đóng góp kỹ thuật</Label>
          <Input
            type="number"
            {...register('techContribution', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Chia sẻ kiến thức</Label>
          <Input
            type="number"
            {...register('techSharing', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Bài viết kỹ thuật</Label>
          <Input
            type="number"
            {...register('techArticles', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Đào tạo nhân sự</Label>
          <Input
            type="number"
            {...register('mentoring', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Quản lý team</Label>
          <Input
            type="number"
            {...register('teamManagement', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
