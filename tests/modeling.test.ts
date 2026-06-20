import assert from "node:assert/strict";
import test from "node:test";
import { calculateCostOfEquity, calculateWacc, projectFreeCashFlow, runDcf } from "../lib/models/dcf";
import { annualizedReturn, maxDrawdown, weightedPortfolioReturns } from "../lib/models/portfolio";
import type { DcfAssumptions } from "../lib/types";

const assumptions: DcfAssumptions = {
  startingRevenue: 100,
  revenueGrowth: [0.1, 0.1],
  terminalGrowth: 0.03,
  startingFcfMargin: 0.1,
  targetFcfMargin: 0.2,
  taxRate: 0.21,
  depreciationPctRevenue: 0.04,
  capexPctRevenue: 0.03,
  workingCapitalPctRevenue: 0.02,
  riskFreeRate: 0.04,
  equityRiskPremium: 0.055,
  beta: 1.2,
  costOfDebt: 0.06,
  debt: 20,
  cash: 10,
  dilutedShares: 10
};

test("calculates cost of equity using CAPM", () => {
  assert.equal(calculateCostOfEquity(0.04, 1.2, 0.055).toFixed(3), "0.106");
});

test("calculates WACC with after-tax debt cost", () => {
  const wacc = calculateWacc({ marketValueEquity: 100, debt: 50, costOfEquity: 0.1, costOfDebt: 0.06, taxRate: 0.21 });
  assert.equal(wacc.toFixed(4), "0.0825");
});

test("projects free cash flow from revenue and margin assumptions", () => {
  const rows = projectFreeCashFlow(assumptions);
  assert.equal(rows[0].revenue.toFixed(2), "110.00");
  assert.equal(rows[1].freeCashFlow.toFixed(2), "24.20");
});

test("DCF returns positive enterprise value and implied share price", () => {
  const result = runDcf(assumptions, 12);
  assert.ok(result.enterpriseValue > 0);
  assert.ok(result.impliedSharePrice > 0);
});

test("calculates portfolio return from weighted asset returns", () => {
  const returns = weightedPortfolioReturns(
    {
      A: [
        { date: "2026-01-02", return: 0.1 },
        { date: "2026-01-03", return: -0.05 }
      ],
      B: [
        { date: "2026-01-02", return: 0.02 },
        { date: "2026-01-03", return: 0.04 }
      ]
    },
    { A: 0.6, B: 0.4 }
  );
  assert.equal(returns[0].return.toFixed(3), "0.068");
  assert.equal(returns[1].return.toFixed(3), "-0.014");
});

test("calculates max drawdown", () => {
  assert.equal(maxDrawdown([100, 120, 90, 150, 135]).toFixed(2), "-0.25");
});

test("annualizes cumulative return", () => {
  assert.equal(annualizedReturn(0.1, 252).toFixed(3), "0.100");
});
