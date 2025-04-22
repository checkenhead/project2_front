import { create } from 'zustand'

type WindowSizeType = {
  innerWidth: number
  innerHeight: number
}

type WindowSizeStoreType = {
  windowSizeState: WindowSizeType
  actions: {
    setWindowSizeState: (newWindowSize: WindowSizeType) => void
  }
}
const useWindowSizeStore = create<WindowSizeStoreType>()((set) => ({
  windowSizeState: { innerWidth: 0, innerHeight: 0 },
  actions: {
    setWindowSizeState: (windowSizeState) => set({ windowSizeState }),
  },
}))

export const useWindowSizeState = () => useWindowSizeStore((state) => state.windowSizeState)
export const useWindowSizeActions = () => useWindowSizeStore((state) => state.actions)
