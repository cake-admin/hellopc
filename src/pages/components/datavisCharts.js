/**
 * Compact ECharts option builders for Components → Data visualization samples.
 * Palettes come from `datavisPalettes.js` (same stops as the playground themes).
 * Options are intentionally thin — not a port of chart-tool-echarts builders.
 */

import { DATAVIZ_THEME_SWATCHES } from './datavisPalettes';

const FONT = `'Rookery New', Rookery, system-ui, sans-serif`;

/** Hex stops for a named Color theme section. */
export function paletteFor(themeLabel) {
  return (DATAVIZ_THEME_SWATCHES[themeLabel] ?? []).map((s) => s.color);
}

/**
 * Resolve hello pc CSS custom properties for chart chrome (axes, labels, grid).
 * ECharts canvas cannot consume `var(--…)` directly.
 */
export function resolveChartChrome(el = document.documentElement) {
  const cs = getComputedStyle(el);
  const token = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    text: token('--color-text-icon-primary', '#1a1a1a'),
    muted: token('--color-text-icon-secondary', '#6b6b6b'),
    grid: token('--color-stroke-border', '#e0e0e0'),
    // Match ChartCard (`--color-surfaces-on-container`) so pie/gauge seams blend.
    surface: token('--color-surfaces-on-container', '#ffffff'),
  };
}

function axisStyle(chrome, show = true) {
  return {
    show,
    axisLine: { lineStyle: { color: chrome.grid } },
    axisTick: { show: false },
    axisLabel: { color: chrome.muted, fontFamily: FONT, fontSize: 10 },
    splitLine: { lineStyle: { color: chrome.grid } },
  };
}

function baseTooltip(chrome) {
  return {
    trigger: 'axis',
    backgroundColor: chrome.surface,
    borderColor: chrome.grid,
    textStyle: { color: chrome.text, fontFamily: FONT, fontSize: 11 },
  };
}

/** Categories used across bar / line / area samples. */
const CATS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function buildBarOption(colors, chrome) {
  const data = [42, 58, 35, 67, 49];
  return {
    color: colors,
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: baseTooltip(chrome),
    xAxis: {
      type: 'category',
      data: CATS,
      ...axisStyle(chrome),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...axisStyle(chrome),
      splitLine: { show: true, lineStyle: { color: chrome.grid } },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 28,
        data: data.map((value, i) => ({
          value,
          itemStyle: {
            color: colors[i % colors.length],
            borderRadius: [4, 4, 0, 0],
          },
        })),
      },
    ],
  };
}

export function buildLineOption(colors, chrome) {
  const seriesDefs = [
    { name: 'Series A', data: [22, 35, 28, 48, 41] },
    { name: 'Series B', data: [18, 24, 32, 30, 45] },
    { name: 'Series C', data: [12, 18, 15, 26, 22] },
  ].slice(0, Math.min(3, Math.max(1, colors.length)));

  return {
    color: colors,
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: baseTooltip(chrome),
    xAxis: {
      type: 'category',
      data: CATS,
      boundaryGap: false,
      ...axisStyle(chrome),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...axisStyle(chrome),
      splitLine: { show: true, lineStyle: { color: chrome.grid } },
    },
    series: seriesDefs.map((s, i) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: colors[i % colors.length] },
      itemStyle: { color: colors[i % colors.length] },
      data: s.data,
    })),
  };
}

export function buildAreaOption(colors, chrome) {
  const ramp = colors.length ? colors : ['#7586ff'];
  return {
    color: ramp,
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: baseTooltip(chrome),
    xAxis: {
      type: 'category',
      data: CATS,
      boundaryGap: false,
      ...axisStyle(chrome),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...axisStyle(chrome),
      splitLine: { show: true, lineStyle: { color: chrome.grid } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: ramp[Math.min(2, ramp.length - 1)] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: ramp[0] },
              { offset: 1, color: ramp[ramp.length - 1] },
            ],
          },
          opacity: 0.55,
        },
        data: [18, 32, 28, 45, 38],
      },
    ],
  };
}

export function buildPieOption(colors, chrome) {
  const slices = [
    { name: 'Alpha', value: 38 },
    { name: 'Beta', value: 26 },
    { name: 'Gamma', value: 18 },
    { name: 'Delta', value: 12 },
    { name: 'Other', value: 6 },
  ];
  return {
    color: colors,
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    tooltip: {
      trigger: 'item',
      backgroundColor: chrome.surface,
      borderColor: chrome.grid,
      textStyle: { color: chrome.text, fontFamily: FONT, fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          color: chrome.muted,
          fontFamily: FONT,
          fontSize: 10,
          formatter: '{b}',
        },
        labelLine: { lineStyle: { color: chrome.grid } },
        itemStyle: {
          borderColor: chrome.surface,
          borderWidth: 2,
          borderRadius: 4,
        },
        data: slices.map((s, i) => ({
          ...s,
          itemStyle: { color: colors[i % colors.length] },
        })),
      },
    ],
  };
}

