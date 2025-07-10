
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from './kpiFormTypes';

interface KPIRevenueProps {
  register: UseFormRegister<FormData>;
}

export function KPIRevenue({ register }: KPIRevenueProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Doanh số</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>KH {'>'}100tr/tháng - (4m/KH)</Label>
          <Input
            type="number"
            {...register('clientsOver100M', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
