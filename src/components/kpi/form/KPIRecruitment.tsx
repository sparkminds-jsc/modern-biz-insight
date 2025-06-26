
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData, CalculatedValues } from './kpiFormTypes';

interface KPIRecruitmentProps {
  register: UseFormRegister<FormData>;
  calculatedValues: CalculatedValues;
}

export function KPIRecruitment({ register, calculatedValues }: KPIRecruitmentProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tuyển dụng</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tổng</Label>
          <Input
            value={calculatedValues.recruitmentTotal}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label>Số lượng CV</Label>
          <Input
            type="number"
            {...register('cvCount', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Ứng viên vượt qua phỏng vấn</Label>
          <Input
            type="number"
            {...register('passedCandidates', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Chi phí tuyển dụng</Label>
          <Input
            type="number"
            {...register('recruitmentCost', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
