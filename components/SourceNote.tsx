import { formatDateTime } from "@/lib/format";

export function SourceNote({
  source,
  href,
  updated,
  live,
  liveLabel = "Live data",
  fallbackLabel = "Fallback sample data"
}: {
  source: string;
  href?: string;
  updated?: string;
  live?: boolean;
  liveLabel?: string;
  fallbackLabel?: string;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-slateLine pt-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Source:{" "}
        {href ? (
          <a className="font-semibold text-financeBlue hover:underline" href={href} target="_blank" rel="noreferrer">
            {source}
          </a>
        ) : (
          <span className="font-semibold">{source}</span>
        )}
        {updated ? ` | Last updated: ${formatDateTime(updated)}` : null}
      </p>
      {typeof live === "boolean" ? (
        <span className={live ? "font-bold text-financeGreen" : "font-bold text-amber-700"}>
          {live ? liveLabel : fallbackLabel}
        </span>
      ) : null}
    </div>
  );
}
