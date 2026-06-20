"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const moneyTick = (value: number) => {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value / 1_000_000).toFixed(0)}M`;
};
const pctTick = (value: number) => `${(value * 100).toFixed(0)}%`;
const dateTick = (value: string) => {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
};
const monthTick = (value: string) => {
  const [year, month] = String(value).split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
};

export function RevenueFcfChart({ data }: { data: Array<{ year: number; revenue: number; freeCashFlow: number }> }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={moneyTick} />
          <Tooltip formatter={(value: number) => moneyTick(value)} />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Line dataKey="freeCashFlow" name="Free Cash Flow" stroke="#1f8a5b" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ValueBridgeChart({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={moneyTick} />
          <Tooltip formatter={(value: number) => moneyTick(value)} />
          <Bar dataKey="value" fill="#0f2742" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PortfolioChart({ data }: { data: Array<{ date: string; portfolio: number; spy: number }> }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="date" minTickGap={34} tickFormatter={dateTick} />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} labelFormatter={dateTick} />
          <Legend />
          <Line type="monotone" dataKey="portfolio" name="Selected Portfolio" stroke="#2563eb" dot={false} strokeWidth={3} />
          <Line type="monotone" dataKey="spy" name="SPY Benchmark" stroke="#1f8a5b" dot={false} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DrawdownChart({ data }: { data: Array<{ date: string; drawdown: number }> }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="date" minTickGap={40} tickFormatter={dateTick} />
          <YAxis tickFormatter={pctTick} />
          <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} labelFormatter={dateTick} />
          <Bar dataKey="drawdown" fill="#b91c1c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyReturnsChart({ data }: { data: Array<{ month: string; return: number }> }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(-36)}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="month" minTickGap={24} tickFormatter={monthTick} />
          <YAxis tickFormatter={pctTick} />
          <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} labelFormatter={monthTick} />
          <Bar dataKey="return" radius={[4, 4, 0, 0]}>
            {data.slice(-36).map((entry) => (
              <Cell key={entry.month} fill={entry.return >= 0 ? "#1f8a5b" : "#b91c1c"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MacroChart({ data, kind }: { data: any[]; kind: "rates" | "cpi" }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#d8e0e8" />
          <XAxis dataKey="date" minTickGap={28} tickFormatter={dateTick} />
          <YAxis yAxisId="left" tickFormatter={kind === "rates" ? pctTick : undefined} />
          {kind === "cpi" ? <YAxis yAxisId="right" orientation="right" tickFormatter={pctTick} /> : null}
          <Tooltip
            labelFormatter={dateTick}
            formatter={(value: number, name: string) => {
              if (name === "YoY Inflation" || kind === "rates") return `${(value * 100).toFixed(2)}%`;
              return value.toFixed(2);
            }}
          />
          <Legend />
          {kind === "rates" ? (
            <>
              <Line yAxisId="left" dataKey="tenYear" name="10Y Treasury" stroke="#2563eb" dot={false} strokeWidth={3} />
              <Line yAxisId="left" dataKey="twoYear" name="2Y Treasury" stroke="#1f8a5b" dot={false} strokeWidth={3} />
            </>
          ) : (
            <>
              <Line yAxisId="left" dataKey="cpi" name="CPIAUCSL" stroke="#2563eb" dot={false} strokeWidth={3} />
              <Line yAxisId="right" dataKey="yoy" name="YoY Inflation" stroke="#1f8a5b" dot={false} strokeWidth={3} connectNulls={false} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
