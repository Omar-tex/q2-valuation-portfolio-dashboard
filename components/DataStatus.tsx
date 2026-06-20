import { SourceNote } from "@/components/SourceNote";

export function DataStatus({
  source,
  href,
  updated,
  live,
  note,
  liveLabel = "Using live data",
  fallbackLabel = "Using fallback sample data"
}: {
  source: string;
  href?: string;
  updated: string;
  live: boolean;
  note?: string;
  liveLabel?: string;
  fallbackLabel?: string;
}) {
  return (
    <div className="panel p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Data Transparency</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {note ?? "Data is pulled from public sources and displayed with timestamp and source labeling."}
          </p>
        </div>
        <span className={live ? "rounded bg-emerald-50 px-3 py-1 text-sm font-bold text-financeGreen" : "rounded bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700"}>
          {live ? liveLabel : fallbackLabel}
        </span>
      </div>
      <SourceNote
        source={source}
        href={href}
        updated={updated}
        live={live}
        liveLabel={liveLabel}
        fallbackLabel={fallbackLabel}
      />
    </div>
  );
}
