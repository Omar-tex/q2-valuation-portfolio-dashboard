import "server-only";
import { DATA_SOURCES, DEFAULT_WEIGHTS, PEER_TICKERS } from "@/lib/constants";
import { fallbackPortfolioBacktest } from "@/lib/fallbackData";
import {
  annualizedReturn,
  annualizedVolatility,
  beta,
  correlation,
  cumulativeValue,
  dailyReturns,
  maxDrawdown,
  sharpeRatio,
  weightedPortfolioReturns
} from "@/lib/models/portfolio";
import type { PortfolioBacktest, PricePoint } from "@/lib/types";

export async function getCurrentPrice(ticker = "QTWO") {
  try {
    const prices = await getLivePrices(ticker, "1mo");
    return prices[prices.length - 1]?.close ?? 0;
  } catch (error) {
    console.error(`[market] Unable to fetch current price for ${ticker}`, error);
    return 0;
  }
}

export async function getPortfolioBacktest(weights = DEFAULT_WEIGHTS): Promise<PortfolioBacktest> {
  try {
    const results = await Promise.all(PEER_TICKERS.map((ticker) => fetchTickerWithFallback(ticker, "2020-01-01")));
    const successful = results.filter((result) => result.prices.length > 1);
    const failed = results.filter((result) => result.prices.length <= 1);
    const failedTickers = failed.map((result) => result.ticker);

    if (!successful.length) {
      console.error("[market] All live market data providers failed", failed);
      return {
        ...fallbackPortfolioBacktest,
        lastUpdated: new Date().toISOString(),
        failedTickers: [...PEER_TICKERS],
        warnings: [
          "Using fallback sample data because all live market data providers failed.",
          ...failed.map((result) => `${result.ticker}: ${result.error ?? "No price history returned"}`)
        ]
      };
    }

    const prices = Object.fromEntries(successful.map((result) => [result.ticker, result.prices])) as Record<string, PricePoint[]>;
    const returnsByTicker = Object.fromEntries(
      PEER_TICKERS.map((ticker) => [ticker, dailyReturns(prices[ticker] ?? [])])
    ) as Record<string, Array<{ date: string; return: number }>>;
    const portfolioReturns = weightedPortfolioReturns(returnsByTicker, weights);
    const portfolioValue = cumulativeValue(portfolioReturns, 10000);
    const spyValue = cumulativeValue(returnsByTicker.SPY ?? [], 10000);
    const valueByDate = new Map(spyValue.map((row) => [row.date, row.value]));
    const values = portfolioValue.map((row) => row.value);
    const runningSeries = portfolioValue.map((row) => ({
      date: row.date,
      portfolio: row.value,
      spy: valueByDate.get(row.date) ?? row.value,
      drawdown: drawdownAt(values, portfolioValue.findIndex((candidate) => candidate.date === row.date))
    }));
    const monthlyReturns = toMonthlyReturns(portfolioReturns);
    const rawPortfolioReturns = portfolioReturns.map((row) => row.return);
    const rawSpyReturns = returnsByTicker.SPY.map((row) => row.return);
    const cumulativeReturn = (values[values.length - 1] ?? 10000) / 10000 - 1;
    const annualReturn = annualizedReturn(cumulativeReturn, portfolioReturns.length);
    const annualVol = annualizedVolatility(rawPortfolioReturns);
    const providers = new Set(successful.map((result) => result.provider));
    const warnings = failedTickers.length
      ? [`Live market data loaded for ${successful.length} tickers. Failed tickers: ${failedTickers.join(", ")}.`]
      : [];
    return {
      live: true,
      lastUpdated: new Date().toISOString(),
      warnings,
      tickers: successful.map((result) => result.ticker),
      provider: providers.size > 1 ? "Mixed live providers" : successful[0].provider,
      failedTickers,
      prices,
      series: runningSeries,
      monthlyReturns,
      correlation: buildCorrelation(returnsByTicker),
      metrics: {
        cumulativeReturn,
        annualizedReturn: annualReturn,
        annualizedVolatility: annualVol,
        sharpeRatio: sharpeRatio(annualReturn, annualVol),
        maxDrawdown: maxDrawdown(values),
        betaVsSpy: beta(rawPortfolioReturns, rawSpyReturns),
        bestMonth: monthlyReturns.length ? Math.max(...monthlyReturns.map((row) => row.return)) : 0,
        worstMonth: monthlyReturns.length ? Math.min(...monthlyReturns.map((row) => row.return)) : 0
      }
    };
  } catch (error) {
    console.error("[market] Unexpected portfolio backtest failure", error);
    return {
      ...fallbackPortfolioBacktest,
      lastUpdated: new Date().toISOString(),
      warnings: ["Using fallback sample data because portfolio backtest calculation failed."]
    };
  }
}

