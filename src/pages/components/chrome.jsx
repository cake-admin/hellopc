import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from 'lucide-react';
import { Button } from '../../hellopc/components/Button';
import { VerticalTabsSectionHeader } from '../../hellopc/components/VerticalTabs/VerticalTabsSection';
import { STORYBOOK_PATH } from '../../data/nav';
import { withBrand } from '../../components/BrandName';

/** Story title `Components/Button/Button` → docs path */
export const storybookDocs = (slug) => `${STORYBOOK_PATH}?path=/docs/${slug}`;

export const ROOKERY = `'Rookery New', Rookery, var(--font-family)`;

export const openExternal = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

/**
 * Category group in the rail. Extra top margin between groups so Controls /
 * Inputs / Navigation read as separate sections, not one flat list.
 */
export const RailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;

  & + & {
    margin-top: var(--space-400);
    padding-top: var(--space-300);
    border-top: var(--stroke-100) solid var(--color-stroke-border);
  }
`;

/**
 * Section titles vs tab links: uppercase muted caption (like preview GroupLabel),
 * not body-weight primary text like VerticalTabItem.
 */
export const RailSectionTitle = styled(VerticalTabsSectionHeader)`
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
  padding-top: var(--space-100);
  padding-bottom: var(--space-150);
  white-space: normal;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: -0.4px;
  color: var(--color-text-icon-primary);
`;

export const SectionCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  max-width: 40rem;
`;

export const Para = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

export const PreviewPanel = styled.div`
  width: 100%;
  border-radius: var(--radius-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-container);
  padding: var(--space-400);
  box-sizing: border-box;
  font-family: ${ROOKERY};
`;

export const GroupBlock = styled.div`
  & + & {
    margin-top: var(--space-500);
  }
`;

export const GroupLabel = styled.h3`
  margin: 0 0 var(--space-200);
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

export const PreviewRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-200);
`;

export const PreviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  max-width: ${(p) => p.$maxWidth || '24rem'};
`;

export const PreviewNote = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200);
`;

export const SectionIntro = ({ title, paragraphs, storybook, ctas }) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    <SectionCopy>
      {paragraphs.map((text) => (
        <Para key={text.slice(0, 48)}>{withBrand(text)}</Para>
      ))}
    </SectionCopy>
    <CtaRow>
      {ctas
        ? ctas.map((cta) => (
            <Button
              key={cta.label}
              intent={cta.intent || 'secondary'}
              endIcon={cta.external !== false ? <ExternalLink size={16} aria-hidden /> : undefined}
              onClick={() => {
                if (cta.external === false) {
                  window.location.assign(cta.href);
                  return;
                }
                openExternal(cta.href);
              }}
            >
              {cta.label}
            </Button>
          ))
        : storybook
          ? (
            <Button
              intent="secondary"
              endIcon={<ExternalLink size={16} aria-hidden />}
              onClick={() => openExternal(storybook)}
            >
              View more on Storybook
            </Button>
            )
          : null}
    </CtaRow>
  </>
);
