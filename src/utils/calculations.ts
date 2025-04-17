
// Simple calculations for business metrics
export const calculateMetrics = (
  revenue: string, 
  expenses: string, 
  customers: string, 
  cac: string,
  growth: string
) => {
  const revNum = parseFloat(revenue) || 0;
  const expNum = parseFloat(expenses) || 0;
  const custNum = parseFloat(customers) || 0;
  const cacNum = parseFloat(cac) || 0;
  const growthNum = parseFloat(growth) || 0;

  const monthlyBurnRate = expNum;
  const runway = monthlyBurnRate ? Math.round(revNum / monthlyBurnRate) : 0;
  const ltv = custNum ? revNum / custNum : 0;
  const ltvCacRatio = cacNum ? ltv / cacNum : 0;
  const valuation = revNum ? (revNum * (growthNum ? growthNum : 1)) * 5 : 0;

  return {
    monthlyBurnRate,
    runway,
    ltv,
    ltvCacRatio,
    valuation
  };
};
