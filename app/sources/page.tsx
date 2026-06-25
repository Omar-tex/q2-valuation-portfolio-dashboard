import { DATA_SOURCES } from "@/lib/constants";
import { Disclaimer } from "@/components/Disclaimer";

const humanSources = [
  ["Q2 Holdings Investor Relations", DATA_SOURCES.q2InvestorRelations],
  ["Q2 Holdings SEC Filing Page", DATA_SOURCES.q2FilingPage],
  ["SEC EDGAR Search", "https://www.sec.gov/search-filings"],
  ["U.S. Treasury Interest Rate Statistics", DATA_SOURCES.treasuryInterestRateStats],
  ["FRED CPIAUCSL page", DATA_SOURCES.fredCpiPage],
  ["Yahoo Finance market prices", DATA_SOURCES.yahooFinanceQtWo]
];

const technicalEndpoints = [
  ["View raw SEC Company Facts API", DATA_SOURCES.secCompanyFacts],
  ["View raw SEC Submissions API", DATA_SOURCES.secSubmissions],
  ["View raw Treasury XML Feed", "https://home.treasury.gov/treasury-daily-interest-rate-xml-feed"],
  ["View raw FRED CPI CSV", DATA_SOURCES.fredCpiCsv],
  ["View Yahoo Finance Price History", DATA_SOURCES.yahooFinanceQtWo]
];

export default function SourcesPage() {
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">Sources</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Data sources and project notes</h1>
      <div className="panel mt-8 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-ink">Human-readable sources</h2>
          <span className="rounded bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-financeGreen">
            Human-readable
          </span>
        </div>
        <div className="grid gap-3">
          {humanSources.map(([label, href]) => (
            <a key={label} className="rounded border border-slateLine px-4 py-3 text-sm font-semibold text-financeBlue hover:bg-mist" href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="panel mt-6 border-slateLine bg-slate-50/70 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Developer / raw data links</p>
            <h2 className="mt-1 text-lg font-bold text-ink">Technical data endpoints used by this project</h2>
          </div>
          <span className="rounded bg-slate-200 px-3 py-1 text-xs font-bold uppercase text-slate-700">
            Raw data documentation
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          These are raw data endpoints used by the dashboard’s backend. They may open JSON, XML, or CSV files in the
          browser. They are included for transparency and are not intended to be normal reading pages.
        </p>
        <div className="mt-4 grid gap-2">
          {technicalEndpoints.map(([label, href]) => (
            <a
              key={label}
              className="rounded border border-dashed border-slate-300 bg-white/70 px-4 py-2 font-mono text-xs font-semibold text-slate-700 underline-offset-2 hover:border-financeBlue hover:bg-white hover:text-financeBlue hover:underline sm:text-sm"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
