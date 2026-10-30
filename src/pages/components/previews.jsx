import React, { Suspense, lazy, useState } from 'react';
import styled from 'styled-components';
import { withBrand } from '../../components/BrandName';
import { Toast as RadixToast } from 'radix-ui';
import {
  ArrowRight,
  Home,
  Plus,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import { Accordion, AccordionItem } from '../../hellopc/components/Accordion';
import { Avatar } from '../../hellopc/components/Avatar';
import { Badge } from '../../hellopc/components/Badge';
import { Breadcrumb } from '../../hellopc/components/Breadcrumb';
import { Button } from '../../hellopc/components/Button';
import { Card, SimpleCard } from '../../hellopc/components/Card';
import { Checkbox } from '../../hellopc/components/Checkbox';
import { Chip } from '../../hellopc/components/Chip';
import { ContentSwitcher } from '../../hellopc/components/ContentSwitcher';
import { Counter } from '../../hellopc/components/Counter';
import { DateInput } from '../../hellopc/components/DateInput';
import { Dropdown } from '../../hellopc/components/Dropdown';
import { Scrollbar } from '../../hellopc/components/Elements';
import { FileUpload } from '../../hellopc/components/FileUpload';
import {
  HorizontalTabs,
  HorizontalTabsContent,
  HorizontalTabsList,
} from '../../hellopc/components/HorizontalTabs';
import { HorizontalTabItem } from '../../hellopc/components/HorizontalTabs/HorizontalTabItem';
import { MenuContainer, MenuItem } from '../../hellopc/components/Menu';
import { Modal, ModalContent, ModalFooter } from '../../hellopc/components/Modal';
import { Notification } from '../../hellopc/components/Notification';
import { NotificationPanel } from '../../hellopc/components/NotificationPanel';
import { NumberInput } from '../../hellopc/components/NumberInput';
import { Pagination } from '../../hellopc/components/Pagination';
import { PasswordInput } from '../../hellopc/components/PasswordInput';
import { ProgressBar, Spinner } from '../../hellopc/components/Progress Indicators';
import { Radio, RadioGroup } from '../../hellopc/components/Radio';
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarList,
} from '../../hellopc/components/Sidebar';
import { RangeSlider, Slider } from '../../hellopc/components/Slider';
import { Stepper } from '../../hellopc/components/Stepper';
import { Switch } from '../../hellopc/components/Switch';
import {
  DataCell,
  DataRow,
  HeaderCell,
  HeaderRow,
  Table,
} from '../../hellopc/components/Table';
import { TextInput } from '../../hellopc/components/TextInput';
import { TimeInput } from '../../hellopc/components/TimeInput';
import { Toast } from '../../hellopc/components/Toast';
import { RichTooltip, SimpleTooltip } from '../../hellopc/components/Tooltip';
import {
  GroupBlock,
  GroupLabel,
  PreviewNote,
  PreviewPanel,
  PreviewRow,
  PreviewStack,
  ROOKERY,
} from './chrome';
import { DATAVIZ_THEME_SWATCHES } from './datavisPalettes';

const DatavisThemeCharts = lazy(() => import('./DatavisThemeCharts'));

const ChartsSuspenseFallback = styled.div`
  margin-top: var(--space-400);
  min-height: 180px;
  display: flex;
  align-items: center;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-400);
  width: 100%;
`;

const MediaBlock = styled.div`
  width: 100%;
  height: 120px;
  background: var(--color-surfaces-on-container);
`;

const SidebarPanelBox = styled.div`
  flex: 1;
  min-width: 0;
  padding: var(--space-300);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container-high);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const AVATAR_PHOTO = 'https://i.pravatar.cc/150?img=47';

const CompactField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  align-items: flex-start;
  width: fit-content;
  max-width: 100%;
`;

const ScrollPreviewFrame = styled.div`
  width: 100%;
  max-width: 28rem;
  border-radius: var(--radius-200);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-on-container-high);
  overflow: hidden;
`;

const ScrollPreviewRow = styled.div`
  padding: var(--space-200) var(--space-300);
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);

  &:last-child {
    border-bottom: none;
  }
`;

const ToastPreviewShell = ({ children }) => (
  <RadixToast.Provider>
    {children}
    <RadixToast.Viewport
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-300)',
        width: '100%',
        maxWidth: 640,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        outline: 'none',
      }}
    />
  </RadixToast.Provider>
);

