import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ThemeType = {
  provider: 'system' | 'user'
  mode: 'dark' | 'light'
}

type ThemeStoreType = {
  themeState: ThemeType
  actions: {
    setThemeState: (themeState: ThemeType) => void
  }
}
const useThemeStore = create<ThemeStoreType>()(
  persist(
    (set) => ({
      themeState: { provider: 'system', mode: 'light' },
      actions: {
        setThemeState: (themeState) => set({ themeState }),
      },
    }),
    {
      name: 'theme_state',
      storage: createJSONStorage(() => localStorage),
      version: 1.0,
      merge: (persistedState, currentState) =>
        Object.assign({}, currentState, persistedState, { actions: currentState.actions }),
    }
  )
)

export const useThemeState = () => useThemeStore((state) => state.themeState)
export const useThemeActions = () => useThemeStore((state) => state.actions)
