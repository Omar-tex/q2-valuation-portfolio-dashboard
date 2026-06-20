import "server-only";
import { DATA_SOURCES, SEC_HEADERS } from "@/lib/constants";
import { fallbackCompanySnapshot } from "@/lib/fallbackData";
import type { CompanyMetric, CompanySnapshot, FinancialPeriod } from "@/lib/types";

type FactUnit = {
  val: number;
  fy?: number;
  fp?: string;
  form?: string;
  filed?: string;
  end?: string;
  frame?: string;
};

type CompanyFacts = {
  facts: {
    "us-gaap"?: Record<string, { label?: string; units?: Record<string, FactUnit[]> }>;
    dei?: Record<string, { label?: string; units?: Record<string, FactUnit[]> }>;
  };
};

const TAGS = {
  revenue: ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues"],
  netIncome: ["NetIncomeLoss"],
  operatingCashFlow: ["NetCashProvidedByUsedInOperatingActivities"],
  capex: ["PaymentsToAcquirePropertyPlantAndEquipment", "PaymentsForCapitalizedSoftwareDevelopmentCosts"],
  cash: ["CashAndCashEquivalentsAtCarryingValue", "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents"],
  assets: ["Assets"],
  liabilities: ["Liabilities"],
  equity: ["StockholdersEquity"],
  shares: ["EntityCommonStockSharesOutstanding", "WeightedAverageNumberOfDilutedSharesOutstanding", "CommonStocksIncludingAdditionalPaidInCapital"],
  stockBasedComp: ["ShareBasedCompensation", "AllocatedShareBasedCompensationExpense"]
} as const;

export async function getCompanySnapshot(): Promise<CompanySnapshot> {
  try {
    const [factsRes, submissionsRes] = await Promise.all([
      fetch(DATA_SOURCES.secCompanyFacts, { headers: SEC_HEADERS, next: { revalidate: 60 * 60 * 6 } }),
      fetch(DATA_SOURCES.secSubmissions, { headers: SEC_HEADERS, next: { revalidate: 60 * 60 * 6 } })
    ]);
    if (!factsRes.ok || !submissionsRes.ok) throw new Error("SEC request failed");
    const facts = (await factsRes.json()) as CompanyFacts;
    const submissions = await submissionsRes.json();
    const warnings: string[] = [];
    const metrics = Object.fromEntries(
      Object.entries(TAGS).map(([key, tags]) => [key, metricFromTags(facts, key, [...tags], warnings)])
    ) as CompanySnapshot["metrics"];
    const recent = submissions.filings?.recent;
    const filingIndex = recent?.form?.findIndex((form: string) => form === "10-K" || form === "10-Q") ?? -1;
    const accession = filingIndex >= 0 ? recent.accessionNumber[filingIndex] : "";
    const latestFiling =
      filingIndex >= 0
        ? {
            form: recent.form[filingIndex],
            filingDate: recent.filingDate[filingIndex],
            accessionNumber: accession,
            reportDate: recent.reportDate?.[filingIndex],
            url: `https://www.sec.gov/Archives/edgar/data/1410384/${accession.replaceAll("-", "")}/${accession}-index.html`
          }
        : undefined;
    return {
      ticker: "QTWO",
      live: true,
      lastUpdated: new Date().toISOString(),
      warnings: Array.from(new Set(warnings)),
      latestFiling,
      metrics,
      annualFinancials: buildPeriods(facts, "FY"),
      quarterlyFinancials: buildPeriods(facts, "Q")
    };
  } catch {
    return fallbackCompanySnapshot;
  }
}

function metricFromTags(facts: CompanyFacts, key: string, tags: string[], warnings: string[]): CompanyMetric {
  const preferred = findFact(facts, tags[0]);
  const selected = preferred ?? tags.slice(1).map((tag) => findFact(facts, tag)).find(Boolean);
  if (!preferred && selected) warnings.push("Some financial data required alternate SEC tags due to company-specific filing labels.");
  const latest = selected?.facts.sort((a, b) => (b.filed ?? "").localeCompare(a.filed ?? ""))[0];
  return {
    label: labelForMetric(key),
    value: latest?.val ?? null,
    unit: key === "shares" ? "shares" : "usd",
    fiscalYear: latest?.fy,
    fiscalPeriod: latest?.fp,
    filed: latest?.filed,
    sourceTag: selected?.tag ?? tags[0]
  };
}

function findFact(facts: CompanyFacts, tag: string) {
  const item = facts.facts["us-gaap"]?.[tag] ?? facts.facts.dei?.[tag];
  const unitEntries = Object.entries(item?.units ?? {});
  const preferredUnit = unitEntries.find(([unit]) => unit === "USD" || unit === "shares") ?? unitEntries[0];
  const rows = preferredUnit?.[1]?.filter((row) => row.form === "10-K" || row.form === "10-Q") ?? [];
  return rows.length ? { tag, facts: rows } : null;
}

function buildPeriods(facts: CompanyFacts, fiscalPeriod: "FY" | "Q"): FinancialPeriod[] {
  const revenue = findFact(facts, TAGS.revenue[0]) ?? findFact(facts, TAGS.revenue[1]);
  const years = Array.from(new Set((revenue?.facts ?? []).filter((row) => row.fp === fiscalPeriod).map((row) => row.fy)))
    .filter(Boolean)
    .slice(-5);
  return years.map((year) => ({
    period: String(year),
    revenue: valueFor(facts, TAGS.revenue, year, fiscalPeriod),
    netIncome: valueFor(facts, TAGS.netIncome, year, fiscalPeriod),
    operatingCashFlow: valueFor(facts, TAGS.operatingCashFlow, year, fiscalPeriod),
    capex: valueFor(facts, TAGS.capex, year, fiscalPeriod),
    cash: valueFor(facts, TAGS.cash, year, fiscalPeriod),
    liabilities: valueFor(facts, TAGS.liabilities, year, fiscalPeriod)
  }));
}

function valueFor(facts: CompanyFacts, tags: readonly string[], fy: number | undefined, fp: string) {
  const fact = tags.map((tag) => findFact(facts, tag)).find(Boolean);
  return fact?.facts.find((row) => row.fy === fy && row.fp === fp)?.val ?? null;
}

function labelForMetric(key: string) {
  return (
    {
      revenue: "Latest revenue",
      netIncome: "Latest net income",
      operatingCashFlow: "Operating cash flow",
      capex: "Capital expenditures",
      cash: "Cash and equivalents",
      assets: "Total assets",
      liabilities: "Total liabilities",
      equity: "Stockholders equity",
      shares: "Shares outstanding",
      stockBasedComp: "Stock-based compensation"
    }[key] ?? key
  );
}
