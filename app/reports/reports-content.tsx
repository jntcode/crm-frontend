"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { getDashboardStats, getPipelineBreakdown } from "@/lib/dashboard";
import { getLeads } from "@/lib/leads";
import { getActivities } from "@/lib/activities";
import { DashboardStats, PipelineBreakdown } from "@/types/email";
import { Lead } from "@/types/lead";
import { Activity } from "@/types/activity";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

function ReportsContent() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: pipeline } = useQuery<PipelineBreakdown>({
    queryKey: ["pipeline-breakdown"],
    queryFn: getPipelineBreakdown,
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const pipelineData = pipeline
    ? Object.entries(pipeline).map(([name, value]) => ({ name, value }))
    : [];

  const dealsByCompany = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.company] = (acc[lead.company] || 0) + lead.value;
    return acc;
  }, {});
  const companyData = Object.entries(dealsByCompany)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const activityTypes = activities.reduce<Record<string, number>>((acc, act) => {
    acc[act.type] = (acc[act.type] || 0) + 1;
    return acc;
  }, {});
  const activityData = Object.entries(activityTypes).map(([name, count]) => ({ name, count }));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="border-b border-[var(--border)] bg-[var(--panel)]">
          <div className="px-6 py-8 max-w-6xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Analytics</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Reports</h1>
          </div>
        </div>

        <div className="px-6 py-8 max-w-6xl mx-auto">
          {/* KPI Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Revenue", value: `$${(stats?.monthlyRevenue ?? 0).toLocaleString()}`, color: "from-emerald-500/20 to-emerald-600/10" },
              { label: "Win Rate", value: `${stats?.conversionRate ?? 0}%`, color: "from-sky-500/20 to-sky-600/10" },
              { label: "Open Deals", value: stats?.totalDeals ?? 0, color: "from-violet-500/20 to-violet-600/10" },
              { label: "Active Leads", value: leads.filter((l) => l.status !== "WON" && l.status !== "LOST").length, color: "from-amber-500/20 to-amber-600/10" },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${kpi.color} p-5`}
              >
                <p className="text-xs text-[var(--muted)]">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">{kpi.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { month: "Jan", revenue: 12400 },
                  { month: "Feb", revenue: 18200 },
                  { month: "Mar", revenue: 15800 },
                  { month: "Apr", revenue: 22400 },
                  { month: "May", revenue: 19600 },
                  { month: "Jun", revenue: stats?.monthlyRevenue ?? 24800 },
                ]}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pipeline Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Pipeline Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pipelineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {pipelineData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Deal Value by Company */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Deal Value by Company</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Activity Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Activity Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ReportsContent;
