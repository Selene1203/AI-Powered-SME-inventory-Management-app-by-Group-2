export const formatCurrency = (amount: number): string => {
  return `M${amount.toFixed(2)}`;
};

export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1000000) {
    return `M${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `M${(amount / 1000).toFixed(1)}k`;
  }
  return `M${amount.toFixed(0)}`;
};