async function fetchTickerWithFallback(ticker: string, start: string) {
  const errors: string[] = [];
  try {
    const prices = await getYahooPrices(ticker, start);
    return { ticker, prices, provider: "Yahoo" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Yahoo: ${message}`);
    console.error(`[market] Yahoo failed for ${ticker}`, error);
  }

  try {
    const prices = await getStooqPrices(ticker, start);
    return { ticker, prices, provider: "Stooq" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Stooq: ${message}`);
    console.error(`[market] Stooq failed for ${ticker}`, error);
  }

  return { ticker, prices: [] as PricePoint[], provider: "Yahoo" as const, error: errors.join(" | ") };
}

async function getLivePrices(ticker: string, start: string) {
  const result = await fetchTickerWithFallback(ticker, start);
  if (result.prices.length <= 1) throw new Error(result.error ?? `No live prices returned for ${ticker}`);
  return result.prices;
}

async function getYahooPrices(ticker: string, start: string) {
  const period1 =
    start === "1mo"
      ? Math.floor((Date.now() - 31 * 24 * 60 * 60 * 1000) / 1000)
      : Math.floor(new Date(start).getTime() / 1000);
  const url = `${DATA_SOURCES.yahooChart}/${ticker}?period1=${period1}&period2=${Math.floor(Date.now() / 1000)}&interval=1d&events=history`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent": "OmarParedesFinanceDashboard/1.0 op987943@gmail.com"
    },
    next: { revalidate: 60 * 60 * 6 }
  });
  if (!response.ok) throw new Error(`Yahoo market price request failed with ${response.status}`);
  const json = await response.json();
  const yahooError = json.chart?.error;
  if (yahooError) throw new Error(`${yahooError.code ?? "YahooError"}: ${yahooError.description ?? "Unknown Yahoo error"}`);
  const result = json.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const closes = result?.indicators?.quote?.[0]?.close ?? [];
  const prices = timestamps
    .map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      close: closes[index]
    }))
    .filter((row: PricePoint) => Number.isFinite(row.close));
  if (prices.length <= 1) throw new Error("Yahoo returned no usable daily closes");
  return prices;
}

async function getStooqPrices(ticker: string, start: string) {
  const startDate = start === "1mo" ? new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) : new Date(start);
  const endDate = new Date();
  const params = new URLSearchParams({
    s: `${ticker.toLowerCase()}.us`,
    d1: toStooqDate(startDate),
    d2: toStooqDate(endDate),
    i: "d"
  });
  const response = await fetch(`${DATA_SOURCES.stooqDailyCsv}?${params.toString()}`, {
    headers: {
      Accept: "text/csv,text/plain,*/*",
      "User-Agent": "OmarParedesFinanceDashboard/1.0 op987943@gmail.com"
    },
    next: { revalidate: 60 * 60 * 6 }
  });
  if (!response.ok) throw new Error(`Stooq CSV request failed with ${response.status}`);
  const csv = await response.text();
  if (/^\s*<!doctype html/i.test(csv) || /^\s*<html/i.test(csv)) {
    throw new Error("Stooq returned an HTML verification page instead of CSV");
  }
  if (/no data/i.test(csv)) throw new Error("Stooq returned no data");
  const prices = csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, , , , close] = line.split(",");
      return { date, close: Number(close) };
    })
    .filter((row) => row.date && Number.isFinite(row.close));
  if (prices.length <= 1) throw new Error("Stooq returned no usable daily closes");
  return prices;
}

function drawdownAt(values: number[], index: number) {
  const slice = values.slice(0, index + 1);
  const peak = Math.max(...slice);
  return values[index] / peak - 1;
}

function toMonthlyReturns(returns: Array<{ date: string; return: number }>) {
  const monthly = new Map<string, number>();
  for (const row of returns) {
    const month = row.date.slice(0, 7);
    monthly.set(month, (1 + (monthly.get(month) ?? 0)) * (1 + row.return) - 1);
  }
  return Array.from(monthly.entries()).map(([month, value]) => ({ month, return: value }));
}

function buildCorrelation(returnsByTicker: Record<string, Array<{ date: string; return: number }>>) {
  return PEER_TICKERS.flatMap((assetA) =>
    PEER_TICKERS.map((assetB) => ({
      assetA,
      assetB,
      value: correlation(
        (returnsByTicker[assetA] ?? []).map((row) => row.return),
        (returnsByTicker[assetB] ?? []).map((row) => row.return)
      )
    }))
  );
}

function toStooqDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}
