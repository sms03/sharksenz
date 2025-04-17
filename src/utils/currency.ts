// Currency options
export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

// Exchange rates (simplified for demo, in real app would use an API)
export const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.2,
  CAD: 1.36,
  AUD: 1.51,
  INR: 83.5,
};

// Convert value to selected currency
export const convertCurrency = (value: number, currencyCode: string) => {
  return (value / exchangeRates[currencyCode as keyof typeof exchangeRates]).toFixed(2);
};

// Format currency with symbol
export const formatCurrency = (value: number, currency: { symbol: string, code: string }) => {
  return `${currency.symbol}${convertCurrency(value, currency.code)}`;
};
