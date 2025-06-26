
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';

interface KPIWorkQualityProps {
  register: UseFormRegister<FormData>;
  calculatedValues: CalculatedValues;
}

export function KPIWorkQuality({ register, calculatedValues }: KPIWorkQualityProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chất lượng công việc</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.workQualityTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Bug môi trường thực tế</Label>
          <Input
            type="number"
            {...register('prodBugs', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Bug môi trường test</Label>
          <Input
            type="number"
            {...register('testBugs', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
