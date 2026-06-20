import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  value,
  subtitle,
  children,
  tone = "default"
}: {
  title: string;
  value?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: "default" | "positive" | "negative" | "accent";
}) {
  return (
    <div
      className={cn(
        "panel relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(11,20,32,0.12)]",
        tone === "accent" && "border-blue-200",
        tone === "positive" && "border-emerald-200",
        tone === "negative" && "border-red-200"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-slate-200",
          tone === "accent" && "bg-financeBlue",
          tone === "positive" && "bg-financeGreen",
          tone === "negative" && "bg-red-600"
        )}
      />
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 [overflow-wrap:anywhere]">{title}</p>
      {value ? (
        <p
          className={cn(
            "mt-2 text-2xl font-bold text-ink md:text-3xl [overflow-wrap:anywhere]",
            tone === "positive" && "text-financeGreen",
            tone === "negative" && "text-red-700"
          )}
        >
          {value}
        </p>
      ) : null}
      {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-600 [overflow-wrap:anywhere] sm:text-sm sm:leading-6">{subtitle}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