export function buildHeatmapOption(colors, chrome) {
  const xCats = ['Mon', 'Tue', 'Wed', 'Thu'];
  const yCats = ['A', 'B', 'C'];
  const raw = [
    [0, 0, 12],
    [1, 0, 28],
    [2, 0, 45],
    [3, 0, 22],
    [0, 1, 35],
    [1, 1, 18],
    [2, 1, 8],
    [3, 1, 40],
    [0, 2, 5],
    [1, 2, 42],
    [2, 2, 30],
    [3, 2, 15],
  ];
  const values = raw.map((d) => d[2]);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const ramp = colors.length >= 2 ? colors : ['#bcc3ff', '#2034b7'];

  return {
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    tooltip: {
      position: 'top',
      backgroundColor: chrome.surface,
      borderColor: chrome.grid,
      textStyle: { color: chrome.text, fontFamily: FONT, fontSize: 11 },
    },
    grid: { left: 28, right: 48, top: 12, bottom: 28 },
    xAxis: {
      type: 'category',
      data: xCats,
      ...axisStyle(chrome),
      splitArea: { show: true },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: yCats,
      ...axisStyle(chrome),
      splitArea: { show: true },
      splitLine: { show: false },
    },
    visualMap: {
      min: minV,
      max: maxV,
      calculable: false,
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemWidth: 10,
      itemHeight: 72,
      textStyle: { color: chrome.muted, fontFamily: FONT, fontSize: 9 },
      inRange: { color: ramp },
    },
    series: [
      {
        type: 'heatmap',
        data: raw,
        label: { show: false },
        itemStyle: { borderRadius: 3, borderColor: chrome.surface, borderWidth: 2 },
        emphasis: { itemStyle: { shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.2)' } },
      },
    ],
  };
}

/** Hidden chrome shared by silent zone / end-cap overlay gauges. */
const GAUGE_SILENT_CHROME = {
  progress: { show: false },
  pointer: { show: false },
  anchor: { show: false },
  axisTick: { show: false },
  splitLine: { show: false },
  axisLabel: { show: false },
  title: { show: false },
  detail: { show: false },
  data: [{ value: 1 }],
};

/**
 * One silent single-color arc for a ramp zone. roundCap stays false so seams
 * between zones stay square; outer tips are painted by gaugeRoundEndCap.
 */
function gaugeZoneArc({ center, radius, startAngle, endAngle, width, color }) {
  return {
    type: 'gauge',
    center,
    radius,
    min: 0,
    max: 1,
    startAngle,
    endAngle,
    clockwise: true,
    silent: true,
    z: 2,
    animation: false,
    axisLine: {
      roundCap: false,
      lineStyle: { width, color: [[1, color]] },
    },
    ...GAUGE_SILENT_CHROME,
  };
}

/**
 * Short silent gauge with a single-color roundCap axisLine (ECharts Sausage).
 * Overlays rounded outer tips on square-seamed zone arcs.
 */
function gaugeRoundEndCap({ center, radius, startAngle, endAngle, width, color }) {
  return {
    type: 'gauge',
    center,
    radius,
    min: 0,
    max: 1,
    startAngle,
    endAngle,
    clockwise: true,
    silent: true,
    z: 3,
    animation: false,
    axisLine: {
      roundCap: true,
      lineStyle: { width, color: [[1, color]] },
    },
    ...GAUGE_SILENT_CHROME,
  };
}

export function buildGaugeOption(colors, chrome) {
  const ramp = colors.length ? colors : ['#df2e3c', '#4aa42c'];
  const rawZones = ramp.map((c, i) => [
    Math.round(((i + 1) / ramp.length) * 100) / 100,
    c,
  ]);
  const center = ['50%', '55%'];
  const radius = '68%';
  const startAngle = 210;
  const endAngle = -30;
  const span = startAngle - endAngle; // 240°
  const barWidth = 10;
  // ~2px gutter along the arc at the compact card radius.
  const gapDeg = (2 / 120) * (180 / Math.PI);
  const capDeg = 4;
  const startColor = rawZones[0][1];
  const endColor = rawZones[rawZones.length - 1][1];

  const series = [
    {
      type: 'gauge',
      // Compact 180px card: keep the arc inset so scale labels sit next to
      // the bar instead of floating into the detail value.
      center,
      radius,
      min: 0,
      max: 100,
      splitNumber: 4,
      startAngle,
      endAngle,
      progress: { show: false },
      // Track is painted by per-zone silent series (true angular gutters).
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: chrome.muted,
        fontFamily: FONT,
        fontSize: 9,
        distance: 4,
      },
      // Short needle + detail below the hub so the value is not covered.
      pointer: {
        show: true,
        width: 3,
        length: '48%',
        itemStyle: { color: chrome.text },
      },
      anchor: { show: false },
      title: {
        color: chrome.muted,
        fontFamily: FONT,
        fontSize: 11,
        offsetCenter: [0, '78%'],
      },
      detail: {
        valueAnimation: true,
        color: chrome.text,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 20,
        offsetCenter: [0, '40%'],
        formatter: '{value}',
      },
      data: [{ value: 72, name: 'Score' }],
    },
  ];

  const gapFrac = rawZones.length > 1 ? gapDeg / span : 0;
  let prev = 0;
  for (let i = 0; i < rawZones.length; i++) {
    const [end, zoneColor] = rawZones[i];
    const clampedEnd = Math.min(1, Math.max(prev, end));
    const from = prev;
    const to = i < rawZones.length - 1 ? Math.max(from, clampedEnd - gapFrac) : clampedEnd;
    if (to > from) {
      series.push(
        gaugeZoneArc({
          center,
          radius,
          startAngle: startAngle - from * span,
          endAngle: startAngle - to * span,
          width: barWidth,
          color: zoneColor,
        }),
      );
    }
    prev = clampedEnd;
  }

  series.push(
    gaugeRoundEndCap({
      center,
      radius,
      startAngle,
      endAngle: startAngle - capDeg,
      width: barWidth,
      color: startColor,
    }),
    gaugeRoundEndCap({
      center,
      radius,
      startAngle: endAngle + capDeg,
      endAngle,
      width: barWidth,
      color: endColor,
    }),
  );

  return {
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    series,
  };
}

