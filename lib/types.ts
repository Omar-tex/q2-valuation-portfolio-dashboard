export type DataStatus = {
  live: boolean;
  lastUpdated: string;
  warnings: string[];
};

export type CompanyMetric = {
  label: string;
  value: number | null;
  unit: "usd" | "shares" | "number";
  fiscalYear?: number;
  fiscalPeriod?: string;
  filed?: string;
  sourceTag?: string;
};

export type CompanySnapshot = DataStatus & {
  ticker: "QTWO";
  latestFiling?: {
    form: string;
    filingDate: string;
    accessionNumber: string;
    reportDate?: string;
    url: string;
  };
  metrics: Record<
    | "revenue"
    | "netIncome"
    | "operatingCashFlow"
    | "capex"
    | "cash"
    | "assets"
    | "liabilities"
    | "equity"
    | "shares"
    | "stockBasedComp",
    CompanyMetric
  >;
  annualFinancials: FinancialPeriod[];
  quarterlyFinancials: FinancialPeriod[];
};

export type FinancialPeriod = {
  period: string;
  revenue: number | null;
  netIncome: number | null;
  operatingCashFlow: number | null;
  capex: number | null;
  cash: number | null;
  liabilities: number | null;
};

export type DcfAssumptions = {
  startingRevenue: number;
  revenueGrowth: number[];
  terminalGrowth: number;
  startingFcfMargin: number;
  targetFcfMargin: number;
  taxRate: number;
  depreciationPctRevenue: number;
  capexPctRevenue: number;
  workingCapitalPctRevenue: number;
  riskFreeRate: number;
  equityRiskPremium: number;
  beta: number;
  costOfDebt: number;
  debt: number;
  cash: number;
  dilutedShares: number;
};

export type DcfResult = {
  wacc: number;
  costOfEquity: number;
  rows: Array<{
    year: number;
    revenue: number;
    fcfMargin: number;
    freeCashFlow: number;
    discountFactor: number;
    presentValue: number;
  }>;
  terminalValue: number;
  presentValueTerminal: number;
  enterpriseValue: number;
  equityValue: number;
  impliedSharePrice: number;
  upsideDownside: number;
  marginOfSafety: number;
};

export type PricePoint = {
  date: string;
  close: number;
};

export type PortfolioBacktest = DataStatus & {
  tickers: string[];
  provider: "Yahoo" | "Stooq" | "Mixed live providers" | "Fallback sample data";
  failedTickers: string[];
  prices: Record<string, PricePoint[]>;
  series: Array<{ date: string; portfolio: number; spy: number; drawdown: number }>;
  monthlyReturns: Array<{ month: string; return: number }>;
  correlation: Array<{ assetA: string; assetB: string; value: number }>;
  metrics: {
    cumulativeReturn: number;
    annualizedReturn: number;
    annualizedVolatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    betaVsSpy: number;
    bestMonth: number;
    worstMonth: number;
  };
};

export type MacroSnapshot = DataStatus & {
  tenYear: number;
  twoYear: number;
  spread: number;
  cpiLatest: number;
  cpiYoY: number;
  treasuryTrend: Array<{ date: string; twoYear: number; tenYear: number }>;
  cpiTrend: Array<{ date: string; cpi: number; yoy: number | null }>;
};
