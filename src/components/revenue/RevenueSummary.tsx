
interface RevenueSummaryProps {
  data: any[];
}

export function RevenueSummary({ data }: RevenueSummaryProps) {
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

  // Calculate totals based on wallet type and debt collection status
  const bankVND = data.filter(item => item.wallet_type === 'Ngân Hàng' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);
  
  const bankVNDDebt = data.filter(item => item.wallet_type === 'Ngân Hàng' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  const bankUSD = data.filter(item => item.wallet_type === 'Ngân Hàng' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usd, 0);
  
  const bankUSDDebt = data.filter(item => item.wallet_type === 'Ngân Hàng' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const binanceUSDT = data.filter(item => item.wallet_type === 'Binance' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usdt, 0);
  
  const binanceUSDTDebt = data.filter(item => item.wallet_type === 'Binance' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usdt, 0);

  const upworkUSD = data.filter(item => item.wallet_type === 'Upwork' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_usd, 0);

  const cashVND = data.filter(item => item.wallet_type === 'Tiền Mặt' && !item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);
  
  const cashVNDDebt = data.filter(item => item.wallet_type === 'Tiền Mặt' && item.needs_debt_collection)
    .reduce((sum, item) => sum + item.amount_vnd, 0);

  const summaryBoxes = [
    {
      title: 'Tổng tiền VND',
      value: formatCurrency(bankVND, 'VND'),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Tổng tiền bị nợ VND',
      value: formatCurrency(bankVNDDebt, 'VND'),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền USD',
      value: formatCurrency(bankUSD, 'USD'),
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Tổng tiền bị nợ USD',
      value: formatCurrency(bankUSDDebt, 'USD'),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền USDT',
      value: formatUSDT(binanceUSDT),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Tổng tiền bị nợ USDT',
      value: formatUSDT(binanceUSDTDebt),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Tổng tiền Upwork',
      value: formatCurrency(upworkUSD, 'USD'),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Tổng tiền mặt',
      value: formatCurrency(cashVND, 'VND'),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Tổng tiền bị nợ tiền mặt',
      value: formatCurrency(cashVNDDebt, 'VND'),
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
