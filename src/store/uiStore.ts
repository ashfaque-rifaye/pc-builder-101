import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeId } from '../data/regions';
import type { RegionCode } from '../data/regions';
import { detectRegion } from '../data/regions';

interface UiState {
  theme: ThemeId;
  region: RegionCode;
  setTheme: (t: ThemeId) => void;
  setRegion: (r: RegionCode) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      region: detectRegion(),
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      setRegion: (region) => set({ region }),
    }),
    {
      name: 'pc-builder-ui',
      onRehydrateStorage: () => (state) => {
        // Apply stored theme on page load
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
