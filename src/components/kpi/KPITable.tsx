
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';

interface KPIData {
  id: string;
  year: number;
  month: number;
  total_employees_with_kpi_gap: number;
}

interface KPITableProps {
  data: KPIData[];
  onViewDetail: (year: number, month: number) => void;
}

export function KPITable({ data, onViewDetail }: KPITableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">STT</TableHead>
            <TableHead>Năm</TableHead>
            <TableHead>Tháng</TableHead>
            <TableHead>Tổng số nhân viên lệch KPI</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.month.toString().padStart(2, '0')}</TableCell>
                <TableCell>{item.total_employees_with_kpi_gap}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(item.year, item.month)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
