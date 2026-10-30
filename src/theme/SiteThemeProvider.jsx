import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CakeProvider } from '../hellopc/theme/HellopcProvider';

/** UI keys ↔ CakeProvider ThemeMode */
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light mode', mode: 'light.a' },
  { value: 'dark', label: 'Dark mode', mode: 'dark.a' },
  { value: 'hct', label: 'HCT', mode: 'win hct' },
];

const STORAGE_KEY = 'cake-site-theme';

const SiteThemeContext = createContext({
  themeKey: 'light',
  setThemeKey: () => {},
  mode: 'light.a',
});

const readStoredKey = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'dark' || raw === 'hct' || raw === 'light') return raw;
  } catch {
    /* ignore */
  }
  return 'light';
};

export const useSiteTheme = () => useContext(SiteThemeContext);

export const SiteThemeProvider = ({ children, globalStyles = true }) => {
  const [themeKey, setThemeKeyState] = useState(readStoredKey);

  const setThemeKey = useCallback((next) => {
    const key = next === 'dark' || next === 'hct' || next === 'light' ? next : 'light';
    setThemeKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      /* ignore */
    }
  }, []);

  const mode = THEME_OPTIONS.find((o) => o.value === themeKey)?.mode ?? 'light.a';

  const value = useMemo(
    () => ({ themeKey, setThemeKey, mode }),
    [themeKey, setThemeKey, mode],
  );

  return (
    <SiteThemeContext.Provider value={value}>
      <CakeProvider mode={mode} globalStyles={globalStyles}>
        {children}
      </CakeProvider>
    </SiteThemeContext.Provider>
  );
};

export default SiteThemeProvider;