const DROPDOWN_OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Japan', value: 'jp' },
];

export const ButtonPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Variants · primary</GroupLabel>
      <PreviewRow>
        <Button variant="fill">Fill</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="ghost">Ghost</Button>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Variants · secondary</GroupLabel>
      <PreviewRow>
        <Button intent="secondary" variant="fill">
          Fill
        </Button>
        <Button intent="secondary" variant="outline">
          Outline
        </Button>
        <Button intent="secondary" variant="tonal">
          Tonal
        </Button>
        <Button intent="secondary" variant="ghost">
          Ghost
        </Button>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Sizes</GroupLabel>
      <PreviewRow>
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button size="md">MD</Button>
        <Button size="lg">LG</Button>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>With icons</GroupLabel>
      <PreviewRow>
        <Button startIcon={<Plus size={16} aria-hidden />}>Add item</Button>
        <Button variant="tonal" endIcon={<ArrowRight size={16} aria-hidden />}>
          Continue
        </Button>
        <Button
          variant="outline"
          intent="secondary"
          startIcon={<Plus size={16} aria-hidden />}
        >
          New
        </Button>
      </PreviewRow>
    </GroupBlock>
  </PreviewPanel>
);

export const ChipsLabelsBadgesPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Chips</GroupLabel>
      <PreviewRow>
        <Chip>Label</Chip>
        <Chip type="success">Verified</Chip>
        <Chip type="warn">Review</Chip>
        <Chip type="info">Info</Chip>
        <Chip type="error">Blocked</Chip>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Badges</GroupLabel>
      <PreviewRow>
        <Badge>Default</Badge>
        <Badge color="primary" tone="subtle">
          Primary
        </Badge>
        <Badge color="green" tone="subtle">
          Active
        </Badge>
        <Badge color="destructive" tone="solid">
          Critical
        </Badge>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Counter</GroupLabel>
      <PreviewRow>
        <Counter count={3} />
        <Counter count={12} />
        <Counter count="9+" />
      </PreviewRow>
    </GroupBlock>
  </PreviewPanel>
);

export const FormsControlsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Radio</GroupLabel>
      <RadioGroup defaultValue="standard" aria-label="Shipping plan">
        <Radio value="standard" label="Standard" />
        <Radio value="express" label="Express" />
      </RadioGroup>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Checkbox</GroupLabel>
      <PreviewStack>
        <Checkbox label="Subscribe to product updates" defaultChecked />
        <Checkbox label="Include beta features" />
      </PreviewStack>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Toggle (switch)</GroupLabel>
      <Switch label="Enable notifications" defaultChecked />
    </GroupBlock>
  </PreviewPanel>
);

export const SlidersPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Single</GroupLabel>
      <PreviewStack $maxWidth="28rem">
        <Slider defaultValue={40} aria-label="Volume" />
      </PreviewStack>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Range</GroupLabel>
      <PreviewStack $maxWidth="28rem">
        <RangeSlider defaultValue={[20, 75]} aria-label={['Minimum price', 'Maximum price']} />
      </PreviewStack>
    </GroupBlock>
  </PreviewPanel>
);

export const TextNumberInputsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Text &amp; password</GroupLabel>
      <PreviewStack>
        <TextInput label="Email" placeholder="you@lenovo.com" />
        <PasswordInput label="Password" />
      </PreviewStack>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Number &amp; dropdown</GroupLabel>
      <PreviewStack>
        <NumberInput label="Quantity" defaultValue={2} />
        <Dropdown label="Country" options={DROPDOWN_OPTIONS} placeholder="Select…" />
      </PreviewStack>
    </GroupBlock>
  </PreviewPanel>
);

export const DateTimeInputsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Date</GroupLabel>
      <CompactField>
        <DateInput label="Appointment date" />
      </CompactField>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Time</GroupLabel>
      <CompactField>
        <TimeInput
          label="Appointment time"
          defaultValue={{ hours: '09', minutes: '30', period: 'AM' }}
        />
      </CompactField>
    </GroupBlock>
  </PreviewPanel>
);

