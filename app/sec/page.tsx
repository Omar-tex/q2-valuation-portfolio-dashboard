import { DataStatus } from "@/components/DataStatus";
import { Disclaimer } from "@/components/Disclaimer";
import { SourceNote } from "@/components/SourceNote";
import { WarningBanner } from "@/components/WarningBanner";
import { DATA_SOURCES } from "@/lib/constants";
import { getCompanySnapshot } from "@/lib/data/sec";
import { formatCurrency } from "@/lib/format";

export default async function SecDataPage() {
  const snapshot = await getCompanySnapshot();
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">SEC Filing Data Engine</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Server-side EDGAR extraction and XBRL normalization</h1>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
        The data engine fetches SEC Company Facts and Submissions on the server, maps company-specific XBRL labels into
        analyst-friendly financial line items, and separates annual and quarterly financials for the valuation model.
      </p>
      <div className="mt-6">
        <WarningBanner warnings={snapshot.warnings} />
        <DataStatus
          source="SEC EDGAR Company Facts and Submissions"
          href={DATA_SOURCES.q2FilingPage}
          updated={snapshot.lastUpdated}
          live={snapshot.live}
          note="All SEC requests are made server-side with the required SEC User-Agent header."
        />
      </div>

      <div className="panel mt-8 p-5">
        <h2 className="text-lg font-bold text-ink">Normalized SEC Tag Map</h2>
        <div className="table-scroll mt-4">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Financial Line</th>
                <th>Selected SEC Tag</th>
                <th>Latest Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(snapshot.metrics).map((metric) => (
                <tr key={metric.label}>
                  <td>{metric.label}</td>
                  <td>{metric.sourceTag}</td>
                  <td>{formatCurrency(metric.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceNote source="SEC EDGAR Company Facts" href={DATA_SOURCES.q2FilingPage} updated={snapshot.lastUpdated} live={snapshot.live} />
      </div>

      <div className="panel mt-6 p-5">
        <h2 className="text-lg font-bold text-ink">Latest 10-K / 10-Q Metadata</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
          <p><strong>Form:</strong> {snapshot.latestFiling?.form ?? "N/A"}</p>
          <p><strong>Filing Date:</strong> {snapshot.latestFiling?.filingDate ?? "N/A"}</p>
          <p><strong>Report Date:</strong> {snapshot.latestFiling?.reportDate ?? "N/A"}</p>
          <p><strong>Accession:</strong> {snapshot.latestFiling?.accessionNumber ?? "N/A"}</p>
        </div>
        <SourceNote source="SEC EDGAR Submissions" href={DATA_SOURCES.q2FilingPage} updated={snapshot.lastUpdated} live={snapshot.live} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
