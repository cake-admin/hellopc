import { useEffect, useMemo, useRef, useState } from 'react';
import { CHART_REGISTRY } from '../../charts/registry';
import { useChartStore } from '../../state/chartStore';
import { useChartTheme } from '../../theme/ThemeProvider';
import { SINGLE_TOKENS, paletteTokensFor } from '../../tokens/loadTokens';
import type { Variation } from '../../theme/chartTheme.types';
import { WIREFRAME_SHADE_LIMIT } from '../../theme/chartTheme.types';
import type { SingleToken } from '../../tokens/tokens.types';

const VARIATIONS: Array<{ id: Variation; label: string; hint: string; hidden?: boolean }> = [
  { id: 'categorical', label: 'Categorical', hint: 'Distinct hello pc tones — identical in light & dark' },
  { id: 'sequential', label: 'Sequential', hint: 'Single-hue indigo ramp (light→dark) — heatmap, area, funnel' },
  { id: 'semantic', label: 'Semantic', hint: 'Red→green ramp (bad→good) — gauge, KPI, heatmap' },
  { id: 'diverging', label: 'Diverging', hint: 'Jade↔violet two-ended ramp — heatmap, choropleth' },
  { id: 'primary', label: 'Primary', hint: 'Pick one primary-family token', hidden: true },
  {
    id: 'secondary',
    label: 'Wireframe',
    hint: `Multiple secondary greys; patterns after ${WIREFRAME_SHADE_LIMIT} categories`,
  },
];

const VISIBLE_VARIATIONS = VARIATIONS.filter((v) => !v.hidden);

/** Variations that pick a single token from a family (vs. a fixed palette). */
const TOKEN_VARIATIONS: ReadonlySet<Variation> = new Set(['primary', 'secondary']);

/** Fixed-palette variations → the key their token stops are emitted under. */
const PALETTE_TOKEN_KEY: Partial<Record<Variation, string>> = {
  categorical: 'categorical',
  sequential: 'sequential',
  semantic: 'semanticScale',
  diverging: 'diverging',
};

const KIND_ORDER = ['Normal', 'Tonal', 'Overlay'] as const;
type Kind = (typeof KIND_ORDER)[number];

/** Which base family a token belongs to (tonal* is a primary tint; tonalSecondary* is secondary). */
function baseOf(label: string): 'primary' | 'secondary' {
  return label.startsWith('secondary') || label.startsWith('tonalSecondary') ? 'secondary' : 'primary';
}
function kindOf(label: string): Kind {
  if (/overlay/i.test(label)) return 'Overlay';
  if (label.startsWith('tonal')) return 'Tonal';
  return 'Normal';
}

const displayValue = (color: string): string => (color.startsWith('#') ? color.toUpperCase() : color);
const DEFAULT_TOKEN: Record<'primary' | 'secondary', string> = {
  primary: 'primary.primary',
  secondary: 'secondary.secondary',
};

