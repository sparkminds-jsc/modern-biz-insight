import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const parseVN = (s: string): number => {
  if (!s) return 0;
  const cleaned = s.replace(/[.\s]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const formatVN = (n: number): string => {
  if (!n && n !== 0) return '';
  return new Intl.NumberFormat('vi-VN').format(n);
};

const SETTING_KEYS = ['personal_deduction', 'dependent_deduction'] as const;

const SettingsPage = () => {
  const [personal, setPersonal] = useState('15.500.000');
  const [dependent, setDependent] = useState('6.200.000');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', SETTING_KEYS as unknown as string[]);
      if (error) {
        toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
      } else if (data) {
        const map = new Map(data.map((r: any) => [r.key, Number(r.value)]));
        if (map.has('personal_deduction')) setPersonal(formatVN(map.get('personal_deduction')!));
        if (map.has('dependent_deduction')) setDependent(formatVN(map.get('dependent_deduction')!));
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const rows = [
      { key: 'personal_deduction', value: parseVN(personal) },
      { key: 'dependent_deduction', value: parseVN(dependent) },
    ];
    const { error } = await supabase
      .from('app_settings')
      .upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (error) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Thành công', description: 'Đã lưu cài đặt' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-600">Cấu hình các tham số tính lương</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tham số thuế TNCN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="personal">Mức giảm trừ gia cảnh</Label>
              <Input
                id="personal"
                inputMode="decimal"
                value={personal}
                disabled={loading}
                onChange={(e) => setPersonal(formatVN(parseVN(e.target.value)))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dependent">Mức giảm trừ người phụ thuộc</Label>
              <Input
                id="dependent"
                inputMode="decimal"
                value={dependent}
                disabled={loading}
                onChange={(e) => setDependent(formatVN(parseVN(e.target.value)))}
              />
            </div>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;