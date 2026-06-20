import { DATA_SOURCES } from "@/lib/constants";
import { Disclaimer } from "@/components/Disclaimer";

const sources = [
  ["SEC EDGAR Company Facts", DATA_SOURCES.secCompanyFacts],
  ["SEC EDGAR Submissions", DATA_SOURCES.secSubmissions],
  ["Q2 Holdings SEC Filing Page", DATA_SOURCES.q2FilingPage],
  ["Q2 Holdings Investor Relations", DATA_SOURCES.q2InvestorRelations],
  ["U.S. Treasury Interest Rate Statistics", DATA_SOURCES.treasuryXml],
  ["FRED CPIAUCSL", DATA_SOURCES.fredCpiCsv],
  ["yfinance for historical market prices", "https://pypi.org/project/yfinance/"]
];

export default function SourcesPage() {
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">Sources</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Data sources and project notes</h1>
      <div className="panel mt-8 p-5">
        <div className="grid gap-3">
          {sources.map(([label, href]) => (
            <a key={label} className="rounded border border-slateLine px-4 py-3 text-sm font-semibold text-financeBlue hover:bg-mist" href={href} target="_blank" rel="noreferrer">
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
