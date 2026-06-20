import { DashboardCard } from "@/components/DashboardCard";
import { DataStatus } from "@/components/DataStatus";
import { Disclaimer } from "@/components/Disclaimer";
import { SourceNote } from "@/components/SourceNote";
import { WarningBanner } from "@/components/WarningBanner";
import { DATA_SOURCES } from "@/lib/constants";
import { getCompanySnapshot } from "@/lib/data/sec";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function CompanyPage() {
  const snapshot = await getCompanySnapshot();
  const metrics = snapshot.metrics;
  const cards = [
    metrics.revenue,
    metrics.netIncome,
    metrics.operatingCashFlow,
    metrics.cash,
    metrics.liabilities,
    metrics.shares
  ];
  return (
    <section className="page-shell py-10">
      <div className="grid gap-4">
        <p className="section-kicker">Company Overview</p>
        <h1 className="text-3xl font-bold text-ink md:text-5xl">Q2 Holdings, Inc. (NYSE: QTWO)</h1>
        <p className="max-w-4xl text-lg leading-8 text-slate-700">
          Q2 Holdings provides cloud-based digital banking, lending, fraud/risk, and customer engagement software to
          banks, credit unions, fintechs, and alternative finance companies.
        </p>
        <WarningBanner warnings={snapshot.warnings} />
        <DataStatus
          source="SEC EDGAR Company Facts and Submissions"
          href={DATA_SOURCES.secCompanyFacts}
          updated={snapshot.lastUpdated}
          live={snapshot.live}
          note="Company financial facts are pulled server-side from SEC EDGAR and normalized into dashboard line items."
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard title="Ticker" value="QTWO" subtitle="NYSE-listed public company" tone="accent" />
          <DashboardCard title="Industry" value="Fintech software" subtitle="Banking software and digital banking infrastructure" />
          <DashboardCard title="Most recent filing" value={snapshot.latestFiling?.form ?? "N/A"} subtitle={snapshot.latestFiling?.filingDate ?? "No filing metadata available"} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((metric) => (
          <DashboardCard
            key={metric.label}
            title={metric.label}
            value={metric.unit === "shares" ? formatNumber(metric.value) : formatCurrency(metric.value)}
            subtitle={`${metric.fiscalYear ?? ""} ${metric.fiscalPeriod ?? ""}`.trim()}
          >
            <p
              className="inline-block max-w-full truncate rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500"
              title={metric.sourceTag ?? "SEC tag available"}
            >
              SEC tag available
            </p>
          </DashboardCard>
        ))}
      </div>

      <div className="panel mt-8 p-5">
        <h2 className="text-lg font-bold text-ink">Recent Annual Financials</h2>
        <div className="table-scroll mt-4">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Revenue</th>
                <th>Net Income</th>
                <th>Operating CF</th>
                <th>Capex</th>
                <th>Cash</th>
                <th>Liabilities</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.annualFinancials.map((row) => (
                <tr key={row.period}>
                  <td>{row.period}</td>
                  <td>{formatCurrency(row.revenue)}</td>
                  <td>{formatCurrency(row.netIncome)}</td>
                  <td>{formatCurrency(row.operatingCashFlow)}</td>
                  <td>{formatCurrency(row.capex)}</td>
                  <td>{formatCurrency(row.cash)}</td>
                  <td>{formatCurrency(row.liabilities)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceNote source="SEC EDGAR Company Facts" href={DATA_SOURCES.secCompanyFacts} updated={snapshot.lastUpdated} live={snapshot.live} />
        {snapshot.latestFiling ? (
          <a className="mt-2 inline-block text-sm font-bold text-financeBlue hover:underline" href={snapshot.latestFiling.url} target="_blank" rel="noreferrer">
            Latest filing link
          </a>
        ) : null}
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
