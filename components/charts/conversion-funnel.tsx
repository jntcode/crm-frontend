"use client";

import { useI18n } from "@/lib/i18n/context";
import { PipelineBreakdown } from "@/types/email";
import { motion } from "framer-motion";

export function ConversionFunnel({ data }: { data: PipelineBreakdown }) {
  const { t } = useI18n();

  const stages = [
    { key: "new" as const, label: t("new"), value: data.new, color: "#64748b" },
    { key: "contacted" as const, label: t("contacted"), value: data.contacted, color: "#38bdf8" },
    { key: "qualified" as const, label: t("qualified"), value: data.qualified, color: "#a78bfa" },
    { key: "proposal" as const, label: t("proposal"), value: data.proposal, color: "#fbbf24" },
    { key: "won" as const, label: t("won"), value: data.won, color: "#34d399" },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const widthPercent = (stage.value / maxValue) * 100;
        const convRate = i > 0 && stages[i - 1].value > 0
          ? ((stage.value / stages[i - 1].value) * 100).toFixed(0)
          : null;

        return (
          <div key={stage.key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)] font-medium">{stage.label}</span>
              <div className="flex items-center gap-3">
                {convRate && (
                  <span className="text-[10px] font-semibold text-[var(--muted)] bg-[var(--soft)] px-2 py-0.5 rounded-full">
                    {convRate}% conv.
                  </span>
                )}
                <span className="text-[var(--muted)] font-mono text-xs">{stage.value}</span>
              </div>
            </div>
            <div className="h-8 overflow-hidden rounded-lg bg-[var(--soft)] relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                className="h-full rounded-lg flex items-center justify-end pr-3"
                style={{ backgroundColor: stage.color }}
              >
                {stage.value > 0 && (
                  <span className="text-[11px] font-bold text-white/90">
                    {stage.value}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
