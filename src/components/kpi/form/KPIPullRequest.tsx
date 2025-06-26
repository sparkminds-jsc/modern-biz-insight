
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from './kpiFormTypes';

interface KPIPullRequestProps {
  register: UseFormRegister<FormData>;
}

export function KPIPullRequest({ register }: KPIPullRequestProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tỷ lệ pull request</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Merge không chỉnh sửa ({'>'}30%)</Label>
          <Input
            type="number"
            {...register('mergeRatio', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
