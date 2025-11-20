"use client";

import { DonationForm } from "../components/donation-form";
import { SupportersFeed } from "../components/supporters-feed";

const stats = [
  { label: "Active donors", value: "1,482" },
  { label: "Monthly goal", value: "$50k" },
  { label: "Projects funded", value: "38" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-white px-6 py-12 font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 sm:px-10">
      <main className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-2xl shadow-emerald-100/70 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            Donation HQ
          </p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-5xl">
                Power movements that matter
              </h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-white/70">
                Coordinate supporters, view live impact, and create donation
                intents without leaving this dashboard.
              </p>
            </div>
            <div className="grid w-full max-w-sm grid-cols-3 gap-3 rounded-3xl border border-emerald-100 bg-white/90 p-4 text-center text-sm font-semibold text-zinc-800 shadow-lg shadow-emerald-100 dark:border-white/10 dark:bg-white/10 dark:text-white">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <DonationForm />
          <div className="flex flex-col gap-6">
            <SupportersFeed />
            <div className="rounded-3xl border border-zinc-100 bg-linear-to-br from-emerald-500 to-emerald-400 p-6 text-white shadow-xl shadow-emerald-300/50 dark:border-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Upcoming
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                Saved cards dashboard
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Soon you’ll be able to browse supporters’ saved payment methods,
                launch setup intents, and manage recurring contributions here.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
