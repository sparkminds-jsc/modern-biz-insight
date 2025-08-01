
export const formatNumber = (value: number | string, maxDecimals: number = 6): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  // Remove trailing zeros and limit to maxDecimals
  const formatted = num.toFixed(maxDecimals);
  return formatted.replace(/\.?0+$/, '');
};

export const formatKPINumber = (value: number | string): string => {
  return formatNumber(value, 6);
};

export const formatCurrency = (value: number, currency: string = 'VND'): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  const formatted = new Intl.NumberFormat('vi-VN').format(num);
  return `${formatted} ${currency}`;
};