export const FileUploaderPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>File upload</GroupLabel>
      <FileUpload />
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Document tile</GroupLabel>
      <PreviewNote>
        {withBrand(
          'A dedicated document tile is not in the hello pc package yet. Use File upload for image dropzones, or compose a Card for file summaries until that pattern ships.',
        )}
      </PreviewNote>
    </GroupBlock>
  </PreviewPanel>
);

export const SidebarPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Sidebar</GroupLabel>
      <Sidebar defaultValue="home">
        <SidebarList aria-label="Preview navigation" style={{ width: 220 }}>
          <SidebarItem value="home" icon={<Home size={16} aria-hidden />}>
            Home
          </SidebarItem>
          <SidebarItem value="shop" icon={<ShoppingBag size={16} aria-hidden />}>
            Shop
          </SidebarItem>
          <SidebarItem value="settings" icon={<Settings size={16} aria-hidden />}>
            Settings
          </SidebarItem>
        </SidebarList>
        <SidebarContent value="home">
          <SidebarPanelBox>Home panel</SidebarPanelBox>
        </SidebarContent>
        <SidebarContent value="shop">
          <SidebarPanelBox>Shop panel</SidebarPanelBox>
        </SidebarContent>
        <SidebarContent value="settings">
          <SidebarPanelBox>Settings panel</SidebarPanelBox>
        </SidebarContent>
      </Sidebar>
    </GroupBlock>
  </PreviewPanel>
);

export const TabsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Horizontal tabs</GroupLabel>
      <HorizontalTabs defaultValue="overview">
        <HorizontalTabsList aria-label="Preview sections">
          <HorizontalTabItem value="overview">Overview</HorizontalTabItem>
          <HorizontalTabItem value="details">Details</HorizontalTabItem>
          <HorizontalTabItem value="activity">Activity</HorizontalTabItem>
        </HorizontalTabsList>
        <HorizontalTabsContent value="overview">
          <PreviewNote>Overview panel content.</PreviewNote>
        </HorizontalTabsContent>
        <HorizontalTabsContent value="details">
          <PreviewNote>Details panel content.</PreviewNote>
        </HorizontalTabsContent>
        <HorizontalTabsContent value="activity">
          <PreviewNote>Activity panel content.</PreviewNote>
        </HorizontalTabsContent>
      </HorizontalTabs>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Content switcher</GroupLabel>
      <ContentSwitcher
        aria-label="View mode"
        options={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
        ]}
        defaultValue="grid"
      />
    </GroupBlock>
  </PreviewPanel>
);

export const MenusListsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Menu</GroupLabel>
      <MenuContainer role="menu" aria-label="Workspace actions" width={280}>
        <MenuItem>Refresh</MenuItem>
        <MenuItem selected>Current workspace</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </MenuContainer>
    </GroupBlock>
  </PreviewPanel>
);

export const CardsPreview = () => (
  <PreviewPanel>
    <CardGrid>
      <Card>
        <SimpleCard
          media={<MediaBlock aria-hidden />}
          title="Simple card"
          body="A vertical media card template for titles, body copy, and actions."
          actions={
            <Button size="sm" intent="secondary" variant="tonal">
              Action
            </Button>
          }
        />
      </Card>
      <Card>
        <SimpleCard
          title="Content surface"
          body="Compose Card with Simple, Content, or Hero templates depending on hierarchy."
          actions={
            <Button size="sm" variant="outline" intent="secondary">
              Learn more
            </Button>
          }
        />
      </Card>
    </CardGrid>
  </PreviewPanel>
);

export const ModalsSkrimPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <PreviewPanel>
      <GroupBlock>
        <GroupLabel>Modal + scrim</GroupLabel>
        <PreviewRow>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
        </PreviewRow>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Settings"
          subtitle="Manage your preferences"
          footer={
            <ModalFooter
              primaryActionLabel="Save"
              secondaryActionLabel="Cancel"
              onPrimaryAction={() => setOpen(false)}
              onSecondaryAction={() => setOpen(false)}
            />
          }
        >
          <ModalContent
            description={withBrand(
              'The overlay uses the hello pc scrim token with blur so the page stays visible but out of focus.',
            )}
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </GroupBlock>
    </PreviewPanel>
  );
};

