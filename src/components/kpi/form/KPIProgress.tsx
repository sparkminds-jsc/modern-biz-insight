
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';

interface KPIProgressProps {
  register: UseFormRegister<FormData>;
  calculatedValues: CalculatedValues;
}

export function KPIProgress({ register, calculatedValues }: KPIProgressProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tiến độ & kế hoạch</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Input
            type="number"
            {...register('onTimeCompletion', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Story point đúng kế hoạch</Label>
          <Input
            type="number"
            {...register('storyPointAccuracy', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Số lần thay đổi kế hoạch</Label>
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
