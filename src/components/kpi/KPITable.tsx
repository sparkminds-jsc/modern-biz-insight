
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Check, Trash2 } from 'lucide-react';

interface KPIData {
  id: string;
  year: number;
  month: number;
  total_employees_with_kpi_gap: number;
  status?: string;
}

interface KPITableProps {
  data: KPIData[];
  onViewDetail: (year: number, month: number) => void;
  onComplete: (id: string, year: number, month: number) => void;
  onDelete: (id: string, year: number, month: number) => void;
}

export function KPITable({ data, onViewDetail, onComplete, onDelete }: KPITableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">STT</TableHead>
            <TableHead>Năm</TableHead>
            <TableHead>Tháng</TableHead>
            <TableHead>Tổng số nhân viên lệch KPI</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-48">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              const isCompleted = item.status === 'Hoàn thành';
              return (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{item.month.toString().padStart(2, '0')}</TableCell>
                  <TableCell>{item.total_employees_with_kpi_gap}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status || 'Đang xử lý'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetail(item.year, item.month)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onComplete(item.id, item.year, item.month)}
                        disabled={isCompleted}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Hoàn thành
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(item.id, item.year, item.month)}
                        disabled={isCompleted}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
