
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
}

export function SalaryDetailTable({ salaryDetails, onViewDetail, onEdit, onDelete }: SalaryDetailTableProps) {
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
              <TableHead>STT</TableHead>
              <TableHead>Mã NV</TableHead>
              <TableHead>Tên NV</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Loại lương</TableHead>
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
              <TableHead>Thuế 15%</TableHead>
              <TableHead>Thuế 20%</TableHead>
              <TableHead>Thuế 25%</TableHead>
              <TableHead>Thuế 30%</TableHead>
              <TableHead>Thuế 35%</TableHead>
              <TableHead>Tổng thuế TNCN</TableHead>
              <TableHead>Lương Net</TableHead>
              <TableHead>Tạm Ứng</TableHead>
              <TableHead>Thực nhận</TableHead>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
