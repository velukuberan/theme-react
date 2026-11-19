import { BackendError } from "../backend/client";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

/** "19 Nov 2026" */
export const formatDate = (iso: string): string => dateFormat.format(new Date(iso));

/** "19 Nov 2026, 11:34 pm" (used for tooltips) */
export const formatDateTime = (iso: string): string => dateTimeFormat.format(new Date(iso));

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 hours ago", "yesterday", "just now" */
export function timeAgo(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** A message that's safe to show the user for any thrown error. */
export const errorMessage = (error: unknown): string =>
  error instanceof BackendError ? error.message : "Something went wrong. Please try again.";