export const ToastsNotificationsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Toast</GroupLabel>
      <ToastPreviewShell>
        <Toast
          status="success"
          title="Changes saved"
          description="Your preferences were updated."
          duration={Infinity}
          onDismiss={() => {}}
        />
      </ToastPreviewShell>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Notification</GroupLabel>
      <PreviewStack $maxWidth="28rem">
        <Notification
          status="info"
          title="New comment"
          description="Alex left feedback on your prototype."
          timestamp="9:00 AM"
        />
      </PreviewStack>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Notification panel</GroupLabel>
      <NotificationPanel title="Notifications" onClose={() => {}}>
        <Notification
          flush
          status="info"
          title="Design review"
          description="Your shared file was commented on."
          timestamp="Yesterday"
          onDismiss={() => {}}
        />
        <Notification
          flush
          status="success"
          title="Build complete"
          description="Storybook published successfully."
          timestamp="Mon"
          onDismiss={() => {}}
        />
      </NotificationPanel>
    </GroupBlock>
  </PreviewPanel>
);

export const AccordionsPreview = () => (
  <PreviewPanel>
    <PreviewStack $maxWidth="36rem">
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a" title={withBrand('What is hello pc?')}>
          <PreviewNote>
            {withBrand(
              "hello pc is Lenovo's design system — tokens, components, and guidance for consistent product UI.",
            )}
          </PreviewNote>
        </AccordionItem>
        <AccordionItem value="b" title="When should I use an accordion?">
          <PreviewNote>
            Use it to tuck secondary detail behind a clear heading without
            leaving the page.
          </PreviewNote>
        </AccordionItem>
      </Accordion>
    </PreviewStack>
  </PreviewPanel>
);

export const TablesPreview = () => (
  <PreviewPanel>
    <Table
      aria-label="Team members"
      header={
        <HeaderRow>
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Role</HeaderCell>
          <HeaderCell>Status</HeaderCell>
        </HeaderRow>
      }
    >
      <DataRow>
        <DataCell>Ada Lovelace</DataCell>
        <DataCell>Engineer</DataCell>
        <DataCell>
          <Badge color="green" tone="subtle">
            Online
          </Badge>
        </DataCell>
      </DataRow>
      <DataRow stripe="inverse">
        <DataCell>Alan Turing</DataCell>
        <DataCell>Research</DataCell>
        <DataCell>
          <Badge color="secondary" tone="subtle">
            Away
          </Badge>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell>Grace Hopper</DataCell>
        <DataCell>Lead</DataCell>
        <DataCell>
          <Badge color="green" tone="subtle">
            Online
          </Badge>
        </DataCell>
      </DataRow>
    </Table>
  </PreviewPanel>
);

const DocSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
`;

const DocSubhead = styled.h3`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const DocCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-300);
  width: 100%;
`;

const StretchCard = styled(Card)`
  height: 100%;
  min-height: 0;
`;

const DocCardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-400);
  box-sizing: border-box;
  height: 100%;
`;

const DocCardTitle = styled.h4`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const DocCardBody = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

const DocLead = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
  max-width: 40rem;
`;

const ThemeBlurb = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  margin: 0 0 var(--space-300);
  max-width: 40rem;
`;

const ThemeHint = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.45;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

const ThemeMetaLine = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.45;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);
`;

const ThemeMetaStrong = styled.span`
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
`;

/** Foundations Color–style swatches (GroupLabel + grid + named cards). */
const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: var(--space-200);
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  min-width: 0;
`;

const Swatch = styled.div`
  width: 100%;
  height: 48px;
  border-radius: var(--radius-150);
  background: ${(p) => p.$color};
  border: var(--stroke-100) solid var(--color-stroke-border);
  box-sizing: border-box;
`;

const SwatchName = styled.span`
  font-family: ${ROOKERY};
  font-size: 11px;
  line-height: 1.3;
  color: var(--color-text-icon-primary);
  overflow-wrap: anywhere;