/** Waterfall with semantic positive / negative fills (first / last ramp stops). */
export function buildWaterfallOption(colors, chrome) {
  const positive = colors[colors.length - 1] ?? '#4aa42c';
  const negative = colors[0] ?? '#df2e3c';
  const steps = [
    { name: 'Start', value: 40 },
    { name: 'In', value: 18 },
    { name: 'Out', value: -12 },
    { name: 'In', value: 10 },
    { name: 'Out', value: -8 },
  ];
  const base = [];
  const delta = [];
  let cum = 0;
  for (const step of steps) {
    const start = cum;
    const end = cum + step.value;
    base.push(Math.min(start, end));
    delta.push({
      value: Math.abs(step.value),
      itemStyle: {
        color: step.value >= 0 ? positive : negative,
        borderRadius: 3,
      },
    });
    cum = end;
  }

  return {
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: { ...baseTooltip(chrome), trigger: 'item' },
    xAxis: {
      type: 'category',
      data: steps.map((s) => s.name),
      ...axisStyle(chrome),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...axisStyle(chrome),
      splitLine: { show: true, lineStyle: { color: chrome.grid } },
    },
    series: [
      {
        type: 'bar',
        stack: 'wf',
        silent: true,
        itemStyle: { color: 'transparent' },
        emphasis: { disabled: true },
        data: base,
      },
      {
        type: 'bar',
        stack: 'wf',
        barMaxWidth: 28,
        data: delta,
      },
    ],
  };
}

/** Positive / negative bars colored by sign from semantic ends. */
export function buildPosNegOption(colors, chrome) {
  const positive = colors[colors.length - 1] ?? '#4aa42c';
  const negative = colors[0] ?? '#df2e3c';
  const values = [24, -16, 12, -8, 18, -5];
  const cats = ['A', 'B', 'C', 'D', 'E', 'F'];

  return {
    textStyle: { fontFamily: FONT },
    animationDuration: 400,
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: baseTooltip(chrome),
    xAxis: {
      type: 'category',
      data: cats,
      ...axisStyle(chrome),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...axisStyle(chrome),
      splitLine: { show: true, lineStyle: { color: chrome.grid } },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 24,
        data: values.map((value) => ({
          value,
          itemStyle: {
            color: value >= 0 ? positive : negative,
            borderRadius: value >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],
          },
        })),
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: chrome.grid, type: 'solid', width: 1 },
          data: [{ yAxis: 0 }],
        },
      },
    ],
  };
}

/**
 * Recommended chart samples per Color theme (playground recommendedThemes).
 * Each entry: { id, title, build(colors, chrome) → option }
 */
export const THEME_CHART_SAMPLES = {
  Categorical: [
    { id: 'bar', title: 'Bar', build: buildBarOption },
    { id: 'pie', title: 'Pie / Donut', build: buildPieOption },
    { id: 'line', title: 'Line', build: buildLineOption },
  ],
  Sequential: [
    { id: 'area', title: 'Area', build: buildAreaOption },
    { id: 'line', title: 'Line', build: buildLineOption },
    { id: 'heatmap', title: 'Heatmap', build: buildHeatmapOption },
  ],
  Semantic: [
    { id: 'gauge', title: 'Gauge', build: buildGaugeOption },
    { id: 'waterfall', title: 'Waterfall', build: buildWaterfallOption },
    { id: 'posNeg', title: 'Positive / Negative', build: buildPosNegOption },
  ],
  Diverging: [
    { id: 'heatmap', title: 'Heatmap', build: buildHeatmapOption },
    { id: 'gauge', title: 'Gauge', build: buildGaugeOption },
  ],
  Wireframe: [
    { id: 'bar', title: 'Bar', build: buildBarOption },
    { id: 'pie', title: 'Pie / Donut', build: buildPieOption },
    { id: 'line', title: 'Line', build: buildLineOption },
  ],
};
