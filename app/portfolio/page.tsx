import { DataStatus } from "@/components/DataStatus";
import { Disclaimer } from "@/components/Disclaimer";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { WarningBanner } from "@/components/WarningBanner";
import { DATA_SOURCES } from "@/lib/constants";
import { getPortfolioBacktest } from "@/lib/data/market";

export default async function PortfolioPage() {
  const backtest = await getPortfolioBacktest();
  const marketProviderHref = backtest.provider === "Yahoo" ? DATA_SOURCES.yahooFinanceQtWo : undefined;
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">Portfolio Analysis + Backtesting</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">QTWO fintech peer basket vs SPY</h1>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
        Backtest starts on January 1, 2020 and compares QTWO, NCNO, ALKT, MQ, FIS, GPN, and SPY. The default
        portfolio is 30% QTWO, 15% NCNO, 15% ALKT, 10% MQ, 10% FIS, 10% GPN, and 10% SPY.
      </p>
      <div className="mt-6">
        <WarningBanner warnings={backtest.warnings} />
        <DataStatus
          source={`Market price data provider: ${backtest.provider}`}
          href={marketProviderHref}
          updated={backtest.lastUpdated}
          live={backtest.live}
          liveLabel="Using live market data"
          fallbackLabel="Using fallback sample data"
          note="Daily historical prices are transformed into weighted returns, cumulative value, volatility, beta, drawdown, and monthly return analytics."
        />
      </div>
      <div className="mt-8">
        <PortfolioDashboard backtest={backtest} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
