import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Toast as RadixToast } from 'radix-ui';
import { Copy as CopyIcon, ExternalLink } from 'lucide-react';
import { Button } from '../../hellopc/components/Button';
import { Card } from '../../hellopc/components/Card';
import { SimpleCard } from '../../hellopc/components/Card/SimpleCard';
import { Chip } from '../../hellopc/components/Chip/Chip';
import { ModalIcon } from '../../hellopc/components/Modal/ModalIcon';
import { Toast } from '../../hellopc/components/Toast';
import { BrandName, withBrand } from '../../components/BrandName';
import {
  VerticalTabs,
  VerticalTabsList,
  VerticalTabsContent,
} from '../../hellopc/components/VerticalTabs/VerticalTabs';
import { VerticalTabItem } from '../../hellopc/components/VerticalTabs/VerticalTabItem';
import { pageGutterX, stickyDocsRail } from '../../styles/pageChrome';
import { StickyWallpaper } from '../HomePage';
import heroBg from '../../assets/home/hero-bg.png';
import SoundLibrary from './SoundLibrary';
import { SoundPlayerProvider } from './SoundPreview';

const ROOKERY = "'Rookery New', Rookery, var(--font-family)";

const Page = styled.div`
  --page-on-media: #ffffff;
  position: relative;
  width: 100%;
  min-height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);

  html[data-theme='win hct'] & {
    --page-on-media: #000000;
  }
`;

const Layer = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ToastViewport = styled(RadixToast.Viewport)`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: var(--space-400);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-300);
  width: min(calc(100% - var(--space-800)), 40rem);
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
`;

const Hero = styled.section`
  display: flex;
  align-items: flex-end;
  min-height: 200px;
  padding-top: var(--space-200);
  padding-bottom: var(--space-200);
  ${pageGutterX}
  box-sizing: border-box;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--page-on-media);
`;

const Content = styled.section`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(45px);
  background: var(--color-surfaces-container-blur-high);
  box-shadow: var(--elevation-5);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
  display: flex;
  flex-direction: column;
`;

const Layout = styled(VerticalTabs)`
  display: grid !important;
  grid-template-columns: 220px minmax(0, 1fr);
  align-items: start;
  gap: var(--space-500);
  width: 100%;
  max-width: none;
  flex: 1;
  min-height: 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Rail = styled(VerticalTabsList)`
  ${stickyDocsRail}
`;

const Panel = styled(VerticalTabsContent)`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
  width: 100%;
  max-width: none;
  min-width: 0;

  &[data-state='inactive'],
  &[hidden] {
    display: none;
  }

  @media (max-width: 720px) {
    grid-column: 1;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  max-width: 48rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: ${ROOKERY};
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-regular);
  line-height: 1.25;
`;

const Subhead = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: ${ROOKERY};
  font-size: var(--type-size-subtitle);
  line-height: 1.35;
`;

const Lead = styled.p`
  margin: 0;
  max-width: 52rem;
  color: var(--color-text-icon-primary);
  font-family: ${ROOKERY};
  font-size: var(--type-size-title);
  line-height: 1.45;
`;