`;

const DATAVIZ_WORKFLOWS = [
  {
    title: 'Designers',
    body:
      'Pick a chart, tune data and Color theme, then export a clean SVG and paste it into Figma as editable vectors — light, dark, and HCT variants stay token-aligned.',
  },
  {
    title: 'Developers',
    body:
      'Copy a themed ECharts option (and reusable theme object) from the playground so production charts match hello pc tokens without hand-picking hex values.',
  },
  {
    title: 'Presentations & deliverables',
    body:
      'Export presentation-ready SVGs for decks, docs, and reviews when you need on-brand charts outside the product UI — same playground, same themes.',
  },
];

/**
 * Color themes exposed in the playground Color theme dropdown
 * (`chart-tool-echarts` ColorControls). Recommended / not-recommended charts
 * invert `CHART_REGISTRY.recommendedThemes` plus the variation hints.
 * Swatches come from `datavisPalettes.js` (playground token stops).
 */
const DATAVIZ_COLOR_THEMES = [
  {
    label: 'Categorical',
    hint: 'Distinct hello pc tones — identical in light and dark.',
    recommended:
      'Bar / Column, Line, Area, Pie / Donut, Scatter, Jitter / Strip, Radar, Treemap, Funnel, Radial bar',
    notRecommended:
      'Heatmap, Gauge, Positive / Negative, Waterfall — those need ordered ramps or semantic meaning, not unrelated hues',
  },
  {
    label: 'Sequential',
    hint: 'Single-hue indigo ramp (light→dark).',
    recommended: 'Line, Area, Funnel, Gauge, Heatmap',
    notRecommended:
      'Pie / Donut, Scatter, Radar, Treemap, Positive / Negative, Waterfall — unrelated categories or sign meaning need other themes',
  },
  {
    label: 'Semantic',
    hint: 'Red→green ramp (bad→good) for KPI and meaning-coded charts.',
    recommended: 'Gauge, Heatmap, Positive / Negative, Waterfall',
    notRecommended:
      'Pie / Donut, Bar / Column, Treemap, Radar — discrete categories read as ranked good/bad on this ramp',
  },
  {
    label: 'Diverging',
    hint: 'Jade↔violet two-ended ramp for values around a midpoint.',
    recommended: 'Heatmap (and choropleth-style value matrices)',
    notRecommended:
      'Pie / Donut, Bar / Column, multi-series Line, Positive / Negative — not a midpoint scale or already use semantic tokens',
  },
  {
    label: 'Wireframe',
    hint: 'Multiple secondary greys; patterns kick in after six categories.',
    recommended:
      'Early comps and structure reviews for any chart — greyscale first, add hue later',
    notRecommended:
      'Production Heatmap, Gauge, Positive / Negative, Waterfall — greys and patterns hide value and sign encoding',
  },
];

const DocCard = ({ title, children }) => (
  <StretchCard elevation="low">
    <DocCardInner>
      <DocCardTitle>{title}</DocCardTitle>
      {children}
    </DocCardInner>
  </StretchCard>
);

export const DataVizPreview = () => (
  <>
    <PreviewPanel>
      <PreviewNote>
        {withBrand(
          'Data visualization is not a hello pc React component. Use the hello pc data visualization playground for themed ECharts and Figma-ready SVGs.',
        )}
      </PreviewNote>
    </PreviewPanel>

    <DocSection>
      <DocSubhead>How to use the playground</DocSubhead>
      <DocCardGrid>
        {DATAVIZ_WORKFLOWS.map((workflow) => (
          <DocCard key={workflow.title} title={workflow.title}>
            <DocCardBody>{withBrand(workflow.body)}</DocCardBody>
          </DocCard>
        ))}
      </DocCardGrid>
    </DocSection>

    <DocSection>
      <DocSubhead>Color themes</DocSubhead>
      <DocLead>
        Names match the playground&apos;s Color theme control. Swatches are the
        light-mode token stops charts use (fixed hero palettes are the same in
        dark; Wireframe greys derive from secondary). Recommended lists follow
        each chart&apos;s badges in the tool. Sample charts below each theme use
        those same palette stops.
      </DocLead>
    </DocSection>

    {DATAVIZ_COLOR_THEMES.map((theme) => {
      const swatches = DATAVIZ_THEME_SWATCHES[theme.label] ?? [];
      return (
        <DocSection key={theme.label}>
          <PreviewPanel>
            <GroupBlock>
              <GroupLabel>{theme.label}</GroupLabel>
              <ThemeBlurb>
                <ThemeHint>{withBrand(theme.hint)}</ThemeHint>
                <ThemeMetaLine>
                  <ThemeMetaStrong>Recommended — </ThemeMetaStrong>
                  {theme.recommended}
                </ThemeMetaLine>
                <ThemeMetaLine>
                  <ThemeMetaStrong>Not recommended — </ThemeMetaStrong>
                  {theme.notRecommended}
                </ThemeMetaLine>
              </ThemeBlurb>
              <SwatchGrid>
                {swatches.map((stop) => (
                  <SwatchCard key={stop.name}>
                    <Swatch
                      $color={stop.color}
                      title={`${stop.name} · ${stop.color}`}
                      aria-label={stop.name}
                    />
                    <SwatchName>{stop.name}</SwatchName>
                  </SwatchCard>
                ))}
              </SwatchGrid>
              <Suspense
                fallback={
                  <ChartsSuspenseFallback>Loading sample charts…</ChartsSuspenseFallback>
                }
              >
                <DatavisThemeCharts themeLabel={theme.label} />
              </Suspense>
            </GroupBlock>
          </PreviewPanel>
        </DocSection>
      );
    })}
  </>
);

export const AvatarsPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Photo</GroupLabel>
      <PreviewRow>
        <Avatar size="sm" src={AVATAR_PHOTO} alt="Ada Lovelace" initials="AL" />
        <Avatar size="md" src={AVATAR_PHOTO} alt="Ada Lovelace" initials="AL" />
        <Avatar size="lg" src={AVATAR_PHOTO} alt="Ada Lovelace" initials="AL" />
        <Avatar
          size="md"
          src={AVATAR_PHOTO}
          alt="Ada Lovelace"
          initials="AL"
          badge
        />
        <Avatar
          size="md"
          src={AVATAR_PHOTO}
          alt="Ada Lovelace"
          initials="AL"
          selected
        />
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Initials</GroupLabel>
      <PreviewRow>
        <Avatar size="sm" initials="SM" />
        <Avatar size="md" initials="MD" />
        <Avatar size="lg" initials="LG" />
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Fallback glyph</GroupLabel>
      <PreviewRow>
        <Avatar size="md" />
        <Avatar size="md" selected />
        <Avatar size="md" badge />
      </PreviewRow>
    </GroupBlock>
  </PreviewPanel>
);

export const TooltipsOnboardingPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Simple tooltip</GroupLabel>
      <PreviewRow>
        <SimpleTooltip trigger={<Button intent="secondary" variant="outline">Hover me</Button>}>
          Short helper text for a control.
        </SimpleTooltip>
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Rich tooltip</GroupLabel>
      <PreviewRow>
        <RichTooltip
          trigger={<Button intent="secondary" variant="tonal">Learn more</Button>}
          title="Onboarding tip"
        >
          Rich tooltips carry a title plus longer guidance. A dedicated
          onboarding coach-mark component is not in the package yet — compose
          RichTooltip or Modal for guided moments.
        </RichTooltip>
      </PreviewRow>
    </GroupBlock>
  </PreviewPanel>
);

export const BreadcrumbsPaginationPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Breadcrumb</GroupLabel>
      <Breadcrumb
        items={[
          { label: 'Products', href: '#products' },
          { label: 'Laptops', href: '#laptops' },
          { label: 'X1 Carbon' },
        ]}
      />
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Pagination</GroupLabel>
      <Pagination count={5} defaultPage={1} />
    </GroupBlock>
  </PreviewPanel>
);

export const ProgressSteppersPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Progress bar</GroupLabel>
      <PreviewStack $maxWidth="28rem">
        <ProgressBar value={45} />
      </PreviewStack>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Spinner</GroupLabel>
      <PreviewRow>
        <Spinner aria-label="Loading" />
      </PreviewRow>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Stepper</GroupLabel>
      <Stepper
        steps={[
          { title: 'Account', description: 'Profile basics' },
          { title: 'Plan', description: 'Choose a tier' },
          { title: 'Done', description: 'Confirm' },
        ]}
        activeIndex={1}
      />
    </GroupBlock>
  </PreviewPanel>
);

export const ScrollbarPreview = () => (
  <PreviewPanel>
    <ScrollPreviewFrame>
      <Scrollbar type="always" maxHeight={180}>
        {Array.from({ length: 14 }, (_, index) => (
          <ScrollPreviewRow key={index}>
            Scroll row {index + 1} — tokenized thumb stays visible while you
            browse overflowing content.
          </ScrollPreviewRow>
        ))}
      </Scrollbar>
    </ScrollPreviewFrame>
  </PreviewPanel>
);
