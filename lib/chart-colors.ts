export interface ChartColors {
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipBorder: string;
  colors: string[];
}

const DARK_COLORS = ["#38bdf8", "#a78bfa", "#fbbf24", "#34d399", "#fb7185", "#64748b"];
const LIGHT_COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

const darkTheme: ChartColors = {
  grid: "rgba(255,255,255,0.06)",
  text: "#a1a1aa",
  tooltipBg: "#1e2030",
  tooltipBorder: "rgba(255,255,255,0.1)",
  colors: DARK_COLORS,
};

const lightTheme: ChartColors = {
  grid: "rgba(0,0,0,0.08)",
  text: "#52525b",
  tooltipBg: "#ffffff",
  tooltipBorder: "rgba(0,0,0,0.1)",
  colors: LIGHT_COLORS,
};

export function getChartColors(): ChartColors {
  if (typeof document === "undefined") return lightTheme;
  const theme = document.documentElement.dataset.theme;
  return theme === "dark" || theme === "slate" ? darkTheme : lightTheme;
}

export function getTooltipStyle(colors: ChartColors) {
  return {
    backgroundColor: colors.tooltipBg,
    border: `1px solid ${colors.tooltipBorder}`,
    borderRadius: "12px",
    color: colors.text,
    fontSize: "13px",
  } as const;
}

export const CHART_COLORS_DARK = DARK_COLORS;
export const CHART_COLORS_LIGHT = LIGHT_COLORS;
