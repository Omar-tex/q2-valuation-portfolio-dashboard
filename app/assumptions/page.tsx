import { Disclaimer } from "@/components/Disclaimer";

const sections = [
  ["What a DCF model is", "A DCF estimates a company value by forecasting future free cash flow and discounting those cash flows back to today."],
  ["Why revenue growth matters", "Revenue growth drives the size of the future business. For a software company, small growth changes can create large valuation changes."],
  ["Why free cash flow matters", "Free cash flow is cash left after operating needs and reinvestment. It is the cash a company can theoretically return to capital providers."],
  ["What WACC means", "WACC is the weighted average cost of capital. It is the return investors require for the risk of owning the business."],
  ["What terminal value means", "Terminal value estimates what the business is worth after the explicit forecast period, usually using a stable long-term growth assumption."],
  ["Why interest rates affect valuations", "Higher Treasury rates increase discount rates. That lowers the present value of future cash flows."],
  ["Why fintech software is rate sensitive", "High-growth software companies often have more value tied to future cash flows, so valuation can move sharply when discount rates change."]
];

export default function AssumptionsPage() {
  return (
    <section className="page-shell py-10">
      <p className="section-kicker">Model Assumptions</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-5xl">Plain-English valuation framework</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map(([title, copy]) => (
          <div key={title} className="panel p-5">
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <p className="mt-2 leading-7 text-slate-700">{copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </section>
  );
}
