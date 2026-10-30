import VersionControl from '../pages/VersionControl';
import WhatsNew from '../pages/WhatsNew';
import Resources from '../pages/Resources';
import SoundPage from '../pages/SoundPage';
import FoundationsPage from '../pages/foundations/FoundationsPage';
import ComponentsPage from '../pages/ComponentsPage';
import HomePage from '../pages/HomePage';

/**
 * Site routes after the hello pc retheme.
 * Component docs live in Storybook — see `/components`.
 * AI styling and tone of voice live inside Foundations (rail tabs).
 */
export const routes = [
  {
    path: '/',
    component: HomePage,
    title: 'Home',
    description: 'hello pc design system home',
    category: 'resources',
  },
  {
    path: '/resources',
    component: Resources,
    title: 'Resources',
    description: 'Figma libraries and design resources',
    category: 'resources',
  },
  {
    path: '/resources/whats-new',
    component: WhatsNew,
    title: "What's new",
    description: 'Latest updates and changes',
    category: 'resources',
  },
  {
    path: '/sound',
    component: SoundPage,
    title: 'Sound overview',
    description:
      'Guidelines, assets, and documentation for creating consistent sound and audio experiences across Lenovo software.',
    category: 'resources',
  },
  {
    path: '/sound/library',
    component: SoundPage,
    title: 'hello pc sound library',
    description: 'Search, filter, compare, and play official hello pc sound assets',
    category: 'resources',
  },
  {
    path: '/sound/prompting',
    component: SoundPage,
    title: 'Prompt a hello pc sound',
    description:
      'Write text-to-sound prompts so generated UI cues share hello pc DNA and belong with the official library',
    category: 'resources',
  },
  {
    path: '/foundations',
    component: FoundationsPage,
    title: 'Foundations',
    description: 'Core design foundations',
    category: 'foundations',
  },
  {
    path: '/foundations/ai',
    component: FoundationsPage,
    title: 'AI styling',
    description: 'Lenovo AI visual language',
    category: 'foundations',
  },
  {
    path: '/foundations/ai/overview',
    component: FoundationsPage,
    title: 'AI Overview',
    description: 'Overview of Lenovo\'s hybrid, tiered AI visual system and design principles',
    category: 'foundations',
  },
  {
    path: '/foundations/ai/gradient',
    component: FoundationsPage,
    title: 'AI Gradient',
    description: 'AI gradient visual treatments and usage guidelines',
    category: 'foundations',
  },
  {
    path: '/foundations/ai/logo-icon',
    component: FoundationsPage,
    title: 'AI Logo & Icon',
    description: 'AI logo and icon system guidance for Lenovo products',
    category: 'foundations',
  },
  {
    path: '/components',
    component: ComponentsPage,
    title: 'Components',
    description: 'hello pc component catalog and live previews',
    category: 'components',
  },
  {
    path: '/version-control',
    component: VersionControl,
    title: 'Version Control',
    description: 'Version history and changelog',
    category: 'resources',
  },
];

export const getSearchResults = (query) => {
  if (!query.trim()) return { components: [], foundations: [], resources: [], guides: [] };

  const lowerQuery = query.toLowerCase();
  const results = {
    components: [],
    foundations: [],
    resources: [],
    guides: [],
  };

  routes.forEach((route) => {
    const matchesTitle = route.title.toLowerCase().includes(lowerQuery);
    const matchesDescription = route.description.toLowerCase().includes(lowerQuery);
    const matchesPath = route.path.toLowerCase().includes(lowerQuery);

    if (matchesTitle || matchesDescription || matchesPath) {
      const bucket = results[route.category] ? route.category : 'guides';
      results[bucket].push({
        title: route.title,
        path: route.path,
        description: route.description,
      });
    }
  });

  return results;
};
