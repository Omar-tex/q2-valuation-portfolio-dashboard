import { DATA_SOURCES } from "@/lib/constants";
import { Disclaimer } from "@/components/Disclaimer";

const humanSources = [
  ["Q2 Holdings Investor Relations", DATA_SOURCES.q2InvestorRelations],
  ["Q2 Holdings SEC Filing Page", DATA_SOURCES.q2FilingPage],
  ["SEC EDGAR Search", "https://www.sec.gov/edgar/search/"],
  ["U.S. Treasury Interest Rate Statistics", "https://home.treasury.gov/resource-center/data-chart-center/interest-rates"],
  ["FRED CPIAUCSL page", "https://fred.stlouisfed.org/series/CPIAUCSL"],
  ["Yahoo Finance market prices", "https://finance.yahoo.com/quote/QTWO/"]
];

const technicalEndpoints = [
  ["SEC Company Facts API", DATA_SOURCES.secCompanyFacts],
  ["SEC Submissions API", DATA_SOURCES.secSubmissions],
  ["Treasury XML feed", DATA_SOURCES.treasuryXml],
  ["FRED CPI CSV endpoint", DATA_SOURCES.fredCpiCsv],
  ["Yahoo chart endpoint / market price provider", DATA_SOURCES.yahooChart]
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

      <div className="panel mt-6 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-ink">Technical data endpoints used by this project</h2>
          <span className="rounded bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
            Raw API endpoint
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          These links may open raw JSON, XML, or CSV data. They are included for transparency because the dashboard
          uses them for live data collection.
        </p>
        <div className="mt-4 grid gap-2">
          {technicalEndpoints.map(([label, href]) => (
            <a
              key={label}
              className="rounded border border-slateLine bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-mist sm:text-sm"
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
