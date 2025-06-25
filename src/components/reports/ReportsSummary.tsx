
interface ReportsSummaryProps {
  revenueData: any[];
  expenseData: any[];
}

export function ReportsSummary({ revenueData, expenseData }: ReportsSummaryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const rounded = Math.round(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rounded);
  };

  const formatUSDT = (amount: number) => {
    const rounded = Math.round(amount);
    return `${rounded.toLocaleString('vi-VN')} USDT`;
  };

  // Calculate revenue totals
  const bankRevenueVND = revenueData.filter(item => item.wallet_type === 'Ngân Hàng' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);
  
  const bankRevenueVNDDebt = revenueData.filter(item => item.wallet_type === 'Ngân Hàng' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  const bankRevenueUSD = revenueData.filter(item => item.wallet_type === 'Ngân Hàng' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usd, 0);
  
  const bankRevenueUSDDebt = revenueData.filter(item => item.wallet_type === 'Ngân Hàng' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const binanceRevenueUSDT = revenueData.filter(item => item.wallet_type === 'Binance' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usdt, 0);
  
  const binanceRevenueUSDTDebt = revenueData.filter(item => item.wallet_type === 'Binance' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usdt, 0);

  const upworkRevenueUSD = revenueData.filter(item => item.wallet_type === 'Upwork')
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const cashRevenueVND = revenueData.filter(item => item.wallet_type === 'Tiền Mặt' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);
  
  const cashRevenueVNDDebt = revenueData.filter(item => item.wallet_type === 'Tiền Mặt' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  // Calculate expense totals
  const bankExpenseVND = expenseData.filter(item => item.wallet_type === 'Ngân Hàng')
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  const bankExpenseUSD = expenseData.filter(item => item.wallet_type === 'Ngân Hàng')
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const binanceExpenseUSDT = expenseData.filter(item => item.wallet_type === 'Binance')
    .reduce((sum, item) => sum + item.amount_usdt, 0);

  const upworkExpenseUSD = expenseData.filter(item => item.wallet_type === 'Upwork')
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const cashExpenseVND = expenseData.filter(item => item.wallet_type === 'Tiền Mặt')
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  const summaryBoxes = [
    {
      title: 'Tổng tiền VND',
      value: formatCurrency(bankRevenueVND - bankExpenseVND, 'VND'),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Tổng tiền bị nợ VND',
      value: formatCurrency(bankRevenueVNDDebt, 'VND'),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền USD',
      value: formatCurrency(bankRevenueUSD - bankExpenseUSD, 'USD'),
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Tổng tiền bị nợ USD',
      value: formatCurrency(bankRevenueUSDDebt, 'USD'),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền USDT',
      value: formatUSDT(binanceRevenueUSDT - binanceExpenseUSDT),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Tổng tiền bị nợ USDT',
      value: formatUSDT(binanceRevenueUSDTDebt),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền Upwork',
      value: formatCurrency(upworkRevenueUSD - upworkExpenseUSD, 'USD'),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Tổng tiền mặt',
      value: formatCurrency(cashRevenueVND - cashExpenseVND, 'VND'),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Tổng tiền bị nợ tiền mặt',
      value: formatCurrency(cashRevenueVNDDebt, 'VND'),
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
