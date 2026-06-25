"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { DrawdownChart, MonthlyReturnsChart, PortfolioChart } from "@/components/DashboardCharts";
import { SourceNote } from "@/components/SourceNote";
import { DATA_SOURCES, DEFAULT_WEIGHTS, PEER_TICKERS } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import type { PortfolioBacktest } from "@/lib/types";

export function PortfolioDashboard({ backtest }: { backtest: PortfolioBacktest }) {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const normalizedTotal = useMemo(() => Object.values(weights).reduce((sum, weight) => sum + weight, 0), [weights]);
  const spyCumulativeReturn = useMemo(() => {
    const first = backtest.series[0]?.spy ?? 10000;
    const last = backtest.series[backtest.series.length - 1]?.spy ?? first;
    return last / first - 1;
  }, [backtest.series]);
  const marketProviderHref = backtest.provider === "Yahoo" ? DATA_SOURCES.yahooFinanceQtWo : undefined;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <DashboardCard title="Portfolio cumulative return" value={formatPercent(backtest.metrics.cumulativeReturn)} subtitle="Since Jan. 1, 2020" tone="accent" />
        <DashboardCard title="SPY cumulative return" value={formatPercent(spyCumulativeReturn)} subtitle="Benchmark return over same period" />
        <DashboardCard title="Annualized return" value={formatPercent(backtest.metrics.annualizedReturn)} subtitle="Geometric annualized" />
        <DashboardCard title="Volatility" value={formatPercent(backtest.metrics.annualizedVolatility)} subtitle="Annualized standard deviation" />
        <DashboardCard title="Sharpe ratio" value={backtest.metrics.sharpeRatio.toFixed(2)} subtitle="Return per unit of volatility" />
        <DashboardCard title="Max drawdown" value={formatPercent(backtest.metrics.maxDrawdown)} subtitle="Largest peak-to-trough decline" tone="negative" />
        <DashboardCard title="Beta vs SPY" value={backtest.metrics.betaVsSpy.toFixed(2)} subtitle="Sensitivity to benchmark returns" />
        <DashboardCard title="Best / worst month" value={`${formatPercent(backtest.metrics.bestMonth)} / ${formatPercent(backtest.metrics.worstMonth)}`} subtitle="Monthly compounded return" />
      </div>

      <div className="panel border-l-4 border-l-financeBlue p-5">
        <h2 className="text-lg font-bold text-ink">Backtest Interpretation</h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700">
          Over this backtest period, the QTWO-centered fintech peer basket underperformed SPY while showing larger
          drawdowns and higher volatility. That comparison is useful because it shows why analysts evaluate returns
          against a benchmark, not in isolation.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Portfolio Weights</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This backtest asks whether a QTWO-centered fintech software basket outperformed or added risk relative
            to SPY from January 1, 2020 to today.
          </p>
          <div className="mt-4 grid gap-3">
            {PEER_TICKERS.map((ticker) => (
              <label key={ticker} className="grid gap-1 text-sm font-semibold text-slate-700">
                {ticker}
                <input
                  className="accent-financeBlue"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={Math.round(weights[ticker] * 100)}
                  onChange={(event) => setWeights((current) => ({ ...current, [ticker]: Number(event.target.value) / 100 }))}
                />
                <span className="text-xs text-slate-500">{formatPercent(weights[ticker], 0)}</span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">Selected total: {formatPercent(normalizedTotal, 0)}</p>
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Portfolio Value Growth from $10,000</h2>
          <PortfolioChart data={backtest.series} />
          <SourceNote
            source={`Market price data provider: ${backtest.provider}`}
            href={marketProviderHref}
            updated={backtest.lastUpdated}
            live={backtest.live}
            liveLabel="Using live market data"
            fallbackLabel="Using fallback sample data"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Drawdown</h2>
          <DrawdownChart data={backtest.series} />
          <SourceNote source="Calculated from daily portfolio values" updated={backtest.lastUpdated} live={backtest.live} liveLabel="Using live market data" fallbackLabel="Using fallback sample data" />
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Monthly Returns</h2>
          <MonthlyReturnsChart data={backtest.monthlyReturns} />
          <SourceNote source="Calculated from monthly compounded returns" updated={backtest.lastUpdated} live={backtest.live} liveLabel="Using live market data" fallbackLabel="Using fallback sample data" />
        </div>
      </section>

      <section className="grid gap-6">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Correlation Matrix</h2>
          <div className="table-scroll mt-4">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  {PEER_TICKERS.map((ticker) => (
                    <th key={ticker}>{ticker}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PEER_TICKERS.map((assetA) => (
                  <tr key={assetA}>
                    <td>{assetA}</td>
                    {PEER_TICKERS.map((assetB) => {
                      const item = backtest.correlation.find((row) => row.assetA === assetA && row.assetB === assetB);
                      return <td key={assetB}>{(item?.value ?? 0).toFixed(2)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
