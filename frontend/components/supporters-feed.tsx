"use client";

import { useMemo } from "react";
import { useRecentSupporters } from "../hooks/useSupporters";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const timeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const ranges = [
    { unit: "year", value: 60 * 24 * 365 },
    { unit: "month", value: 60 * 24 * 30 },
    { unit: "week", value: 60 * 24 * 7 },
    { unit: "day", value: 60 * 24 },
    { unit: "hour", value: 60 },
    { unit: "minute", value: 1 },
  ] as const;

  for (const range of ranges) {
    if (Math.abs(diffMinutes) >= range.value || range.unit === "minute") {
      return timeFormatter.format(
        Math.round(diffMinutes / range.value),
        range.unit
      );
    }
  }
  return "just now";
}

export function SupportersFeed() {
  const { data, isLoading, isError, refetch } = useRecentSupporters(8);

  const totalRaised = useMemo(() => {
    if (!data) return 0;
    return data.reduce((sum, supporter) => sum + supporter.amount, 0);
  }, [data]);

  return (
    <section className="rounded-3xl border border-zinc-100 bg-white/70 p-6 shadow-lg shadow-zinc-100/80 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            Community love
          </p>
          <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            {currency.format(totalRaised)}
          </h3>
          <p className="text-sm text-zinc-500">raised by recent supporters</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full border border-zinc-200 px-4 py-1 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
        >
          Refresh
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 animate-pulse rounded-2xl bg-zinc-100 dark:bg-white/10"
            />
          ))}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-600 dark:border-rose-400/40 dark:bg-rose-400/10 dark:text-rose-100">
            Unable to load supporters. Please try again.
          </div>
        )}
        {!isLoading && !isError && data && data.length === 0 && (
          <p className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500 dark:bg-white/5 dark:text-white/60">
            No supporters yet. Be the first to donate!
          </p>
        )}
        {!isLoading &&
          !isError &&
          data?.map((supporter) => (
            <article
              key={supporter._id}
              className="flex items-center justify-between rounded-2xl border border-transparent bg-linear-to-r from-white to-zinc-50 px-5 py-4 shadow-sm shadow-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md dark:from-white/5 dark:to-white/10 dark:shadow-black/40"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {supporter.name || "Anonymous"}
                </p>
                {supporter.message && (
                  <p className="text-sm text-zinc-500 dark:text-white/70">
                    {supporter.message}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  {currency.format(supporter.amount)}
                </p>
                <p className="text-xs text-zinc-400">
                  {getRelativeTime(supporter.createdAt)}
                </p>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