export function ColorControls() {
  const color = useChartStore((s) => s.color);
  const setColor = useChartStore((s) => s.setColor);
  const chartType = useChartStore((s) => s.type);
  const theme = useChartTheme();
  const isDark = theme.mode !== 'light';
  const swatchOf = (t: SingleToken): string => (isDark ? t.darkA : t.lightA);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const mapRegion = useChartStore((s) => s.style.mapRegion);

  const recommended = useMemo(() => {
    // Continent choropleth prefers categorical; country prefers value ramps.
    if (chartType === 'map' && mapRegion === 'continent') {
      return new Set<Variation>(['categorical']);
    }
    if (chartType === 'map') {
      return new Set<Variation>(['sequential', 'diverging', 'semantic']);
    }
    const list = CHART_REGISTRY[chartType]?.recommendedThemes ?? [];
    return new Set(list);
  }, [chartType, mapRegion]);

  const orderedThemes = useMemo(() => {
    const rec: typeof VISIBLE_VARIATIONS = [];
    const rest: typeof VISIBLE_VARIATIONS = [];
    for (const v of VISIBLE_VARIATIONS) {
      (recommended.has(v.id) ? rec : rest).push(v);
    }
    // Keep registry order within the recommended group.
    const order =
      chartType === 'map' && mapRegion === 'continent'
        ? (['categorical'] as Variation[])
        : chartType === 'map'
          ? (['sequential', 'diverging', 'semantic'] as Variation[])
          : (CHART_REGISTRY[chartType]?.recommendedThemes ?? []);
    rec.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    return [...rec, ...rest];
  }, [chartType, mapRegion, recommended]);

  const subgroups = useMemo(() => {
    if (!TOKEN_VARIATIONS.has(color.variation)) return [];
    const scoped = SINGLE_TOKENS.filter((t) => baseOf(t.label) === color.variation);
    return KIND_ORDER.map((kind) => ({
      kind,
      tokens: scoped.filter((t) => kindOf(t.label) === kind),
    })).filter((g) => g.tokens.length > 0);
  }, [color.variation]);

  // Ramp variations preview their actual token stops (not interpolated samples),
  // so the swatch count matches what was specified. Wireframe previews its
  // multi-shade greys (up to the pattern threshold).
  const rampOf: Partial<Record<Variation, string[]>> = {
    sequential: theme.color.sequentialRamp,
    semantic: theme.color.semanticRamp,
    diverging: theme.color.divergingRamp,
  };
  const preview =
    rampOf[color.variation] ??
    theme.color.resolve(
      color,
      color.variation === 'categorical'
        ? 12
        : color.variation === 'secondary'
          ? WIREFRAME_SHADE_LIMIT
          : 1,
    );
  const activeVariation = VARIATIONS.find((v) => v.id === color.variation);

  // Fixed palettes list their token stops read-only — same anatomy as the
  // wireframe picker, but informational (nothing here is selectable).
  const paletteTokens = paletteTokensFor(PALETTE_TOKEN_KEY[color.variation] ?? '');

  const selectVariation = (id: Variation) => {
    if (!TOKEN_VARIATIONS.has(id)) {
      setColor({ variation: id });
      setOpen(false);
      return;
    }
    // Keep the current token if it belongs to this family, else use the default.
    const family = id as 'primary' | 'secondary';
    const current = SINGLE_TOKENS.find((t) => t.id === color.token);
    const keep = current && baseOf(current.label) === family ? color.token : DEFAULT_TOKEN[family];
    setColor({ variation: family, token: keep });
    setOpen(false);
  };

  return (
    <>
      <div className="field__label" id="color-theme-label">
        Color theme
      </div>
      <div className="theme-select" ref={rootRef}>
        <button
          type="button"
          className={`theme-select__trigger ${open ? 'theme-select__trigger--open' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="color-theme-label"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="theme-select__value">
            {activeVariation?.label ?? color.variation}
            {recommended.has(color.variation) ? (
              <span className="theme-badge">Recommended</span>
            ) : null}
          </span>
          <span className="theme-select__chevron" aria-hidden="true">
            ▾
          </span>
        </button>
        {open ? (
          <ul className="theme-select__menu" role="listbox" aria-labelledby="color-theme-label">
            {orderedThemes.map((v) => {
              const isRec = recommended.has(v.id);
              const selected = color.variation === v.id;
              return (
                <li key={v.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`theme-select__option ${selected ? 'theme-select__option--active' : ''}`}
                    onClick={() => selectVariation(v.id)}
                  >
                    <span className="theme-select__option-label">{v.label}</span>
                    {isRec ? <span className="theme-badge">Recommended</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {activeVariation ? (
        <p className="field__hint" style={{ margin: '8px 0 0' }}>
          {activeVariation.hint.includes('hello pc') ? (
            <>
              {activeVariation.hint.split('hello pc')[0]}
              <span className="brand-name">
                hello <span className="brand-pc">pc</span>
              </span>
              {activeVariation.hint.split('hello pc')[1]}
            </>
          ) : (
            activeVariation.hint
          )}
        </p>
      ) : null}

      {TOKEN_VARIATIONS.has(color.variation) ? (
        <div className="token-list token-list--scroll" style={{ marginTop: 12 }}>
          {color.variation === 'secondary' ? (
            <p className="field__hint" style={{ margin: '0 0 8px' }}>
              Optional base grey for the wireframe shade ramp
            </p>
          ) : null}
          {subgroups.map(({ kind, tokens }) => (
            <div key={kind} className="token-group">
              <div className="token-group__title">{kind}</div>
              {tokens.map((t) => {
                const c = swatchOf(t);
                const selected = color.token === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`token-row ${selected ? 'token-row--active' : ''}`}
                    onClick={() => setColor({ token: t.id })}
                    aria-pressed={selected}
                  >
                    <span className="token-row__swatch" style={{ background: c }} />
                    <span className="token-row__meta">
                      <span className="token-row__label">{t.label}</span>
                      <span className="token-row__sub">{t.path}</span>
                      <span className="token-row__value">{displayValue(c)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}

      <div className="swatch-row" aria-hidden="true">
        {preview.map((c, i) => (
          <span key={`${c}-${i}`} className="swatch" style={{ background: c }} />
        ))}
      </div>

      {paletteTokens.length > 0 ? (
        <div className="token-list token-list--scroll token-list--static" style={{ marginTop: 12 }}>
          <div className="token-group">
            <div className="token-group__title">Tokens</div>
            {paletteTokens.map((t) => {
              const c = swatchOf(t);
              return (
                <div key={t.id} className="token-row token-row--static">
                  <span className="token-row__swatch" style={{ background: c }} />
                  <span className="token-row__meta">
                    <span className="token-row__label">{t.label}</span>
                    <span className="token-row__sub">{t.path}</span>
                    <span className="token-row__value">{displayValue(c)}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
