import React from 'react';
import styled from 'styled-components';
import { Link2 } from 'lucide-react';

import { Link } from '../Link';

export interface AiSource {
  /** What the source is called ("Product guide"). */
  label: string;
  /** Where it lives — each source links to its origin. */
  href: string;
}

export interface AiSourcesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The sources an answer drew on, in order. */
  sources: AiSource[];
  /** Lead-in text. @default 'Sources:' */
  heading?: string;
}

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-050);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

/** 14px link glyph (Figma hellopc.ai.sources 17312:419, geometry). */
const Glyph = styled.span`
  display: inline-flex;
  & > svg {
    width: 14px;
    height: 14px;
  }
`;

const Heading = styled.span`
  font-weight: var(--font-weight-medium);
`;

const List = styled.ul`
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;

  & > li:not(:last-child)::after {
    content: ',';
    margin-right: var(--space-050);
  }
`;

/** Source names: the hello pc Link at 12px, regular weight as Figma draws them
 *  (Link sm is medium). Kept underlined so links don't rely on color alone. */
const SourceLink = styled(Link)`
  min-height: 0;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
`;

/**
 * hello pc AI Sources — where an AI answer came from (Figma
 * `hellopc.ai.sources`, node 17312:419): a lead-in and a comma-separated list of
 * links to each origin. Wraps onto more lines rather than overflowing.
 */
export const AiSources = React.forwardRef<HTMLDivElement, AiSourcesProps>(
  ({ sources, heading = 'Sources:', ...props }, ref) => (
    <Root ref={ref} {...props}>
      <Glyph aria-hidden>
        <Link2 />
      </Glyph>
      <Heading>{heading}</Heading>
      <List aria-label={heading.replace(/:$/, '')}>
        {sources.map((s) => (
          <li key={s.href + s.label}>
            <SourceLink size="sm" href={s.href}>
              {s.label}
            </SourceLink>
          </li>
        ))}
      </List>
    </Root>
  ),
);

AiSources.displayName = 'AiSources';

export default AiSources;
