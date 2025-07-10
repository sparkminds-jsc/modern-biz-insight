
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';

interface KPIRequirementsProps {
  register: UseFormRegister<FormData>;
  calculatedValues: CalculatedValues;
}

export function KPIRequirements({ register, calculatedValues }: KPIRequirementsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quản lý yêu cầu & chất lượng đầu ra</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.requirementsTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Yêu cầu thay đổi - (-0.001*số lần)</Label>
          <Input
            type="number"
            {...register('changeRequests', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Lỗi hiểu sai yêu cầu - (-0.001*số lỗi)</Label>
          <Input
            type="number"
            {...register('misunderstandingErrors', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
