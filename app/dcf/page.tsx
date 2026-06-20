import { DcfDashboard } from "@/components/DcfDashboard";
import { DataStatus } from "@/components/DataStatus";
import { Disclaimer } from "@/components/Disclaimer";
import { WarningBanner } from "@/components/WarningBanner";
import { DATA_SOURCES } from "@/lib/constants";
import { getMacroSnapshot } from "@/lib/data/macro";
import { getCurrentPrice } from "@/lib/data/market";
import { getCompanySnapshot } from "@/lib/data/sec";
import type { DcfAssumptions } from "@/lib/types";

export default async function DcfPage() {
  const [company, macro, price] = await Promise.all([getCompanySnapshot(), getMacroSnapshot(), getCurrentPrice("QTWO")]);
  const revenue = company.metrics.revenue.value ?? 696_000_000;
  const ocf = company.metrics.operatingCashFlow.value ?? 85_000_000;
  const capex = Math.abs(company.metrics.capex.value ?? 24_000_000);
  const startingFcfMargin = Math.max(Math.min((ocf - capex) / revenue, 0.18), 0.04);
  const assumptions: DcfAssumptions = {
    startingRevenue: revenue,
    revenueGrowth: [0.12, 0.11, 0.1, 0.09, 0.08],
    terminalGrowth: 0.03,
    startingFcfMargin,
    targetFcfMargin: 0.22,
    taxRate: 0.21,
    depreciationPctRevenue: 0.04,
    capexPctRevenue: 0.035,
    workingCapitalPctRevenue: 0.02,
    riskFreeRate: macro.tenYear,
    equityRiskPremium: 0.055,
    beta: 1.2,
    costOfDebt: 0.065,
    debt: company.metrics.liabilities.value ?? 740_000_000,
    cash: company.metrics.cash.value ?? 320_000_000,
    dilutedShares: company.metrics.shares.value ?? 61_000_000
  };
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">DCF Model</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Q2 Holdings Intrinsic Value Model</h1>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
        Base case assumptions use 12%, 11%, 10%, 9%, and 8% revenue growth, a 3% terminal growth rate,
        FCF margin improvement toward 22%, and a Treasury-based risk-free rate.
      </p>
      <div className="mt-6 grid gap-3">
        <WarningBanner warnings={[...company.warnings, ...macro.warnings]} />
        <DataStatus
          source="SEC EDGAR, U.S. Treasury, and market price data provider"
          href={DATA_SOURCES.secCompanyFacts}
          updated={company.lastUpdated}
          live={company.live && macro.live && Boolean(price)}
          note="Financial statement inputs come from SEC data; the risk-free rate comes from Treasury data; current share price uses the market price data provider."
        />
      </div>
      <div className="mt-8">
        <DcfDashboard initialAssumptions={assumptions} currentSharePrice={price || 75} updated={company.lastUpdated} live={company.live && macro.live && Boolean(price)} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
