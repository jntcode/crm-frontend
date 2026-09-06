"use client";

import { useI18n } from "@/lib/i18n/context";
import { PipelineBreakdown } from "@/types/email";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#64748b", "#38bdf8", "#a78bfa", "#fbbf24", "#34d399", "#fb7185"];

export function PipelineDonut({ data }: { data: PipelineBreakdown }) {
  const { t } = useI18n();

  const chartData = [
    { name: t("new"), value: data.new },
    { name: t("contacted"), value: data.contacted },
    { name: t("qualified"), value: data.qualified },
    { name: t("proposal"), value: data.proposal },
    { name: t("won"), value: data.won },
    { name: t("lost"), value: data.lost },
  ].filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e2030",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#f5f5f5",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value} (${((Number(value) / total) * 100).toFixed(0)}%)`, ""]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#a1a1aa", fontSize: "12px" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
