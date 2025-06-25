
interface TeamReportDetailSummaryProps {
  reportDetails: any[];
}

export function TeamReportDetailSummary({ reportDetails }: TeamReportDetailSummaryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const rounded = Math.round(amount);
    if (currency === 'USDT') {
      return `${rounded.toLocaleString('vi-VN')} USDT`;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rounded);
  };

  // Calculate totals based on final values in the details
  const totalBill = reportDetails.reduce((sum, item) => sum + (item.converted_vnd || 0), 0);
  const totalPay = reportDetails.reduce((sum, item) => sum + (item.total_payment || 0), 0);
  const totalSave = reportDetails.reduce((sum, item) => sum + (item.converted_vnd || 0) + (item.package_vnd || 0) - (item.total_payment || 0), 0);
  const totalEarn = reportDetails.reduce((sum, item) => sum + (item.converted_vnd || 0) + (item.package_vnd || 0), 0);
  const totalUSD = reportDetails.reduce((sum, item) => sum + (item.storage_usd || 0), 0);
  const totalUSDT = reportDetails.reduce((sum, item) => sum + (item.storage_usdt || 0), 0);

  const summaryBoxes = [
    {
      title: 'Bill',
      value: formatCurrency(totalBill, 'VND'),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pay',
      value: formatCurrency(totalPay, 'VND'),
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Save',
      value: formatCurrency(totalSave, 'VND'),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Earn',
      value: formatCurrency(totalEarn, 'VND'),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'USD',
      value: formatCurrency(totalUSD, 'USD'),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'USDT',
      value: formatCurrency(totalUSDT, 'USDT'),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryBoxes.map((box, index) => (
        <div key={index} className={`${box.bgColor} rounded-lg p-4`}>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{box.title}</h3>
          <p className={`text-2xl font-bold ${box.textColor}`}>{box.value}</p>
        </div>
      ))}
    </div>
  );
}
