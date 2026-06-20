import "server-only";
import { DATA_SOURCES } from "@/lib/constants";
import { fallbackMacroSnapshot } from "@/lib/fallbackData";
import type { MacroSnapshot } from "@/lib/types";

export async function getMacroSnapshot(): Promise<MacroSnapshot> {
  try {
    const [treasuryRes, cpiRes] = await Promise.all([
      fetch(DATA_SOURCES.treasuryXml, { next: { revalidate: 60 * 60 * 12 } }),
      fetch(DATA_SOURCES.fredCpiCsv, { next: { revalidate: 60 * 60 * 12 } })
    ]);
    if (!treasuryRes.ok || !cpiRes.ok) throw new Error("Macro request failed");
    const treasuryText = await treasuryRes.text();
    const cpiCsv = await cpiRes.text();
    const treasuryTrend = parseTreasuryXml(treasuryText).slice(-90);
    const cpiTrend = parseCpi(cpiCsv).slice(-120);
    const latestRates = treasuryTrend[treasuryTrend.length - 1];
    const latestCpi = cpiTrend[cpiTrend.length - 1];
    const latestCpiWithYoy = [...cpiTrend].reverse().find((row) => row.yoy !== null);
    return {
      live: true,
      lastUpdated: new Date().toISOString(),
      warnings: [],
      tenYear: latestRates.tenYear,
      twoYear: latestRates.twoYear,
      spread: latestRates.tenYear - latestRates.twoYear,
      cpiLatest: latestCpi.cpi,
      cpiYoY: latestCpiWithYoy?.yoy ?? 0,
      treasuryTrend,
      cpiTrend
    };
  } catch (error) {
    console.error("[macro] Unable to load live macro data", error);
    return fallbackMacroSnapshot;
  }
}

function parseTreasuryXml(xml: string) {
  const entries = xml.split("<entry>").slice(1);
  return entries
    .map((entry) => {
      const date = normalizeDate(match(entry, /<d:NEW_DATE[^>]*>(.*?)<\/d:NEW_DATE>/));
      const twoYear = Number(match(entry, /<d:BC_2YEAR[^>]*>(.*?)<\/d:BC_2YEAR>/)) / 100;
      const tenYear = Number(match(entry, /<d:BC_10YEAR[^>]*>(.*?)<\/d:BC_10YEAR>/)) / 100;
      return { date, twoYear, tenYear };
    })
    .filter((row) => row.date && Number.isFinite(row.twoYear) && Number.isFinite(row.tenYear));
}

function parseCpi(csv: string) {
  const rows = csv.trim().split(/\r?\n/).slice(1);
  const parsed = rows
    .map((row) => {
      const [rawDate, rawValue] = row.split(",");
      const date = normalizeDate(rawDate);
      const value = rawValue?.trim();
      if (!value || value === ".") return null;
      const cpi = Number(value);
      if (!date || !Number.isFinite(cpi) || cpi <= 0) return null;
      return { date, cpi, yoy: null as number | null };
    })
    .filter((row): row is { date: string; cpi: number; yoy: null } => row !== null);

  return parsed
    .map((row, index) => {
      const priorYear = parsed[index - 12];
      const yoy = priorYear?.cpi && priorYear.cpi > 0 ? row.cpi / priorYear.cpi - 1 : null;
      return { ...row, yoy };
    })
    .filter((row) => row.cpi > 0);
}

function normalizeDate(value: string | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  const dateOnly = trimmed.includes("T") ? trimmed.slice(0, 10) : trimmed;
  const timestamp = Date.parse(`${dateOnly}T00:00:00Z`);
  return Number.isNaN(timestamp) ? "" : new Date(timestamp).toISOString().slice(0, 10);
}

function match(text: string, regex: RegExp) {
  return text.match(regex)?.[1] ?? "";
}
