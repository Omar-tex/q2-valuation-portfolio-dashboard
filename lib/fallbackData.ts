import type { CompanySnapshot, MacroSnapshot, PortfolioBacktest } from "@/lib/types";

export const fallbackCompanySnapshot: CompanySnapshot = {
  ticker: "QTWO",
  live: false,
  lastUpdated: new Date().toISOString(),
  warnings: ["Live data unavailable. Displaying fallback sample data for demonstration."],
  latestFiling: {
    form: "10-K",
    filingDate: "2026-02-21",
    accessionNumber: "0001410384-26-000010",
    reportDate: "2025-12-31",
    url: "https://www.sec.gov/edgar/browse/?CIK=1410384"
  },
  metrics: {
    revenue: { label: "Latest revenue", value: 696_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "RevenueFromContractWithCustomerExcludingAssessedTax" },
    netIncome: { label: "Latest net income", value: -10_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "NetIncomeLoss" },
    operatingCashFlow: { label: "Operating cash flow", value: 85_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "NetCashProvidedByUsedInOperatingActivities" },
    capex: { label: "Capital expenditures", value: -24_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "PaymentsToAcquirePropertyPlantAndEquipment" },
    cash: { label: "Cash and equivalents", value: 320_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "CashAndCashEquivalentsAtCarryingValue" },
    assets: { label: "Total assets", value: 1_530_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "Assets" },
    liabilities: { label: "Total liabilities", value: 740_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "Liabilities" },
    equity: { label: "Stockholders equity", value: 790_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "StockholdersEquity" },
    shares: { label: "Shares outstanding", value: 61_000_000, unit: "shares", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "EntityCommonStockSharesOutstanding" },
    stockBasedComp: { label: "Stock-based compensation", value: 89_000_000, unit: "usd", fiscalYear: 2025, fiscalPeriod: "FY", sourceTag: "ShareBasedCompensation" }
  },
  annualFinancials: [
    { period: "2021", revenue: 498_000_000, netIncome: -98_000_000, operatingCashFlow: 22_000_000, capex: -18_000_000, cash: 380_000_000, liabilities: 810_000_000 },
    { period: "2022", revenue: 565_000_000, netIncome: -109_000_000, operatingCashFlow: 38_000_000, capex: -20_000_000, cash: 350_000_000, liabilities: 790_000_000 },
    { period: "2023", revenue: 624_000_000, netIncome: -65_000_000, operatingCashFlow: 59_000_000, capex: -22_000_000, cash: 335_000_000, liabilities: 760_000_000 },
    { period: "2024", revenue: 667_000_000, netIncome: -31_000_000, operatingCashFlow: 74_000_000, capex: -23_000_000, cash: 326_000_000, liabilities: 748_000_000 },
    { period: "2025", revenue: 696_000_000, netIncome: -10_000_000, operatingCashFlow: 85_000_000, capex: -24_000_000, cash: 320_000_000, liabilities: 740_000_000 }
  ],
  quarterlyFinancials: []
};

export const fallbackMacroSnapshot: MacroSnapshot = {
  live: false,
  lastUpdated: new Date().toISOString(),
  warnings: ["Live data unavailable. Displaying fallback sample data for demonstration."],
  tenYear: 0.043,
  twoYear: 0.039,
  spread: 0.004,
  cpiLatest: 320.3,
  cpiYoY: 0.031,
  treasuryTrend: [
    { date: "2026-01-31", twoYear: 0.039, tenYear: 0.041 },
    { date: "2026-02-28", twoYear: 0.038, tenYear: 0.042 },
    { date: "2026-03-31", twoYear: 0.04, tenYear: 0.043 },
    { date: "2026-04-30", twoYear: 0.039, tenYear: 0.044 },
    { date: "2026-05-31", twoYear: 0.039, tenYear: 0.043 }
  ],
  cpiTrend: [
    { date: "2025-01-01", cpi: 310.2, yoy: 0.029 },
    { date: "2025-06-01", cpi: 314.1, yoy: 0.031 },
    { date: "2025-12-01", cpi: 318.5, yoy: 0.032 },
    { date: "2026-05-01", cpi: 320.3, yoy: 0.031 }
  ]
};

export const fallbackPortfolioBacktest: PortfolioBacktest = {
  live: false,
  lastUpdated: new Date().toISOString(),
  warnings: ["Live data unavailable. Displaying fallback sample data for demonstration."],
  tickers: ["QTWO", "NCNO", "ALKT", "MQ", "FIS", "GPN", "SPY"],
  provider: "Fallback sample data",
  failedTickers: [],
  prices: {},
  series: [
    { date: "2020-01-02", portfolio: 10000, spy: 10000, drawdown: 0 },
    { date: "2021-01-04", portfolio: 12250, spy: 11800, drawdown: -0.08 },
    { date: "2022-01-03", portfolio: 9100, spy: 12600, drawdown: -0.31 },
    { date: "2023-01-03", portfolio: 10600, spy: 11250, drawdown: -0.22 },
    { date: "2024-01-02", portfolio: 13800, spy: 13850, drawdown: -0.06 },
    { date: "2025-01-02", portfolio: 15400, spy: 16200, drawdown: -0.02 },
    { date: "2026-06-19", portfolio: 17100, spy: 18100, drawdown: -0.04 }
  ],
  monthlyReturns: [
    { month: "2026-01", return: 0.041 },
    { month: "2026-02", return: -0.024 },
    { month: "2026-03", return: 0.018 },
    { month: "2026-04", return: 0.031 },
    { month: "2026-05", return: -0.011 }
  ],
  correlation: [],
  metrics: {
    cumulativeReturn: 0.71,
    annualizedReturn: 0.087,
    annualizedVolatility: 0.31,
    sharpeRatio: 0.15,
    maxDrawdown: -0.42,
    betaVsSpy: 1.35,
    bestMonth: 0.18,
    worstMonth: -0.22
  }
};