const Copy = styled.p`
  margin: 0;
  max-width: 48rem;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  line-height: 1.55;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 3}, minmax(0, 1fr));
  align-items: stretch;
  gap: var(--space-300);

  & > * {
    align-self: stretch;
    min-height: 0;
  }

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled(Card)`
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  [data-fill-card] {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  [data-fill-card] > div {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  [data-fill-card] > div > div:first-child {
    flex: 1 1 auto;
  }

  [data-fill-card] > div > div:last-child:not(:only-child) {
    margin-top: auto;
    justify-content: flex-start;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200);
`;

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const EditorialTemplate = styled(SimpleCard).attrs({
  'data-fill-card': true,
})``;

const TitleCluster = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-200);
`;

const SECTIONS = [
  { id: 'overview', label: 'Overview', path: '/sound' },
  { id: 'library', label: 'Sound library', path: '/sound/library' },
  { id: 'prompting', label: 'Prompting', path: '/sound/prompting' },
];

const SOUND_REPO_URL = 'https://github.com/cake-admin/cake-sound-library';

const openExternal = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

const useCases = [
  ['Confirm', ['Success', 'Completion', 'Connected', 'Enabled']],
  ['Guide', ['Volume up', 'Volume down', 'Brightness up', 'Brightness down']],
  ['Alert', ['Warning', 'Error', 'Critical', 'Low battery']],
  ['State', ['Camera open', 'Camera closed', 'Microphone mute', 'Microphone unmute']],
  ['System', ['Startup', 'Shutdown', 'Charger connected', 'Charger disconnected']],
];

const brandCharacter = [
  ['Precise', 'Every onset has a reason; tails stop before they obscure the next action.'],
  ['Calm', 'Attention comes from contrast and timing, not loudness or alarmism.'],
  [
    'Connected',
    'Paired points, converging motion, and resolved tails suggest systems working together.',
  ],
  [
    'Tactile',
    'Felt, ceramic, coated glass, soft wood, and filtered air keep feedback physical but refined.',
  ],
  [
    'Professional',
    'Restrained detail and balanced tone support repeated use in work environments.',
  ],
];

const acousticPalette = [
  ['Tactile core', 'Presses, boundaries, state changes', ['felt', 'ceramic', 'coated polymer', 'soft wood']],
  [
    'Connected signal',
    'Completions, arrivals, successful joins',
    ['paired points', 'converging accents', 'one shared tail'],
  ],
  [
    'Spatial air',
    'Navigation, reveals, background progress',
    ['filtered air', 'narrow sweeps', 'shallow halos'],
  ],
  [
    'Priority edge',
    'Warnings and critical conditions',
    ['rounded glass', 'firm felt', 'controlled brightness'],
  ],
];

const promptIngredients = [
  ['Purpose', 'Confirm, Guide, Alert, State, or System — the job the cue has to do.'],
  [
    'Material',
    'Name a hello pc surface: felt, ceramic, coated polymer, soft wood, paired points, filtered air, or rounded glass.',
  ],
  ['Character', 'Precise, Calm, Connected, Tactile, Professional — at least one, better two.'],
  [
    'Shape',
    'Short one-shot, 100–400 ms. Rising or falling pairs for connected grammar. Tails that stop before the next action.',
  ],
];

const promptWritingRules = [
  [
    'Describe the cue, not the story',
    'Write what it sounds like. Prefer “UI confirm, soft felt tap” over “the sound of a successful save.”',
  ],
  [
    'One sound per generation',
    'Do not chain scenes. Generate a single one-shot, then layer in an editor if you truly need more.',
  ],
  [
    'Commas for traits, not paragraphs',
    'Purpose, material, character, duration, one-shot, and exclusions can live on one line.',
  ],
  [
    'Say what it must not be',
    'End with exclusions: no sci-fi, no cinematic trailer, no alarm, no long reverb, no glitch, no braam.',
  ],
];

const promptExamples = [
  [
    'Confirm',
    'UI confirm, soft felt tap with a paired ceramic accent, warm precise calm, 250 milliseconds, one-shot, no reverb, no sci-fi, no alarm',
  ],
  [
    'Guide',
    'UI volume up, coated glass tick with a slight rising pair of points, tactile connected, 180 milliseconds, one-shot, quiet, no whoosh tail',
  ],
  [
    'Alert',
    'UI warning, rounded glass with firm felt, controlled brightness, 300 milliseconds, one-shot, calm not alarmist, no buzzer, no glitch',
  ],
  [
    'State',
    'UI camera open, filtered air with a shallow halo and a short felt boundary, professional restrained, 220 milliseconds, one-shot, no cinematic impact',
  ],
];

const copyPrompt = async (text) => {
  if (!navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const CopyPromptButton = ({ text, onCopied }) => (
  <Button
    intent="secondary"
    variant="fill"
    size="sm"
    endIcon={<CopyIcon size={16} aria-hidden />}
    onClick={async () => {
      if (await copyPrompt(text)) onCopied?.();
    }}
  >
    Copy prompt
  </Button>
);

const EditorialCard = ({ title, body, tags, actions, tone }) => (
  <Tile elevation="low">
    <EditorialTemplate
      title={
        tone ? (
          <TitleCluster>
            <ModalIcon type={tone} decorative />
            {title}
          </TitleCluster>
        ) : (
          title
        )
      }
      body={typeof body === 'string' ? withBrand(body) : body}
      actions={
        actions ??
        (tags?.length ? (
          <TagList aria-label={`${title} materials`}>
            {tags.map((tag) => (
              <li key={tag}>
                <Chip type="secondary" size="sm">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Chip>
              </li>
            ))}
          </TagList>
        ) : undefined)
      }
    />
  </Tile>
);

const tabFromPath = (pathname) => {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return SECTIONS.find((section) => section.path === normalized)?.id ?? 'overview';
};

const pathForTab = (value) =>
  SECTIONS.find((section) => section.id === value)?.path ?? '/sound';

const SoundPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab = tabFromPath(pathname);
  const [copyToastOpen, setCopyToastOpen] = useState(false);

  const notifyCopied = () => {
    setCopyToastOpen(false);
    requestAnimationFrame(() => setCopyToastOpen(true));
  };

  return (
    <RadixToast.Provider>
    <SoundPlayerProvider>
      <Page>
        <StickyWallpaper aria-hidden>
          <img src={heroBg} alt="" />
        </StickyWallpaper>
        <Layer>
          <Hero>
            <HeroTitle>Sound</HeroTitle>
          </Hero>

          <Content>
            <Layout
              value={activeTab}
              onValueChange={(value) => navigate(pathForTab(value))}
            >
              <Rail aria-label="Sound sections">
                {SECTIONS.map((section) => (
                  <VerticalTabItem key={section.id} value={section.id}>
                    {section.label}
                  </VerticalTabItem>
                ))}
              </Rail>

              <Panel value="overview">
                <Section>
                    <Block>
                      <SectionHeader>
                        <SectionTitle>Overview</SectionTitle>
                        <Lead>
                          Sound is another layer of the interface. It carries the
                          principles, characteristics, and behaviors that make software
                          sound unmistakably part of the <BrandName /> experience.
                        </Lead>
                        <Copy>
                          This vocabulary helps teams select and evaluate sound with the
                          same care used for color, typography, material, and motion.
                          Sound reinforces information; it never replaces the visual or
                          textual experience.
                        </Copy>
                      </SectionHeader>
                      <Actions>
                        <Button
                          intent="primary"
                          variant="fill"
                          size="md"
                          onClick={() => navigate('/sound/library')}
                        >
                          Explore the sound library
                        </Button>
                        <Button
                          intent="secondary"
                          variant="outline"
                          size="md"
                          endIcon={<ExternalLink size={16} aria-hidden />}
                          onClick={() => openExternal(SOUND_REPO_URL)}
                        >
                          View source on GitHub
                        </Button>
                      </Actions>
                    </Block>

                    <Block>
                      <SectionHeader>
                        <Subhead>Brand character</Subhead>
                        <Copy>
                          <strong>hello</strong> audio should clarify what changed, preserve focus,
                          and make connected systems feel coherent.
                        </Copy>
                      </SectionHeader>
                      <Grid $columns={4}>
                        {brandCharacter.map(([title, body]) => (
                          <EditorialCard key={title} title={title} body={body} />
                        ))}
                      </Grid>
                    </Block>

                    <Block>
                      <SectionHeader>
                        <Subhead>Acoustic palette</Subhead>
                      </SectionHeader>
                      <Grid>
                        {acousticPalette.map(([title, body, tags]) => (
                          <EditorialCard
                            key={title}
                            title={title}
                            body={body}
                            tags={tags}
                          />
                        ))}
                      </Grid>
                    </Block>

                    <Block>
                      <SectionHeader>
                        <Subhead>When to use sound</Subhead>
                        <Copy>
                          Organize sound by what the user needs to understand or do.
                        </Copy>
                      </SectionHeader>
                      <Grid>
                        {useCases.map(([title, items]) => (
                          <EditorialCard
                            key={title}
                            title={title}
                            body={items.join(' · ')}
                          />
                        ))}
                      </Grid>
                    </Block>

                    <Block>
                      <SectionHeader>
                        <Subhead>When not to use sound</Subhead>
                        <Copy>
                          Introduce sound only when it adds meaningful information. Do
                          not add a cue simply to decorate a transition, repeat obvious
                          visual feedback, or fill silence. Frequent actions should
                          remain quiet unless sound materially improves awareness or
                          confidence.
                        </Copy>
                      </SectionHeader>
                    </Block>
                </Section>
              </Panel>

              <Panel value="library">
                <Section>
                    <Block>
                      <SectionHeader>
                        <SectionTitle>
                          <BrandName /> sound library
                        </SectionTitle>
                        <Copy>
                          Search the official library, filter by type, compare variants,
                          and play each asset. Waveforms are static visualizations
                          generated from the real audio data.
                        </Copy>
                      </SectionHeader>
                      <SoundLibrary />
                    </Block>
                </Section>
              </Panel>

              <Panel value="prompting">
                <Section>
                  <Block>
                    <SectionHeader>
                      <SectionTitle>
                        Prompt a <BrandName /> sound
                      </SectionTitle>
                      <Lead>
                        Write the prompt so a generated cue could sit next to Confirm
                        Up without sounding like a different product.
                      </Lead>
                      <Copy>
                        Name purpose, material, character, and duration in one line.
                        If any of those is missing, the model will invent a generic
                        notification. These prompts work in Firefly, ElevenLabs, and
                        similar text-to-SFX tools — set duration when the tool allows,
                        generate several variations, and listen next to the library.
                      </Copy>
                    </SectionHeader>
                  </Block>

                  <Block>
                    <SectionHeader>
                      <Subhead>Prompt recipe</Subhead>
                      <Copy>
                        Lock every ingredient to <BrandName /> DNA. Do not invent a
                        second palette or a cinematic vocabulary.
                      </Copy>
                    </SectionHeader>
                    <Grid $columns={4}>
                      {promptIngredients.map(([title, body]) => (
                        <EditorialCard key={title} title={title} body={body} />
                      ))}
                    </Grid>
                  </Block>

                  <Block>
                    <SectionHeader>
                      <Subhead>How to write it</Subhead>
                    </SectionHeader>
                    <Grid $columns={4}>
                      {promptWritingRules.map(([title, body]) => (
                        <EditorialCard key={title} title={title} body={body} />
                      ))}
                    </Grid>
                  </Block>

                  <Block>
                    <SectionHeader>
                      <Subhead>Example prompts</Subhead>
                      <Copy>
                        Paste one of these as a starting point, then swap purpose or
                        material to match the interaction.
                      </Copy>
                    </SectionHeader>
                    <Grid>
                      {promptExamples.map(([title, prompt]) => (
                        <EditorialCard
                          key={title}
                          title={title}
                          body={prompt}
                          actions={<CopyPromptButton text={prompt} onCopied={notifyCopied} />}
                        />
                      ))}
                    </Grid>
                  </Block>

                  <Block>
                    <SectionHeader>
                      <Subhead>Do / Don’t</Subhead>
                    </SectionHeader>
                    <Grid $columns={2}>
                      <EditorialCard
                        title="Do"
                        tone="success"
                        body="Short, felt / ceramic / wood / glass, paired points, one-shot, work-appropriate. Generate variations and listen against the hello pc sound library."
                      />
                      <EditorialCard
                        title="Don’t"
                        tone="error"
                        body="Braam, glitch, drone, sci-fi, trailer hit, looping ambience, speech, music, robotic, loud explosion, or “the sound of…”"
                      />
                    </Grid>
                  </Block>
                </Section>
              </Panel>
            </Layout>
          </Content>
        </Layer>
        <Toast
          status="success"
          title="Prompt copied to clipboard"
          open={copyToastOpen}
          onOpenChange={setCopyToastOpen}
          onDismiss={() => setCopyToastOpen(false)}
        />
        <ToastViewport />
      </Page>
    </SoundPlayerProvider>
    </RadixToast.Provider>
  );
};

export default SoundPage;
