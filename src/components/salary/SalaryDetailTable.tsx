
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalaryDetail } from "@/types/salary";
import { SalaryTableRow } from "./SalaryTableRow";

interface SalaryDetailTableProps {
  salaryDetails: SalaryDetail[];
  onViewDetail: (detail: SalaryDetail) => void;
  onEdit: (detail: SalaryDetail) => void;
  onDelete: (detail: SalaryDetail) => void;
  onToggleLock: (detail: SalaryDetail) => void;
}

export function SalaryDetailTable({ salaryDetails, onViewDetail, onEdit, onDelete, onToggleLock }: SalaryDetailTableProps) {
  if (!salaryDetails) {
    return <p>Không có dữ liệu lương.</p>;
  }

  if (salaryDetails.length === 0) {
    return <p>Không có dữ liệu lương.</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 bg-white w-[60px] min-w-[60px]">STT</TableHead>
              <TableHead className="sticky left-[60px] z-20 bg-white w-[100px] min-w-[100px]">Mã NV</TableHead>
              <TableHead className="sticky left-[160px] z-20 bg-white w-[180px] min-w-[180px]">Tên NV</TableHead>
              <TableHead className="sticky left-[340px] z-20 bg-white w-[100px] min-w-[100px]">Team</TableHead>
              <TableHead className="sticky left-[440px] z-20 bg-white w-[120px] min-w-[120px] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]">Loại lương</TableHead>
              <TableHead>Tháng</TableHead>
              <TableHead>Năm</TableHead>
              <TableHead>Lương Gross</TableHead>
              <TableHead>Ngày công</TableHead>
              <TableHead>Mức lương/Ngày</TableHead>
              <TableHead>Tiền lương theo ngày công</TableHead>
              <TableHead>Thưởng KPI</TableHead>
              <TableHead>Tăng ca 1.5</TableHead>
              <TableHead>Tăng ca 2</TableHead>
              <TableHead>Tăng ca 3</TableHead>
              <TableHead>Tổng thu nhập</TableHead>
              <TableHead>Mức đóng BH</TableHead>
              <TableHead>BHDN (BHXH-17%)</TableHead>
              <TableHead>BHDN (TNLĐ-0.5%)</TableHead>
              <TableHead>BHDN (BHYT-3%)</TableHead>
              <TableHead>BHDN (BHTN-1%)</TableHead>
              <TableHead>Tổng BHDN</TableHead>
              <TableHead>Tổng DN chi trả</TableHead>
              <TableHead>BHNLD (BHXH-8%)</TableHead>
              <TableHead>BHNLD (BHYT-1.5%)</TableHead>
              <TableHead>BHNLD (BHTN-1%)</TableHead>
              <TableHead>Tổng BHNLD</TableHead>
              <TableHead>Giảm trừ gia cảnh</TableHead>
              <TableHead>Số người phụ thuộc</TableHead>
              <TableHead>Giảm trừ người phụ thuộc</TableHead>
              <TableHead>Giảm trừ BH</TableHead>
              <TableHead>Tổng giảm trừ</TableHead>
              <TableHead>Thu nhập chịu thuế</TableHead>
              <TableHead>Thuế 5%</TableHead>
              <TableHead>Thuế 10%</TableHead>
              <TableHead>Thuế 20%</TableHead>
              <TableHead>Thuế 30%</TableHead>
              <TableHead>Thuế 35%</TableHead>
              <TableHead>Tổng thuế TNCN</TableHead>
              <TableHead>Lương Net</TableHead>
              <TableHead>Tạm Ứng</TableHead>
              <TableHead>Thực nhận</TableHead>
              <TableHead>Tổng chi phí nội bộ</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaryDetails.map((detail, index) => (
              <SalaryTableRow
                key={detail.id}
                detail={detail}
                index={index}
                onViewDetail={onViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleLock={onToggleLock}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
