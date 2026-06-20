import type { PricePoint } from "@/lib/types";

export function dailyReturns(prices: PricePoint[]) {
  return prices.slice(1).map((point, index) => ({
    date: point.date,
    return: point.close / prices[index].close - 1
  }));
}

export function cumulativeValue(returns: Array<{ date: string; return: number }>, startingValue = 10000) {
  let value = startingValue;
  return returns.map((row) => {
    value *= 1 + row.return;
    return { date: row.date, value };
  });
}

export function maxDrawdown(values: number[]) {
  let peak = values[0] ?? 0;
  let maxDd = 0;
  for (const value of values) {
    peak = Math.max(peak, value);
    if (peak > 0) maxDd = Math.min(maxDd, value / peak - 1);
  }
  return maxDd;
}

export function annualizedReturn(cumulativeReturn: number, tradingDays: number) {
  return Math.pow(1 + cumulativeReturn, 252 / Math.max(tradingDays, 1)) - 1;
}

export function annualizedVolatility(returns: number[]) {
  const avg = mean(returns);
  const variance = mean(returns.map((value) => Math.pow(value - avg, 2)));
  return Math.sqrt(variance) * Math.sqrt(252);
}

export function sharpeRatio(annualReturn: number, annualVol: number, riskFreeRate = 0.04) {
  return annualVol === 0 ? 0 : (annualReturn - riskFreeRate) / annualVol;
}

export function beta(assetReturns: number[], benchmarkReturns: number[]) {
  const n = Math.min(assetReturns.length, benchmarkReturns.length);
  const asset = assetReturns.slice(0, n);
  const benchmark = benchmarkReturns.slice(0, n);
  const benchmarkMean = mean(benchmark);
  const assetMean = mean(asset);
  const covariance = mean(asset.map((value, index) => (value - assetMean) * (benchmark[index] - benchmarkMean)));
  const variance = mean(benchmark.map((value) => Math.pow(value - benchmarkMean, 2)));
  return variance === 0 ? 0 : covariance / variance;
}

export function correlation(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  const x = a.slice(0, n);
  const y = b.slice(0, n);
  const xMean = mean(x);
  const yMean = mean(y);
  const numerator = x.reduce((sum, value, index) => sum + (value - xMean) * (y[index] - yMean), 0);
  const denominator =
    Math.sqrt(x.reduce((sum, value) => sum + Math.pow(value - xMean, 2), 0)) *
    Math.sqrt(y.reduce((sum, value) => sum + Math.pow(value - yMean, 2), 0));
  return denominator === 0 ? 0 : numerator / denominator;
}

export function weightedPortfolioReturns(
  returnsByTicker: Record<string, Array<{ date: string; return: number }>>,
  weights: Record<string, number>
) {
  const returnMaps = Object.fromEntries(
    Object.entries(returnsByTicker).map(([ticker, rows]) => [ticker, new Map(rows.map((row) => [row.date, row.return]))])
  ) as Record<string, Map<string, number>>;
  const allDates = Array.from(new Set(Object.values(returnsByTicker).flatMap((rows) => rows.map((row) => row.date)))).sort();
  return allDates
    .map((date) => {
      const availableWeights = Object.entries(weights).filter(([ticker]) => returnMaps[ticker]?.has(date));
      const totalWeight = availableWeights.reduce((sum, [, weight]) => sum + weight, 0);
      if (totalWeight <= 0) return null;
      return {
        date,
        return: availableWeights.reduce((sum, [ticker, weight]) => {
          return sum + (returnMaps[ticker].get(date) ?? 0) * (weight / totalWeight);
        }, 0)
      };
    })
    .filter((row): row is { date: string; return: number } => row !== null);
}

function mean(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
