import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type DensityMode = 'comfortable' | 'compact';

export interface UserPreferences {
  language: 'vi' | 'en';
  currency: 'USD' | 'VND';
  reducedMotion: boolean;
  density: DensityMode;
  emailOrderUpdates: boolean;
  emailPromotions: boolean;
  chatSound: boolean;
}

const STORAGE_KEY = 'galerie:user-preferences';

const defaultPreferences: UserPreferences = {
  language: 'vi',
  currency: 'USD',
  reducedMotion: false,
  density: 'comfortable',
  emailOrderUpdates: true,
  emailPromotions: false,
  chatSound: true,
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

function loadPreferences(): UserPreferences {
  if (!canUseDOM) return defaultPreferences;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...(JSON.parse(raw) as Partial<UserPreferences>) };
  } catch {
    return defaultPreferences;
  }
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

  useEffect(() => {
    if (!canUseDOM) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    document.documentElement.dataset.density = preferences.density;
    document.documentElement.dataset.motion = preferences.reducedMotion ? 'reduced' : 'full';
    document.documentElement.lang = preferences.language === 'vi' ? 'vi' : 'en';
  }, [preferences]);

  const value = useMemo<UserPreferencesContextType>(
    () => ({
      preferences,
      setPreference: (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
      },
      resetPreferences: () => setPreferences(defaultPreferences),
    }),
    [preferences]
  );

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used inside UserPreferencesProvider');
  }
  return context;
}