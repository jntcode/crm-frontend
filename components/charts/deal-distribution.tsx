"use client";

import { useI18n } from "@/lib/i18n/context";
import { PipelineBreakdown } from "@/types/email";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#64748b", "#38bdf8", "#a78bfa", "#fbbf24", "#34d399", "#fb7185"];

export function DealDistribution({ data }: { data: PipelineBreakdown }) {
  const { t } = useI18n();

  const chartData = [
    { name: t("new"), count: data.new },
    { name: t("contacted"), count: data.contacted },
    { name: t("qualified"), count: data.qualified },
    { name: t("proposal"), count: data.proposal },
    { name: t("won"), count: data.won },
    { name: t("lost"), count: data.lost },
  ];

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              backgroundColor: "#1e2030",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#f5f5f5",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
