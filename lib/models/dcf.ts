import type { DcfAssumptions, DcfResult } from "@/lib/types";

export function calculateCostOfEquity(riskFreeRate: number, beta: number, equityRiskPremium: number) {
  return riskFreeRate + beta * equityRiskPremium;
}

export function calculateWacc(input: {
  marketValueEquity: number;
  debt: number;
  costOfEquity: number;
  costOfDebt: number;
  taxRate: number;
}) {
  const capital = input.marketValueEquity + input.debt;
  if (capital <= 0 || input.debt <= 0) return input.costOfEquity;
  const equityWeight = input.marketValueEquity / capital;
  const debtWeight = input.debt / capital;
  return equityWeight * input.costOfEquity + debtWeight * input.costOfDebt * (1 - input.taxRate);
}

export function projectFreeCashFlow(assumptions: DcfAssumptions) {
  let revenue = assumptions.startingRevenue;
  return assumptions.revenueGrowth.map((growth, index) => {
    revenue *= 1 + growth;
    const progress = assumptions.revenueGrowth.length === 1 ? 1 : index / (assumptions.revenueGrowth.length - 1);
    const fcfMargin =
      assumptions.startingFcfMargin + (assumptions.targetFcfMargin - assumptions.startingFcfMargin) * progress;
    return {
      year: index + 1,
      revenue,
      fcfMargin,
      freeCashFlow: revenue * fcfMargin
    };
  });
}

export function runDcf(assumptions: DcfAssumptions, currentSharePrice: number): DcfResult {
  const costOfEquity = calculateCostOfEquity(
    assumptions.riskFreeRate,
    assumptions.beta,
    assumptions.equityRiskPremium
  );
  const roughMarketValueEquity = Math.max(currentSharePrice * assumptions.dilutedShares, 1);
  const wacc = calculateWacc({
    marketValueEquity: roughMarketValueEquity,
    debt: assumptions.debt,
    costOfEquity,
    costOfDebt: assumptions.costOfDebt,
    taxRate: assumptions.taxRate
  });
  const projected = projectFreeCashFlow(assumptions);
  const rows = projected.map((row) => {
    const discountFactor = 1 / Math.pow(1 + wacc, row.year);
    return { ...row, discountFactor, presentValue: row.freeCashFlow * discountFactor };
  });
  const finalFcf = rows[rows.length - 1]?.freeCashFlow ?? 0;
  const terminalValue = (finalFcf * (1 + assumptions.terminalGrowth)) / Math.max(wacc - assumptions.terminalGrowth, 0.005);
  const presentValueTerminal = terminalValue / Math.pow(1 + wacc, rows.length);
  const enterpriseValue = rows.reduce((sum, row) => sum + row.presentValue, 0) + presentValueTerminal;
  const equityValue = enterpriseValue - assumptions.debt + assumptions.cash;
  const impliedSharePrice = equityValue / Math.max(assumptions.dilutedShares, 1);
  const upsideDownside = impliedSharePrice / currentSharePrice - 1;
  const marginOfSafety = Math.max(0, 1 - currentSharePrice / impliedSharePrice);
  return {
    wacc,
    costOfEquity,
    rows,
    terminalValue,
    presentValueTerminal,
    enterpriseValue,
    equityValue,
    impliedSharePrice,
    upsideDownside,
    marginOfSafety
  };
}

export function buildSensitivity(assumptions: DcfAssumptions, currentSharePrice: number) {
  const waccs = [-0.01, 0, 0.01].map((delta) => assumptions.riskFreeRate + assumptions.beta * assumptions.equityRiskPremium + delta);
  const terminalGrowths = [0.02, 0.03, 0.04];
  return waccs.flatMap((wacc) =>
    terminalGrowths.map((terminalGrowth) => {
      const adjusted = { ...assumptions, terminalGrowth };
      const result = runDcf(adjusted, currentSharePrice);
      return { wacc, terminalGrowth, price: result.impliedSharePrice };
    })
  );
}
