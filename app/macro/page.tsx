import { DataStatus } from "@/components/DataStatus";
import { DashboardCard } from "@/components/DashboardCard";
import { MacroChart } from "@/components/DashboardCharts";
import { Disclaimer } from "@/components/Disclaimer";
import { SourceNote } from "@/components/SourceNote";
import { WarningBanner } from "@/components/WarningBanner";
import { DATA_SOURCES } from "@/lib/constants";
import { getMacroSnapshot } from "@/lib/data/macro";
import { formatNumber, formatPercent } from "@/lib/format";

export default async function MacroPage() {
  const macro = await getMacroSnapshot();
  const rateCases = [-0.01, 0, 0.01, 0.02].map((delta) => ({
    rate: macro.tenYear + delta,
    priceIndex: 100 / (1 + delta * 7)
  }));
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">Macro Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Treasury rates, CPI, and valuation sensitivity</h1>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
        The 10-year Treasury rate flows into the DCF risk-free rate. Higher rates generally raise discount rates and
        pressure long-duration growth company valuations.
      </p>
      <div className="mt-6">
        <WarningBanner warnings={macro.warnings} />
        <DataStatus
          source="U.S. Treasury Interest Rate Statistics and FRED CPIAUCSL"
          href={DATA_SOURCES.treasuryXml}
          updated={macro.lastUpdated}
          live={macro.live}
          note="Macro inputs are used to contextualize discount rates and inflation conditions around the valuation."
        />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <DashboardCard title="10-year Treasury" value={formatPercent(macro.tenYear, 2)} subtitle="Risk-free rate input" tone="accent" />
        <DashboardCard title="2-year Treasury" value={formatPercent(macro.twoYear, 2)} subtitle="Front-end rate context" />
        <DashboardCard title="10Y - 2Y spread" value={formatPercent(macro.spread, 2)} subtitle="Yield curve slope" />
        <DashboardCard title="CPI / YoY inflation" value={`${formatNumber(macro.cpiLatest)} / ${formatPercent(macro.cpiYoY, 2)}`} subtitle="FRED CPIAUCSL" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Treasury Yield Trend</h2>
          <MacroChart data={macro.treasuryTrend} kind="rates" />
          <SourceNote source="U.S. Treasury Interest Rate Statistics" href={DATA_SOURCES.treasuryXml} updated={macro.lastUpdated} live={macro.live} />
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">CPI Trend</h2>
          <MacroChart data={macro.cpiTrend} kind="cpi" />
          <SourceNote source="FRED CPIAUCSL" href={DATA_SOURCES.fredCpiCsv} updated={macro.lastUpdated} live={macro.live} />
        </div>
      </div>
      <div className="panel mt-6 p-5">
        <h2 className="text-lg font-bold text-ink">DCF implied share price under different risk-free rates</h2>
        <div className="table-scroll mt-4">
          <table className="finance-table">
            <thead><tr><th>Risk-free Rate</th><th>Illustrative Price Index</th></tr></thead>
            <tbody>
              {rateCases.map((row) => (
                <tr key={row.rate}><td>{formatPercent(row.rate, 2)}</td><td>{row.priceIndex.toFixed(1)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
