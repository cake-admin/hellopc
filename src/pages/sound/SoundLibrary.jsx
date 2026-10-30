import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { Card } from '../../hellopc/components/Card';
import { Dropdown } from '../../hellopc/components/Dropdown';
import { HelperString } from '../../hellopc/components/Elements/HelperString';
import { TextInput } from '../../hellopc/components/TextInput';
import {
  soundCatalog,
  soundFamilies,
} from '../../data/sound-catalog';
import SoundPreview from './SoundPreview';

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(12rem, 1fr);
  align-items: end;
  gap: var(--space-300);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-400);

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const SoundCard = styled(Card)`
  height: 100%;
  min-width: 0;
  /* Figma nodes 168:627 / 173:3999 are 374×338; width remains responsive. */
  min-height: 338px;
`;

const CardContent = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-300);
  height: 100%;
  padding: var(--space-500);
  font-family: var(--font-family);
`;

const SoundTitle = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

const Description = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const Details = styled.dl`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
  margin: 0;
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const DetailLabel = styled.dt`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1px;
  line-height: 1.35;
`;

const DetailValue = styled.dd`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const Empty = styled.div`
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-300);
  padding: var(--space-600);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const capitalizeLabel = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const joinLabels = (values) =>
  values
    .filter(Boolean)
    .map(capitalizeLabel)
    .join(' • ');

const SoundLibraryCard = ({ sound }) => {
  const type = joinLabels([sound.family, sound.category]);
  const properties = joinLabels([
    ...Object.values(sound.attributes),
    sound.hierarchy || 'Unclassified',
  ]);

  return (
    <SoundCard elevation="low">
      <CardContent>
        <SoundPreview sound={sound} file={sound.primary} />
        <SoundTitle>{sound.name}</SoundTitle>
        <Description>
          {sound.description || 'No authored description is available yet.'}
        </Description>
        <Details>
          <DetailGroup>
            <DetailLabel>Type</DetailLabel>
            <DetailValue>{type || 'Unclassified'}</DetailValue>
          </DetailGroup>
          <DetailGroup>
            <DetailLabel>Properties</DetailLabel>
            <DetailValue>{properties}</DetailValue>
          </DetailGroup>
        </Details>
      </CardContent>
    </SoundCard>
  );
};

const SoundLibrary = () => {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return soundCatalog.filter((sound) => {
      const familyMatches = family === 'all' || sound.family === family;
      const searchable = [
        sound.name,
        sound.family,
        sound.category,
        sound.description,
        ...(sound.useCases || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return familyMatches && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [family, query]);

  const familyOptions = [
    { value: 'all', label: 'All sound types' },
    ...soundFamilies.map((name) => ({ value: name, label: name })),
  ];

  return (
    <>
      <Toolbar>
        <TextInput
          id="sound-search"
          label="Search sounds"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, family, category, or use case"
          startIcon={<Search />}
        />
        <Dropdown
          id="sound-family-filter"
          label="Filter by type"
          value={family}
          onValueChange={setFamily}
          options={familyOptions}
        />
      </Toolbar>
      <HelperString role="status" tone="greyscale" showIcon={false}>
        Showing {filtered.length} of {soundCatalog.length} sound profiles
      </HelperString>
      {filtered.length ? (
        <Grid>
          {filtered.map((sound) => (
            <SoundLibraryCard key={sound.id} sound={sound} />
          ))}
        </Grid>
      ) : (
        <Empty>No sounds match that search and filter combination.</Empty>
      )}
    </>
  );
};

export default SoundLibrary;
