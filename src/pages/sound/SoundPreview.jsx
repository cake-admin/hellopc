import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { IconButton } from '../../hellopc/components/Button/IconButton';
import { HelperString } from '../../hellopc/components/Elements/HelperString';
import { getSoundUrl } from '../../data/sound-catalog';
import SoundWaveform from './SoundWaveform';

const PlayerContext = createContext(null);

export const SoundPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [errorId, setErrorId] = useState(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      setPlaying(false);
    });
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('play', () => setPlaying(true));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(async (file) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop, not pause: rewind so the next press replays from the beginning.
    if (activeId === file.id && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    setErrorId(null);
    // Switching sounds: stop and rewind whatever is playing before the handoff,
    // so only one preview is ever audible.
    if (activeId !== file.id) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = getSoundUrl(file);
      audio.preload = 'none';
      setActiveId(file.id);
    }

    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setErrorId(file.id);
    }
  }, [activeId]);

  const value = useMemo(
    () => ({ activeId, errorId, playing, toggle }),
    [activeId, errorId, playing, toggle],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-500);
  width: 100%;
  min-width: 0;
  background: var(--color-surfaces-container);
`;

/* The wave sits on the card's own surface token, so it re-themes with the card
   in light, dark, and Windows HCT rather than holding one theme's color. */
const WaveformSurface = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  height: 56px;
  min-width: 0;
  overflow: hidden;
  background: var(--color-surfaces-container);
`;

const ErrorWrap = styled.div`
  margin-top: var(--space-100);
`;

/**
 * Exact geometry from the Figma/Moto filled play-circle asset
 * (Figma node 168:3990). `currentColor` lets hello pc IconButton own
 * enabled and disabled state colors.
 */
const PlayCircleGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM10.53 7.95625C9.86395 7.53997 9 8.01881 9 8.80425V15.1958C9 15.9812 9.86395 16.46 10.53 16.0438L15.6432 12.848C16.2699 12.4563 16.2699 11.5437 15.6432 11.152L10.53 7.95625Z"
      fill="currentColor"
    />
  </svg>
);

/** Stop counterpart of `PlayCircleGlyph`: same filled circle, square cut-out. */
const StopCircleGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM10 8.5C9.17157 8.5 8.5 9.17157 8.5 10V14C8.5 14.8284 9.17157 15.5 10 15.5H14C14.8284 15.5 15.5 14.8284 15.5 14V10C15.5 9.17157 14.8284 8.5 14 8.5H10Z"
      fill="currentColor"
    />
  </svg>
);

const SoundPreview = ({ sound, file = sound.primary, showWaveform = true }) => {
  const player = useContext(PlayerContext);
  if (!player) {
    throw new Error('SoundPreview must be used inside SoundPlayerProvider');
  }

  const isActive = player.activeId === file.id;
  const isPlaying = isActive && player.playing;
  const hasError = player.errorId === file.id;

  return (
    <div>
      <Preview>
        <IconButton
          label={isPlaying ? `Stop ${sound.name}` : `Play ${sound.name}`}
          icon={isPlaying ? <StopCircleGlyph /> : <PlayCircleGlyph />}
          intent="primary"
          variant="fill"
          size="lg"
          onClick={() => player.toggle(file)}
        />
        <WaveformSurface>
          {showWaveform ? (
            <SoundWaveform
              peaks={file.peaks}
              label={`Static waveform for ${sound.name}`}
            />
          ) : null}
        </WaveformSurface>
      </Preview>
      {hasError ? (
        <ErrorWrap>
          <HelperString role="status" tone="error">
            This preview could not be played. Check the file or browser audio settings.
          </HelperString>
        </ErrorWrap>
      ) : null}
    </div>
  );
};

export default SoundPreview;
