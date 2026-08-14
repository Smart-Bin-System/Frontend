export const PASTEL_CHART_COLORS = [
  "#A7C7E7",
  "#B7E4C7",
  "#CDB4DB",
  "#FFC8DD",
  "#FFE5A5",
  "#FFD6A5",
  "#A8DADC",
  "#D8C4F1",
  "#B8E0D2",
  "#F4B6A6",
];

export const PLASTIC_CHART_COLORS = {
  PET: "#A7C7E7",
  HDPE: "#B7E4C7",
  LDPE: "#CDB4DB",
  PP: "#FFD6A5",
  OTHER: "#FFC8DD",
};

export const CHART_THEME = {
  axis: "#64748B",
  grid: "#E2E8F0",
  tooltipBackground: "#FFFFFF",
  tooltipBorder: "#CBD5E1",
  fill: "#A8DADC",
  collections: "#D8C4F1",
};

export function getPlasticChartColor(type, fallbackIndex = 0) {
  const normalizedType = String(type || "").trim().toUpperCase();
  return (
    PLASTIC_CHART_COLORS[normalizedType] ||
    PASTEL_CHART_COLORS[fallbackIndex % PASTEL_CHART_COLORS.length]
  );
}

export function getFillLevelColor(fillLevel) {
  if (Number(fillLevel) >= 85) return "#F4B6A6";
  if (Number(fillLevel) >= 60) return "#FFE5A5";
  return "#B7E4C7";
}
