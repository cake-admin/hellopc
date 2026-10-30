import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button, CakeProvider, Card, HeroCard, type ThemeMode } from '@cake-admin/cakeand';

export default function App() {
  // The initial value here must match data-theme in index.html, or the first
  // paint flashes the wrong theme. Change both together.
  const [mode, setMode] = useState<ThemeMode>('light.a');
  const isDark = mode === 'dark.a';

  return (
    // Exactly ONE CakeProvider in the app, at the root.
    //
    // It puts data-theme on <html> rather than on a wrapper div, deliberately:
    // Modal, Dropdown, both Tooltips, Breadcrumb, NumberDropdown and Pagination
    // render through a Radix portal into document.body, outside this React tree.
    // On a wrapper div those would escape the theme and render light inside a
    // dark app. A second provider would fight the first over that attribute.
    <CakeProvider mode={mode}>
      <main
        style={{
          // Every value comes from a hello pc token. Never hardcode a color,
          // spacing, radius, or type size — see AGENTS.md.
          minHeight: '100vh',
          padding: 'var(--space-500)',
          display: 'grid',
          gap: 'var(--space-300)',
          alignContent: 'start',
          background: 'var(--color-surfaces-canvas)',
        }}
      >
        <Card>
          <HeroCard
            leadingText={
              <>
                <span style={{ fontWeight: 700 }}>
                  hello <span style={{ color: 'var(--color-primary-primary)' }}>pc</span>
                </span>{' '}
                prototype
              </>
            }
            title="You're wired up."
            body={
              <>
                Edit src/App.tsx to start building. The components, tokens, theming and fonts all
                come from the{' '}
                <span style={{ fontWeight: 700 }}>
                  hello <span style={{ color: 'var(--color-primary-primary)' }}>pc</span>
                </span>{' '}
                package — nothing here is hand-rolled.
              </>
            }
            secondaryBody="Ask your coding agent to build something. It reads context/hellopc-components.md to learn what exists."
            actions={
              <Button
                size="lg"
                startIcon={isDark ? <Sun /> : <Moon />}
                onClick={() => setMode(isDark ? 'light.a' : 'dark.a')}
              >
                Switch to {isDark ? 'light' : 'dark'}
              </Button>
            }
          />
        </Card>
      </main>
    </CakeProvider>
  );
}
