"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, Database, FileText, Gauge, LineChart, Menu, PieChart, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: BarChart3 },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/sec", label: "SEC Data", icon: Database },
  { href: "/dcf", label: "DCF", icon: LineChart },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/macro", label: "Macro", icon: Gauge },
  { href: "/assumptions", label: "Assumptions", icon: FileText },
  { href: "/sources", label: "Sources", icon: FileText }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slateLine bg-white/90 shadow-[0_8px_30px_rgba(11,20,32,0.06)] backdrop-blur">
      <nav className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-navy text-sm font-bold text-white shadow-soft">Q2</div>
          <div>
            <p className="text-sm font-bold text-ink">QTWO Dashboard</p>
            <p className="text-xs text-slate-600">Intrinsic Value & Risk</p>
          </div>
        </Link>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded border border-slateLine bg-white text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
        <div
          className={cn(
            "absolute left-0 right-0 top-16 hidden border-b border-slateLine bg-white px-4 py-3 shadow-soft md:static md:flex md:border-0 md:bg-transparent md:p-0 md:shadow-none",
            open && "block"
          )}
        >
          <div className="page-shell grid gap-2 md:mx-0 md:flex md:w-auto md:flex-wrap md:justify-end md:gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-mist hover:text-ink",
                    active && "bg-navy text-white shadow-sm hover:bg-navy hover:text-white"
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
