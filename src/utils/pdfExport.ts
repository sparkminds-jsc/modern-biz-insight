import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface TeamReportData {
  id: string;
  team: string;
  year: number;
  month: number;
  final_bill: number;
  final_pay: number;
  final_save: number;
  final_earn: number;
  storage_usd: number;
  storage_usdt: number;
  notes?: string;
}

interface ExportTeamPDFParams {
  teamData: TeamReportData[];
  filters: {
    months: number[];
    years: number[];
    team?: string;
  };
}

export const exportTeamReportToPDF = ({ teamData, filters }: ExportTeamPDFParams) => {
  const doc = new jsPDF();
  
  // Set font to support Vietnamese characters
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(18);
  doc.text('BÁO CÁO TEAM', 14, 22);
  
  // Filter information
  doc.setFontSize(12);
  let yPosition = 35;
  
  // Time period
  const monthsText = filters.months.length > 0 
    ? filters.months.map(m => m.toString().padStart(2, '0')).join(', ')
    : 'Tất cả';
  const yearsText = filters.years.length > 0 
    ? filters.years.join(', ')
    : 'Tất cả';
  
  doc.text(`Thời gian: Tháng ${monthsText} - Năm ${yearsText}`, 14, yPosition);
  yPosition += 8;
  
  // Team
  const teamText = filters.team ? filters.team : 'Tất cả';
  doc.text(`Team: ${teamText}`, 14, yPosition);
  yPosition += 15;
  
  // Summary section
  doc.setFontSize(14);
  doc.text('TỔNG HỢP', 14, yPosition);
  yPosition += 10;
  
  // Calculate totals
  const totalBill = teamData.reduce((sum, item) => sum + item.final_bill, 0);
  const totalPay = teamData.reduce((sum, item) => sum + item.final_pay, 0);
  const totalSave = teamData.reduce((sum, item) => sum + item.final_save, 0);
  const totalEarn = teamData.reduce((sum, item) => sum + item.final_earn, 0);
  const totalUSD = teamData.reduce((sum, item) => sum + item.storage_usd, 0);
  const totalUSDT = teamData.reduce((sum, item) => sum + item.storage_usdt, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };
  
  const summaryData = [
    ['Chỉ số', 'Giá trị'],
    ['Final Bill', `${formatCurrency(totalBill)} VND`],
    ['Final Pay', `${formatCurrency(totalPay)} VND`],
    ['Final Save', `${formatCurrency(totalSave)} VND`],
    ['Final Earn', `${formatCurrency(totalEarn)} VND`],
    ['Storage USD', `${formatCurrency(totalUSD)} USD`],
    ['Storage USDT', `${formatCurrency(totalUSDT)} USDT`]
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] },
    margin: { left: 14 }
  });
  
  // Details section
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.text('CHI TIẾT', 14, yPosition);
  yPosition += 10;
  
  // Prepare table data
  const tableHeaders = [
    'STT', 'Team', 'Năm', 'Tháng', 'Final Bill', 'Final Pay', 
    'Final Save', 'Final Earn', 'USD', 'USDT', 'Ghi chú'
  ];
  
  const tableData = teamData.map((item, index) => [
    (index + 1).toString(),
    item.team,
    item.year.toString(),
    item.month.toString().padStart(2, '0'),
    formatCurrency(item.final_bill),
    formatCurrency(item.final_pay),
    formatCurrency(item.final_save),
    formatCurrency(item.final_earn),
    formatCurrency(item.storage_usd),
    formatCurrency(item.storage_usdt),
    item.notes || ''
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [tableHeaders],
    body: tableData,
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: { 
      fillColor: [66, 139, 202],
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 12 }, // STT
      1: { cellWidth: 20 }, // Team
      2: { cellWidth: 15 }, // Year
      3: { cellWidth: 15 }, // Month
      4: { cellWidth: 25 }, // Final Bill
      5: { cellWidth: 25 }, // Final Pay
      6: { cellWidth: 25 }, // Final Save
      7: { cellWidth: 25 }, // Final Earn
      8: { cellWidth: 20 }, // USD
      9: { cellWidth: 20 }, // USDT
      10: { cellWidth: 30 } // Notes
    },
    margin: { left: 14, right: 14 }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Trang ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `team-report-${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};