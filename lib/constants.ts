export const Q2_CIK = "0001410384";

export const DATA_SOURCES = {
  secCompanyFacts: "https://data.sec.gov/api/xbrl/companyfacts/CIK0001410384.json",
  secSubmissions: "https://data.sec.gov/submissions/CIK0001410384.json",
  q2FilingPage: "https://www.sec.gov/edgar/browse/?CIK=1410384",
  q2InvestorRelations: "https://investors.q2.com/",
  treasuryInterestRateStats:
    "https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics",
  treasuryXml:
    "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=2026",
  fredCpiPage: "https://fred.stlouisfed.org/series/CPIAUCSL",
  fredCpiCsv: "https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL",
  yahooFinanceQtWo: "https://finance.yahoo.com/quote/QTWO/history/",
  yahooChart: "https://query1.finance.yahoo.com/v8/finance/chart",
  stooqDailyCsv: "https://stooq.com/q/d/l/"
} as const;

export const SEC_HEADERS = {
  "User-Agent": "OmarParedesFinanceDashboard/1.0 op987943@gmail.com",
  "Accept-Encoding": "gzip, deflate",
  Host: "data.sec.gov"
} as const;

export const PEER_TICKERS = ["QTWO", "NCNO", "ALKT", "MQ", "FIS", "GPN", "SPY"] as const;

export const DEFAULT_WEIGHTS: Record<(typeof PEER_TICKERS)[number], number> = {
  QTWO: 0.3,
  NCNO: 0.15,
  ALKT: 0.15,
  MQ: 0.1,
  FIS: 0.1,
  GPN: 0.1,
  SPY: 0.1
};
