import { storybookDocs } from './chrome';
import {
  AccordionsPreview,
  AvatarsPreview,
  BreadcrumbsPaginationPreview,
  ButtonPreview,
  CardsPreview,
  ChipsLabelsBadgesPreview,
  DataVizPreview,
  DateTimeInputsPreview,
  FileUploaderPreview,
  FormsControlsPreview,
  MenusListsPreview,
  ModalsSkrimPreview,
  ProgressSteppersPreview,
  ScrollbarPreview,
  SidebarPreview,
  SlidersPreview,
  TablesPreview,
  TabsPreview,
  TextNumberInputsPreview,
  ToastsNotificationsPreview,
  TooltipsOnboardingPreview,
} from './previews';

/**
 * Rail taxonomy + panel copy. Storybook slugs follow each primary *.stories.tsx
 * title (e.g. Components/Chip → components-chip--docs).
 */
export const CATEGORIES = [
  {
    id: 'controls',
    label: 'Controls',
    items: [
      { id: 'buttons', label: 'Buttons' },
      { id: 'chips-labels-badges', label: 'Chips, labels, badges' },
      { id: 'radio-checkbox-toggle-forms', label: 'Radio, checkbox, toggle, forms' },
      { id: 'sliders', label: 'Sliders' },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    items: [
      { id: 'text-number-inputs', label: 'Text & number inputs' },
      { id: 'date-time-inputs', label: 'Date & time inputs' },
      { id: 'file-uploader', label: 'File uploader, document tile' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'menus-lists', label: 'Menus & lists' },
    ],
  },
  {
    id: 'containers',
    label: 'Containers',
    items: [
      { id: 'cards', label: 'Cards' },
      { id: 'modals-skrim', label: 'Modals & skrim' },
      { id: 'toasts-notifications', label: 'Toasts & notifications' },
      { id: 'accordions', label: 'Accordions' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    items: [
      { id: 'tables', label: 'Tables' },
      { id: 'data-visualization', label: 'Data Visualization' },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities',
    items: [
      { id: 'avatars', label: 'Avatars' },
      { id: 'tooltips-onboarding', label: 'Tooltips, onboarding' },
      { id: 'breadcrumbs-pagination', label: 'Breadcrumbs, pagination' },
      { id: 'progress-steppers', label: 'Progress indicators, steppers' },
      { id: 'scrollbar', label: 'Scrollbar' },
    ],
  },
];

export const PANELS = [
  {
    id: 'buttons',
    title: 'Buttons',
    storybook: storybookDocs('components-button-button--docs'),
    paragraphs: [
      'Buttons are how people take action in hello pc — pill-shaped, clear, and ranked by how much attention the action deserves. Use one strong fill button for the main thing to do; outline, tonal, and ghost step down for supporting or quieter actions.',
      'Pair primary (indigo) or secondary (ink) intent with a size that fits the density of the screen. Browse the live examples below, then open Storybook for the full props, states, and accessibility notes.',
    ],
    Preview: ButtonPreview,
  },
  {
    id: 'chips-labels-badges',
    title: 'Chips, labels, badges',
    storybook: storybookDocs('components-chip--docs'),
    paragraphs: [
      'Chips, badges, and counters are the small status marks that sit beside content. Chips call out a tag or state; badges mark severity; counters show unread or quantity counts.',
      'Reach for Chip when the label itself may be interactive or dismissible, Badge when you need a compact status mark, and Counter when a number needs to stay visible next to an icon or tab.',
    ],
    Preview: ChipsLabelsBadgesPreview,
  },
  {
    id: 'radio-checkbox-toggle-forms',
    title: 'Radio, checkbox, toggle, forms',
    storybook: storybookDocs('components-radio--docs'),
    paragraphs: [
      'These controls collect choices without looking like buttons. Radios pick one option from a short set, checkboxes allow many, and Switch flips a single setting on or off.',
      'Prefer radios when options are mutually exclusive and visible at once; use a dropdown when the list is long. Keep labels short and specific so the choice is obvious without extra helper text.',
    ],
    Preview: FormsControlsPreview,
  },
  {
    id: 'sliders',
    title: 'Sliders',
    storybook: storybookDocs('components-slider-single--docs'),
    paragraphs: [
      'Sliders let people pick a value along a continuous range — volume, price filters, opacity — with a thumb they can drag or nudge from the keyboard.',
      'Use a single slider for one value and a range slider when the ends of an interval both matter. Always pair with a visible or accessible name so the control is not just a floating track.',
    ],
    Preview: SlidersPreview,
  },
  {
    id: 'text-number-inputs',
    title: 'Text & number inputs',
    storybook: storybookDocs('components-text-input--docs'),
    paragraphs: [
      'Text, password, number, and dropdown fields are the everyday form building blocks. They share label, helper, and validation patterns so forms feel consistent across products.',
      'Use Text Input for freeform strings, Number Input for quantities, Password Input when secrets need a reveal control, and Dropdown when choosing from a known list beats typing.',
    ],
    Preview: TextNumberInputsPreview,
  },
  {
    id: 'date-time-inputs',
    title: 'Date & time inputs',
    storybook: storybookDocs('components-date-input--docs'),
    paragraphs: [
      'Date and time inputs capture calendar and clock values with hello pc field chrome — labels, helpers, and validation that match other inputs.',
      'Use them for appointments, filters, and scheduling. Prefer the dedicated Date and Time components over plain text fields so formatting and keyboard behavior stay consistent.',
    ],
    Preview: DateTimeInputsPreview,
  },
  {
    id: 'file-uploader',
    title: 'File uploader, document tile',
    storybook: storybookDocs('components-file-upload--docs'),
    paragraphs: [
      'File Upload is the image dropzone for browsing or dragging a file into the product. It handles hover, drag, loading, error, and uploaded states with the shared Button and Helper String pieces.',
      'A separate document tile pattern is not in the package yet — for file summaries, compose Card until that component ships. Open Storybook for accept rules, size limits, and accessibility details.',
    ],
    Preview: FileUploaderPreview,
  },
  {
    id: 'sidebar',
    title: 'Sidebar',
    storybook: storybookDocs('components-sidebar-sidebar--docs'),
    paragraphs: [
      'Sidebar is the vertical rail for switching in-page views — items, sub-items, blocks, and an optional Sidebar Nav shell with product chrome and scroll.',
      'Use it for secondary navigation that stays alongside content. Open Storybook for nested items, sections, and the full Sidebar Nav pattern.',
    ],
    Preview: SidebarPreview,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    storybook: storybookDocs('components-horizontal-tabs-horizontal-tabs--docs'),
    paragraphs: [
      'Tabs switch between peer panels in the same view. Horizontal Tabs are the primary pattern; Content Switcher is a compact segmented control when you only need to change mode, not host panels.',
      'This Components hub uses Vertical Tabs for its own category rail. Prefer horizontal tabs for page-level sections and content switchers for grid/list or similar binary modes.',
    ],
    Preview: TabsPreview,
  },
  {
    id: 'menus-lists',
    title: 'Menus & lists',
    storybook: storybookDocs('components-menu-menu-container--docs'),
    paragraphs: [
      'Menus surface actions and choices in an elevated list — Menu Container for the surface, Menu Item for each row, and Menu Header for group labels inside a real dropdown menu root.',
      'Use menus for overflow actions and contextual choices; use Dropdown when the control is a form field that stores a selected value.',
    ],
    Preview: MenusListsPreview,
  },
  {
    id: 'cards',
    title: 'Cards',
    storybook: storybookDocs('components-card-card--docs'),
    paragraphs: [
      'Card is the elevated surface that frames content. Slot Simple, Content, or Hero templates inside for media, titles, body copy, and actions without inventing a one-off container.',
      'Reach for cards when a block of content is selectable or actionable as a unit. If removing the surface does not hurt understanding, prefer plain layout instead.',
    ],
    Preview: CardsPreview,
  },
  {
    id: 'modals-skrim',
    title: 'Modals & skrim',
    storybook: storybookDocs('components-modal-modal--docs'),
    paragraphs: [
      'Modals interrupt the page for a focused task. The scrim (overlay) dims and blurs the background so attention stays on the dialog — title, content, and footer actions.',
      'Use a modal when the user must confirm or complete something before continuing. Prefer inline patterns for optional or non-blocking detail.',
    ],
    Preview: ModalsSkrimPreview,
  },
  {
    id: 'toasts-notifications',
    title: 'Toasts & notifications',
    storybook: storybookDocs('components-toast--docs'),
    paragraphs: [
      'Toasts are transient feedback that appear without blocking the page. Notifications and Notification Panel cover persistent inbox-style messages with status, timestamp, and dismiss.',
      'Use Toast for short confirmations, Notification for richer message rows, and Notification Panel when people need a scrollable list of recent alerts.',
    ],
    Preview: ToastsNotificationsPreview,
  },
  {
    id: 'accordions',
    title: 'Accordions',
    storybook: storybookDocs('components-accordion--docs'),
    paragraphs: [
      'Accordions tuck secondary content behind clear headings so long pages stay scannable. People expand only what they need without leaving the screen.',
      'Use them for FAQs, optional settings, and progressive disclosure — not for primary navigation or content everyone must see immediately.',
    ],
    Preview: AccordionsPreview,
  },
  {
    id: 'tables',
    title: 'Tables',
    storybook: storybookDocs('components-table-table--docs'),
    paragraphs: [
      'Tables present structured rows of data with header cells, optional action bars, selection, and pagination in the footer. They are composition shells — you assemble the rows and cells.',
      'Use tables for comparable records. Prefer cards or lists when each item needs a richer visual layout than columns allow.',
    ],
    Preview: TablesPreview,
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization',
    paragraphs: [
      'Charts and data viz live outside the core hello pc component package. The hello pc data visualization playground generates themed ECharts code and Figma-ready SVGs so charts stay on-brand.',
      'Use the playground steps below for design, engineering, and presentations, then match Color theme choices to the chart type — the same names as the playground dropdown.',
    ],
    ctas: [
      {
        label: 'Try the playground',
        href: 'https://cake.lenovo.com/datavis/',
        intent: 'secondary',
        external: true,
      },
    ],
    Preview: DataVizPreview,
  },
  {
    id: 'avatars',
    title: 'Avatars',
    storybook: storybookDocs('components-avatar--docs'),
    paragraphs: [
      'Avatars represent a person with a photo when available, then initials, then a person glyph. Optional selection and presence treatments cover common people UIs.',
      'Use them in lists, headers, comments, and assignment pickers. Keep sizes consistent within a region so faces align cleanly.',
    ],
    Preview: AvatarsPreview,
  },
  {
    id: 'tooltips-onboarding',
    title: 'Tooltips, onboarding',
    storybook: storybookDocs('components-tooltip-simple--docs'),
    paragraphs: [
      'Simple Tooltip adds short helper text on hover or focus. Rich Tooltip carries a title and longer guidance when a control needs more explanation.',
      'A dedicated onboarding coach-mark is not in the package yet — compose Rich Tooltip or Modal for guided moments, and keep tips short enough to read in a glance.',
    ],
    Preview: TooltipsOnboardingPreview,
  },
  {
    id: 'breadcrumbs-pagination',
    title: 'Breadcrumbs, pagination',
    storybook: storybookDocs('components-breadcrumb--docs'),
    paragraphs: [
      'Breadcrumbs show where the current page sits in a hierarchy. Pagination moves through multi-page tables and lists with numbered pages or a compact dropdown style.',
      'Use breadcrumbs for deep IA and pagination whenever a dataset is split across pages. Both use proper nav landmarks and current-page semantics.',
    ],
    Preview: BreadcrumbsPaginationPreview,
  },
  {
    id: 'progress-steppers',
    title: 'Progress indicators, steppers',
    storybook: storybookDocs('components-progress-indicators-progress-bar--docs'),
    paragraphs: [
      'Progress Bar and Spinner show that something is working. Stepper walks people through a multi-step flow with clear complete, current, and upcoming stages.',
      'Use a spinner for indeterminate waits, a progress bar when percent complete is known, and a stepper when the path itself is part of the UI.',
    ],
    Preview: ProgressSteppersPreview,
  },
  {
    id: 'scrollbar',
    title: 'Scrollbar',
    storybook: storybookDocs('elements-scrollbar--docs'),
    paragraphs: [
      'Scrollbar is the tokenized scroll surface for overflowing content — thin at rest, wider while interacting — so menus, rails, and panels share one look.',
      'Wrap overflowing regions with Scrollbar. Surfaces that cannot host ScrollArea should use nativeScrollbarStyles so native overflow still matches.',
    ],
    Preview: ScrollbarPreview,
  },
];
