import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum ETheme {
  LIGHT = "LIGHT",
  DARK = "DARK",
  SYSTEM = "SYSTEM",
}

type TThemeStore = {
  theme: ETheme;
  loading: boolean;
  onSetLoading: (val: boolean) => void;
  onSetTheme: (theme: ETheme) => void;
};

const applyTheme = (theme: ETheme) => {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const appliedTheme =
    theme === ETheme.SYSTEM
      ? systemPrefersDark
        ? ETheme.DARK
        : ETheme.LIGHT
      : theme;

  document.documentElement.className = appliedTheme.toLowerCase();
};

const useThemeStore = create<TThemeStore>()(
  persist(
    (set) => ({
      loading: true,
      theme: ETheme.SYSTEM,
      onSetLoading: (value: boolean) => {
        set({
          loading: value,
        });
      },
      onSetTheme: (theme: ETheme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
        state?.onSetLoading(false);
      },
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

export default useThemeStore;
