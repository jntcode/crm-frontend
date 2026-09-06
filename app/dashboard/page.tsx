"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { getAuthSession } from "@/lib/auth";
import { getDashboardStats, getPipelineBreakdown } from "@/lib/dashboard";
import { DashboardStats, PipelineBreakdown } from "@/types/email";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { useQuery } from "@tanstack/react-query";
import { getActivities } from "@/lib/activities";
import { Activity } from "@/types/activity";

const PipelineDonut = lazy(() => import("@/components/charts/pipeline-donut").then(m => ({ default: m.PipelineDonut })));
const DealDistribution = lazy(() => import("@/components/charts/deal-distribution").then(m => ({ default: m.DealDistribution })));
const ConversionFunnel = lazy(() => import("@/components/charts/conversion-funnel").then(m => ({ default: m.ConversionFunnel })));

function useAnimatedCounter(end: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let current = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, start]);

  return count;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.15 + i * 0.08, ease: "easeOut" as const },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const session = getAuthSession();
  const { t } = useI18n();

  const { data: stats, isLoading: statsLoading, isFetching: statsFetching, error: statsError, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    placeholderData: (prev) => prev,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const { data: pipeline, isLoading: pipelineLoading, isFetching: pipelineFetching, error: pipelineError } = useQuery<PipelineBreakdown>({
    queryKey: ["pipeline-breakdown"],
    queryFn: getPipelineBreakdown,
    placeholderData: (prev) => prev,
  });

  const { data: activities = [], isFetching: activitiesFetching } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: getActivities,
    placeholderData: (prev) => prev,
  });

  const loading = statsLoading || pipelineLoading;
  const refreshing = statsFetching || pipelineFetching || activitiesFetching;
  const hasError = statsError || pipelineError;

  const animatedContacts = useAnimatedCounter(stats?.totalCustomers ?? 0, 1800, !loading);
  const animatedDeals = useAnimatedCounter(stats?.totalDeals ?? 0, 1800, !loading);
  const animatedTasks = useAnimatedCounter(stats?.openTasks ?? 0, 1800, !loading);
  const animatedEmails = useAnimatedCounter(stats?.totalEmails ?? 0, 1800, !loading);
  const animatedRevenue = useAnimatedCounter(stats?.monthlyRevenue ?? 0, 1800, !loading);
  const animatedConversion = useAnimatedCounter(stats?.conversionRate ?? 0, 1800, !loading);

  const statCards = stats
    ? [
        {
          label: t("totalContacts"),
          value: animatedContacts.toLocaleString(),
          href: "/contacts",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          ),
          color: "from-sky-500/20 to-sky-600/5",
          accent: "text-sky-400",
          border: "border-sky-500/20",
        },
        {
          label: t("openDeals"),
          value: animatedDeals.toLocaleString(),
          href: "/leads",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: "from-violet-500/20 to-violet-600/5",
          accent: "text-violet-400",
          border: "border-violet-500/20",
        },
        {
          label: t("openTasks"),
          value: animatedTasks.toLocaleString(),
          href: "/tasks",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: "from-amber-500/20 to-amber-600/5",
          accent: "text-amber-400",
          border: "border-amber-500/20",
        },
        {
          label: t("totalEmails"),
          value: animatedEmails.toLocaleString(),
          href: "/emails",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          ),
          color: "from-emerald-500/20 to-emerald-600/5",
          accent: "text-emerald-400",
          border: "border-emerald-500/20",
        },
        {
          label: t("monthlyRevenue"),
          value: `$${animatedRevenue.toLocaleString()}`,
          href: "/reports",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          ),
          color: "from-rose-500/20 to-rose-600/5",
          accent: "text-rose-400",
          border: "border-rose-500/20",
        },
        {
          label: t("conversionRate"),
          value: `${animatedConversion}%`,
          href: "/reports",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          ),
          color: "from-indigo-500/20 to-indigo-600/5",
          accent: "text-indigo-400",
          border: "border-indigo-500/20",
        },
      ]
    : [];

  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? t("goodMorning") : hours < 18 ? t("goodAfternoon") : t("goodEvening");
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <div className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80"
              alt=""
              className="w-full h-full object-cover opacity-[0.12]"
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 px-8 py-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] mb-2">
                {t("crmWorkspace")}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-2">
                {greeting}, {session?.name?.split(" ")[0] ?? "there"}
              </h1>
              <p className="text-[var(--muted)] text-sm">{dateStr}</p>
            </motion.div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
          {refreshing && !loading && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 px-4 py-2 text-xs text-[var(--muted)]">
              <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Refreshing data...
            </div>
          )}
          {loading ? (
            hasError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-2xl mb-3">⚠</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Unable to connect</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">The server may be starting up. Please try again.</p>
                <button
                  onClick={() => refetchStats()}
                  className="mt-4 rounded-xl bg-[var(--button)] px-5 py-2 text-sm font-semibold text-[var(--button-text)] hover:opacity-90 transition"
                >
                  Retry
                </button>
              </div>
            ) : (
            <div className="space-y-6">
              {/* Show a helpful message during initial load */}
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-6 py-4">
                <div className="h-3 w-3 rounded-full bg-[var(--accent)] animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Connecting to server...</p>
                  <p className="text-xs text-[var(--muted)]">This may take a moment on first visit</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-[var(--panel)] animate-pulse" />
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-[var(--panel)] animate-pulse" />
                ))}
              </div>
            </div>
            )
          ) : (
            <>
              {/* Stat cards - show immediately when stats load */}
              <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {statCards.map((item, i) => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} p-5 hover:translate-y-[-2px] transition-transform duration-200 cursor-pointer block`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-[var(--panel)] flex items-center justify-center ${item.accent} mb-3`}>
                        {item.icon}
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-1">
                        {item.label}
                      </p>
                      <h2 className="text-2xl font-bold text-[var(--foreground)]">{item.value}</h2>
                    </motion.div>
                  </Link>
                ))}
              </section>

              {pipeline && (
                <section className="mb-8 grid gap-6 lg:grid-cols-3">
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
                  >
                    <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">{t("pipelineOverview")}</h2>
                    <Suspense fallback={<div className="h-48 rounded-xl bg-[var(--soft)] animate-pulse" />}>
                      <PipelineDonut data={pipeline} />
                    </Suspense>
                  </motion.div>

                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
                  >
                    <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">{t("dealDistribution")}</h2>
                    <Suspense fallback={<div className="h-48 rounded-xl bg-[var(--soft)] animate-pulse" />}>
                      <DealDistribution data={pipeline} />
                    </Suspense>
                  </motion.div>

                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
                  >
                    <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">{t("conversionFunnel")}</h2>
                    <Suspense fallback={<div className="h-48 rounded-xl bg-[var(--soft)] animate-pulse" />}>
                      <ConversionFunnel data={pipeline} />
                    </Suspense>
                  </motion.div>
                </section>
              )}

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
                >
                  <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">{t("pipelineBreakdown")}</h2>
                  <div className="space-y-4">
                    {pipeline && (() => {
                      const bars = [
                        { label: t("new"), value: pipeline.new, color: "from-slate-400 to-slate-500" },
                        { label: t("contacted"), value: pipeline.contacted, color: "from-sky-400 to-sky-500" },
                        { label: t("qualified"), value: pipeline.qualified, color: "from-violet-400 to-violet-500" },
                        { label: t("proposal"), value: pipeline.proposal, color: "from-amber-400 to-amber-500" },
                        { label: t("won"), value: pipeline.won, color: "from-emerald-400 to-emerald-500" },
                        { label: t("lost"), value: pipeline.lost, color: "from-rose-400 to-rose-500" },
                      ];
                      const maxP = Math.max(...bars.map((b) => b.value), 1);
                      return bars.map((bar) => (
                        <div key={bar.label}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="text-[var(--foreground)] font-medium">{bar.label}</span>
                            <span className="text-[var(--muted)]">{bar.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--soft)]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(bar.value / maxP) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </motion.div>

                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
                >
                  <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">{t("quickActions")}</h2>
                  <div className="space-y-3">
                    <Link
                      href="/contacts"
                      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                      </div>
                      {t("addContact")}
                    </Link>
                    <Link
                      href="/leads"
                      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {t("createDeal")}
                    </Link>
                    <Link
                      href="/activities"
                      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {t("logActivity")}
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity Feed */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.9 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h2>
                  <Link href="/activities" className="text-xs font-medium text-[var(--accent)] hover:underline">View all</Link>
                </div>
                {activities.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No activities yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => {
                      const icons: Record<string, string> = { CALL: "☎️", EMAIL: "📧", MEETING: "👥", NOTE: "📝" };
                      const colors: Record<string, string> = { CALL: "bg-blue-500/10 text-blue-300", EMAIL: "bg-purple-500/10 text-purple-300", MEETING: "bg-amber-500/10 text-amber-300", NOTE: "bg-slate-500/10 text-slate-300" };
                      return (
                        <div key={activity.id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--soft)] p-3">
                          <div className="text-xl">{icons[activity.type]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">{activity.title}</p>
                            <p className="text-xs text-[var(--muted)] truncate">{activity.description}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${colors[activity.type]}`}>
                            {activity.type}
                          </span>
                          <span className="shrink-0 text-[10px] text-[var(--muted)]">
                            {new Date(activity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
