"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { RevenueFcfChart, ValueBridgeChart } from "@/components/DashboardCharts";
import { SourceNote } from "@/components/SourceNote";
import { formatCurrency, formatPercent } from "@/lib/format";
import { runDcf } from "@/lib/models/dcf";
import type { DcfAssumptions } from "@/lib/types";

export function DcfDashboard({
  initialAssumptions,
  currentSharePrice,
  updated,
  live
}: {
  initialAssumptions: DcfAssumptions;
  currentSharePrice: number;
  updated: string;
  live: boolean;
}) {
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const result = useMemo(() => runDcf(assumptions, currentSharePrice || 75), [assumptions, currentSharePrice]);
  const bridge = [
    { label: "PV FCF", value: result.rows.reduce((sum, row) => sum + row.presentValue, 0) },
    { label: "PV Terminal", value: result.presentValueTerminal },
    { label: "Debt", value: -assumptions.debt },
    { label: "Cash", value: assumptions.cash },
    { label: "Equity Value", value: result.equityValue }
  ];
  const setNumber = (key: keyof DcfAssumptions, value: number) => setAssumptions((current) => ({ ...current, [key]: value }));
  const setGrowth = (index: number, value: number) =>
    setAssumptions((current) => ({
      ...current,
      revenueGrowth: current.revenueGrowth.map((growth, growthIndex) => (growthIndex === index ? value : growth))
    }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Implied DCF share price" value={formatCurrency(result.impliedSharePrice, false)} subtitle="Base-case intrinsic value output" tone="accent" />
        <DashboardCard title="Current market price" value={formatCurrency(currentSharePrice || 75, false)} subtitle="Market price data provider: yfinance/Yahoo chart endpoint" />
        <DashboardCard title="Upside/downside" value={formatPercent(result.upsideDownside)} subtitle="Implied price vs current price" tone={result.upsideDownside >= 0 ? "positive" : "negative"} />
        <DashboardCard title="Margin of safety" value={formatPercent(result.marginOfSafety)} subtitle="Discount between market price and DCF value" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Editable Assumptions</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Main drivers: revenue growth, terminal growth, FCF margin, WACC, cash, debt, and diluted shares.
          </p>
          <div className="mt-4 grid gap-3">
            <NumberInput label="Starting revenue" value={assumptions.startingRevenue} scale={1_000_000} suffix="M" onChange={(value) => setNumber("startingRevenue", value * 1_000_000)} />
            {assumptions.revenueGrowth.map((growth, index) => (
              <NumberInput key={index} label={`Revenue growth Y${index + 1}`} value={growth} scale={0.01} suffix="%" onChange={(value) => setGrowth(index, value / 100)} />
            ))}
            <NumberInput label="Terminal growth" value={assumptions.terminalGrowth} scale={0.01} suffix="%" onChange={(value) => setNumber("terminalGrowth", value / 100)} />
            <NumberInput label="Target FCF margin" value={assumptions.targetFcfMargin} scale={0.01} suffix="%" onChange={(value) => setNumber("targetFcfMargin", value / 100)} />
            <NumberInput label="Risk-free rate" value={assumptions.riskFreeRate} scale={0.01} suffix="%" onChange={(value) => setNumber("riskFreeRate", value / 100)} />
            <NumberInput label="Equity risk premium" value={assumptions.equityRiskPremium} scale={0.01} suffix="%" onChange={(value) => setNumber("equityRiskPremium", value / 100)} />
            <NumberInput label="Beta" value={assumptions.beta} scale={1} suffix="" onChange={(value) => setNumber("beta", value)} />
            <NumberInput label="Debt" value={assumptions.debt} scale={1_000_000} suffix="M" onChange={(value) => setNumber("debt", value * 1_000_000)} />
            <NumberInput label="Cash" value={assumptions.cash} scale={1_000_000} suffix="M" onChange={(value) => setNumber("cash", value * 1_000_000)} />
            <NumberInput label="Diluted shares" value={assumptions.dilutedShares} scale={1_000_000} suffix="M" onChange={(value) => setNumber("dilutedShares", value * 1_000_000)} />
          </div>
          <div className="mt-5 grid gap-3 rounded bg-mist p-4 text-sm leading-6 text-slate-700">
            <HelperText term="WACC" copy="Discount rate used to convert future cash flows into today's value." />
            <HelperText term="Terminal growth" copy="Long-term growth rate after the explicit forecast period." />
            <HelperText term="Free cash flow" copy="Cash flow available after operating needs and reinvestment." />
            <HelperText term="Margin of safety" copy="Gap between estimated intrinsic value and market price." />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel p-5">
            <h2 className="text-lg font-bold text-ink">Revenue and FCF Forecast</h2>
            <RevenueFcfChart data={result.rows} />
            <SourceNote source="SEC EDGAR, Treasury, and model assumptions" updated={updated} live={live} />
          </div>
          <div className="panel p-5">
            <h2 className="text-lg font-bold text-ink">DCF Value Bridge</h2>
            <ValueBridgeChart data={bridge} />
            <SourceNote source="Discounted cash flow model" updated={updated} live={live} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="WACC" value={formatPercent(result.wacc)} subtitle={`Cost of equity ${formatPercent(result.costOfEquity)}`} />
        <DashboardCard title="Enterprise value" value={formatCurrency(result.enterpriseValue)} subtitle="PV of forecast FCF plus terminal value" />
        <DashboardCard title="Equity value" value={formatCurrency(result.equityValue)} subtitle="Enterprise value less debt plus cash" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <SensitivityTable title="WACC vs Terminal Growth" rows={[-0.01, 0, 0.01].map((waccDelta) => ({ label: `${formatPercent(result.wacc + waccDelta)}`, values: [0.02, 0.03, 0.04].map((terminalGrowth) => runDcf({ ...assumptions, terminalGrowth, riskFreeRate: assumptions.riskFreeRate + waccDelta }, currentSharePrice || 75).impliedSharePrice) }))} columns={["2.0%", "3.0%", "4.0%"]} />
        <SensitivityTable title="Growth vs FCF Margin" rows={[0.08, 0.1, 0.12].map((growth) => ({ label: formatPercent(growth), values: [0.18, 0.22, 0.26].map((margin) => runDcf({ ...assumptions, revenueGrowth: assumptions.revenueGrowth.map(() => growth), targetFcfMargin: margin }, currentSharePrice || 75).impliedSharePrice) }))} columns={["18%", "22%", "26%"]} />
        <SensitivityTable title="Bull/Base/Bear Cases" rows={[
          { label: "Bear", values: [runDcf({ ...assumptions, revenueGrowth: assumptions.revenueGrowth.map((g) => g - 0.03), targetFcfMargin: 0.18 }, currentSharePrice || 75).impliedSharePrice] },
          { label: "Base", values: [result.impliedSharePrice] },
          { label: "Bull", values: [runDcf({ ...assumptions, revenueGrowth: assumptions.revenueGrowth.map((g) => g + 0.03), targetFcfMargin: 0.26 }, currentSharePrice || 75).impliedSharePrice] }
        ]} columns={["Implied Price"]} />
      </section>
    </div>
  );
}

function NumberInput({ label, value, scale, suffix, onChange }: { label: string; value: number; scale: number; suffix: string; onChange: (value: number) => void }) {
  const displayValue = scale === 0.01 ? value * 100 : value / scale;
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-700">
      {label}
      <div className="flex items-center overflow-hidden rounded border border-slateLine bg-white">
        <input className="w-full px-3 py-2 outline-none" type="number" step="0.1" value={Number(displayValue.toFixed(2))} onChange={(event) => onChange(Number(event.target.value))} />
        {suffix ? <span className="px-3 text-slate-500">{suffix}</span> : null}
      </div>
    </label>
  );
}

function SensitivityTable({ title, rows, columns }: { title: string; rows: Array<{ label: string; values: number[] }>; columns: string[] }) {
  return (
    <div className="panel p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="table-scroll mt-4">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Case</th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={index}>{formatCurrency(value, false)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HelperText({ term, copy }: { term: string; copy: string }) {
  return (
    <p>
      <span className="font-bold text-ink">{term}:</span> {copy}
    </p>
  );
}
