/**
 * hello pc design system — public entry point.
 *
 * This is the surface consumers (and their coding agents) import from:
 *
 * ```tsx
 * import { CakeProvider, Card, HeroCard, Button } from '@cake-admin/cakeand';
 *
 * <CakeProvider>
 *   <Card><HeroCard title="Hello" actions={<Button>Go</Button>} /></Card>
 * </CakeProvider>
 * ```
 *
 * Importing anything here pulls in the token layer (`hellopc-vars.css`) and the
 * fonts as side effects, via `theme/ThemeProvider` — keep them listed under
 * `sideEffects` in package.json so a bundler never tree-shakes the CSS away.
 */

/* ── Theme ─────────────────────────────────────────────────────────────── */
export { CakeProvider } from './theme/HellopcProvider';
export type { CakeProviderProps } from './theme/HellopcProvider';
export { CakeThemeProvider, CakeGlobalStyle } from './theme/ThemeProvider';
export type { CakeThemeProviderProps } from './theme/ThemeProvider';
export { themes } from './tokens/theme';
export type { ThemeMode } from './tokens/theme';

/* ── Elements (shared building blocks) ─────────────────────────────────── */
export * from './components/Elements';

/* ── Components ────────────────────────────────────────────────────────── */
export * from './components/Accordion';
export * from './components/Avatar';
export * from './components/Badge';
export * from './components/Breadcrumb';
export * from './components/Button';
export * from './components/Card';
export * from './components/Checkbox';
export * from './components/Chip';
export * from './components/ContentSwitcher';
export * from './components/Counter';
export * from './components/DateInput';
export * from './components/Dropdown';
export * from './components/FileUpload';
export * from './components/HorizontalTabs';
export * from './components/Menu';
export * from './components/Modal';
export * from './components/Notification';
export * from './components/NotificationPanel';
export * from './components/NumberDropdown';
export * from './components/NumberInput';
export * from './components/Pagination';
export * from './components/PasswordInput';
export * from './components/PinInput';
export * from './components/Progress Indicators';
export * from './components/Radio';
export * from './components/Sidebar';
export * from './components/Slider';
export * from './components/Stepper';
export * from './components/Switch';
export * from './components/Table';
export * from './components/TextInput';
export * from './components/TimeInput';
export * from './components/Toast';
export * from './components/Tooltip';
export * from './components/VerticalTabs';
