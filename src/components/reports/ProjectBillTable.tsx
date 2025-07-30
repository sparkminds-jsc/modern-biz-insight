import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/numberFormat';

interface ProjectBillData {
  projectName: string;
  year: number;
  month: number;
  team: string;
  billVnd: number;
  billUsd: number;
  billUsdt: number;
}

interface ProjectBillTableProps {
  data: ProjectBillData[];
}

export function ProjectBillTable({ data }: ProjectBillTableProps) {
  const getMonthName = (month: number) => {
    const months = [
      'Tháng 01', 'Tháng 02', 'Tháng 03', 'Tháng 04',
      'Tháng 05', 'Tháng 06', 'Tháng 07', 'Tháng 08',
      'Tháng 09', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month - 1] || `Tháng ${month}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">STT</TableHead>
              <TableHead>Tên dự án</TableHead>
              <TableHead>Năm</TableHead>
              <TableHead>Tháng</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Bill VND</TableHead>
              <TableHead className="text-right">Bill USD</TableHead>
              <TableHead className="text-right">Bill USDT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={`${item.projectName}-${item.year}-${item.month}-${item.team}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{getMonthName(item.month)}</TableCell>
                  <TableCell>{item.team}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billVnd, 'VND')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billUsd, 'USD')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billUsdt, 'USDT')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}