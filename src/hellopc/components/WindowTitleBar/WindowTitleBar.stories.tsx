import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { WindowTitleBar } from './WindowTitleBar';

/** Story chrome: a stand-in app icon (the real one is the product's own asset). */
const AppIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <defs>
      <linearGradient id="wtb-app" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-primary-primary)" />
        <stop offset="1" stopColor="var(--color-info-info)" />
      </linearGradient>
    </defs>
    <rect width="20" height="20" rx="5" fill="url(#wtb-app)" />
  </svg>
);

const meta = {
  title: 'Components/Window Title Bar',
  component: WindowTitleBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The bar across the top of a window: app icon, title, and minimize / maximize /
close. App windows normally use the hello pc topbar instead; use this for
**secondary windows** without a topbar (\`variant="windows"\`) and for **floating
in-app panels** such as agent panels and pop-out editors (\`variant="in-app"\`).

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Each control renders only when you pass its handler, and Maximize becomes
Restore when \`maximized\`. In a desktop host (Electron, WebView2) the bar is the
window's drag region (\`app-region: drag\`, controls excluded); Windows itself
usually draws the Mica backdrop and may draw the caption buttons too, so the
\`windows\` variant is mainly for browser hosts and documentation. When the shell
has no Mica, apply the surface fallbacks from Foundations / Special Surfaces to
the window.

## Usage

\`\`\`tsx
<WindowTitleBar title="Lenovo Vantage" appIcon={<AppIcon />} onMinimize={min} onMaximize={max} onClose={close} />
<WindowTitleBar title="Settings" onClose={close} />
<WindowTitleBar title="Report.docx" maximized onMaximize={restore} onClose={close} />
<WindowTitleBar variant="in-app" title="Assistant" appIcon={<AppIcon />} onClose={close} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| \`windows\` bar | 32px, transparent (over Mica), left padding \`--space-300\` |
| \`in-app\` bar | 48px, \`--color-surfaces-container\`, \`--stroke-100\` \`--color-stroke-border\` bottom edge, padding \`--space-100\` (\`--space-300\` left) |
| Title | \`--color-text-icon-primary\`; \`windows\` \`--type-size-caption\` regular, \`in-app\` \`--type-size-body\` medium |
| App icon | 16px (\`windows\`) / 20px (\`in-app\`); icon ↔ title \`--space-100\` |
| Caption button (\`windows\`) | 46×32; hover \`--color-secondary-secondary-overlay\`, press \`-overlay-hover\`; glyph on hover \`--color-control-on-hover\` |
| Close (\`windows\`) | hover \`--color-error-error\`, press \`--color-error-error-hover\`; glyph \`--color-control-on-destructive-hover\` |
| Controls (\`in-app\`) | **IconButton** sm · ghost · secondary, \`--space-050\` apart |
| Focus ring | \`--stroke-300\` \`--color-control-focus-ring\` |

## Accessibility

- Every control is a real button with a name: "Minimize", "Maximize" /
  "Restore", "Close".
- The app icon is decorative; the title is the window's name.
- For an \`in-app\` panel, the panel itself (often a \`Dialog\`) should close on
  Esc and return focus to what opened it.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use the topbar for main app windows | Stack a title bar above a topbar |
| Show only the controls the window supports | Show a Maximize that does nothing |
| Keep titles short — the app or document name | Put status text or actions in the title |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'App name',
    appIcon: <AppIcon />,
    variant: 'windows',
    onMinimize: fn(),
    onMaximize: fn(),
    onClose: fn(),
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    appIcon: { control: false, table: { category: 'Content' } },
    variant: { control: 'inline-radio', options: ['windows', 'in-app'], table: { category: 'Appearance' } },
    maximized: { control: 'boolean', table: { category: 'State' } },
    dragRegion: { control: 'boolean', table: { category: 'Behavior' } },
    onMinimize: { action: 'minimize', table: { category: 'Events' } },
    onMaximize: { action: 'maximize', table: { category: 'Events' } },
    onClose: { action: 'close', table: { category: 'Events' } },
  },
} satisfies Meta<typeof WindowTitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Story chrome: a stand-in for the Mica / page surface the bar sits on. */
const Surface = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: 'var(--color-surfaces-container-blur-high)',
      border: '1px solid var(--color-stroke-border)',
      borderRadius: 8,
      overflow: 'hidden',
      maxWidth: 720,
    }}
  >
    {children}
  </div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <Surface>{Story()}</Surface>],
};

/** `windows` (32px, caption buttons, over Mica) and `in-app` (48px, container surface, icon buttons). */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Surface>
        <WindowTitleBar title="App name" appIcon={<AppIcon />} onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />
      </Surface>
      <Surface>
        <WindowTitleBar variant="in-app" title="App name" appIcon={<AppIcon />} onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />
      </Surface>
    </div>
  ),
};

/** Maximize toggles to Restore; hover a caption button to see its state (Close turns red). */
export const MaximizeRestore: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [max, setMax] = useState(false);
    return (
      <Surface>
        <WindowTitleBar
          title={max ? 'Maximized' : 'Restored'}
          appIcon={<AppIcon />}
          maximized={max}
          onMinimize={() => {}}
          onMaximize={() => setMax((m) => !m)}
          onClose={() => {}}
        />
      </Surface>
    );
  },
};

/** Only Close — a dialog-like secondary window. */
export const CloseOnly: Story = {
  args: { onMinimize: undefined, onMaximize: undefined, title: 'Settings' },
  decorators: [(Story) => <Surface>{Story()}</Surface>],
};

/** QA matrix — variant × restored/maximized × full/close-only. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['windows', 'in-app'] as const).flatMap((v) => [
        <Surface key={`${v}-a`}>
          <WindowTitleBar variant={v} title="App name" appIcon={<AppIcon />} onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />
        </Surface>,
        <Surface key={`${v}-b`}>
          <WindowTitleBar variant={v} title="Maximized window" appIcon={<AppIcon />} maximized onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />
        </Surface>,
        <Surface key={`${v}-c`}>
          <WindowTitleBar variant={v} title="Close only" onClose={() => {}} />
        </Surface>,
      ])}
    </div>
  ),
};

/** The controls fire their handlers and are named for assistive technology. */
export const ControlsFire: Story = {
  tags: ['!autodocs'],
  decorators: [(Story) => <Surface>{Story()}</Surface>],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Minimize' }));
    await expect(args.onMinimize).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Maximize' }));
    await expect(args.onMaximize).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};
