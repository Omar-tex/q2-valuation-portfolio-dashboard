import Link from "next/link";
import { ArrowRight, Database, Gauge, LineChart, PieChart, ShieldCheck, Table2 } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Disclaimer } from "@/components/Disclaimer";
import { DATA_SOURCES } from "@/lib/constants";

export default function HomePage() {
  const features = [
    { title: "Live SEC filing data", icon: Database, copy: "Server-side EDGAR company facts and latest 10-K/10-Q metadata." },
    { title: "DCF valuation model", icon: LineChart, copy: "Editable revenue, FCF, WACC, terminal value, and share price assumptions." },
    { title: "Treasury-based discount rate", icon: Gauge, copy: "Uses the latest 10-year Treasury rate as the risk-free rate input." },
    { title: "Sensitivity analysis", icon: Table2, copy: "WACC, terminal growth, revenue growth, FCF margin, and bull/base/bear cases." },
    { title: "Peer portfolio backtesting", icon: PieChart, copy: "QTWO, NCNO, ALKT, MQ, FIS, GPN, and SPY with risk/return analytics." },
    { title: "Source-labeled outputs", icon: ShieldCheck, copy: "Source notes, timestamps, and fallback warnings are visible in the UI." }
  ];
  return (
    <>
      <section className="bg-ink text-white">
        <div className="page-shell grid gap-8 py-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">Investor-style finance portfolio project | NYSE: QTWO</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Q2 Holdings Intrinsic Value & Portfolio Risk Dashboard
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
              A professional financial modeling website that pulls public company data, builds a DCF valuation
              model, compares Q2 to fintech and banking software peers, and adds portfolio backtesting with
              macro context.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dcf" className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-3 text-sm font-bold text-ink">
                Open DCF Model <ArrowRight size={17} />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 rounded border border-white/30 px-5 py-3 text-sm font-bold text-white">
                View Backtest <PieChart size={17} />
              </Link>
            </div>
          </div>
          <div className="rounded border border-white/10 bg-white/6 p-5 shadow-soft backdrop-blur">
            <p className="text-sm font-bold uppercase text-slate-300">Why Q2 Holdings?</p>
            <p className="mt-3 text-2xl font-bold">A niche fintech infrastructure company tied directly to banking software.</p>
            <p className="mt-4 leading-7 text-slate-200">
              Q2 provides cloud-based digital banking, lending, fraud/risk, and customer engagement software to banks,
              credit unions, fintechs, and alternative finance companies. That makes QTWO a useful bridge between
              public-company valuation, bank technology, credit workflows, and portfolio analysis.
            </p>
            <a className="mt-5 inline-block text-sm font-bold text-emerald-300 hover:underline" href={DATA_SOURCES.q2InvestorRelations} target="_blank" rel="noreferrer">
              Q2 Investor Relations
            </a>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-6 max-w-3xl">
          <p className="section-kicker">Core Dashboard Modules</p>
          <h2 className="mt-2 text-2xl font-bold text-ink md:text-3xl">Built to show valuation judgment, data cleaning, and risk analysis.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <DashboardCard key={feature.title} title={feature.title} subtitle={feature.copy}>
              <feature.icon className="text-financeBlue" size={24} />
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="soft-band py-12">
        <div className="page-shell grid gap-6 lg:grid-cols-3">
          <DashboardCard title="Finance skills shown" subtitle="SEC data cleaning, DCF modeling, WACC, sensitivity analysis, public markets, and source documentation." />
          <DashboardCard title="Target roles" subtitle="Finance, banking, credit analyst, financial analyst, wealth management, and portfolio research roles." />
          <DashboardCard title="Project standard" subtitle="Built as an investor-style dashboard with typed calculations, tests, and clear local setup instructions." />
        </div>
      </section>

      <section className="page-shell py-8">
        <Disclaimer />
      </section>
    </>
  );
}
