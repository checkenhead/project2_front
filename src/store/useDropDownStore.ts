import { create } from 'zustand'

type DropDownType = Record<string, string | undefined>
type WindowSizeStoreType = {
  dropDownState: DropDownType
  actions: {
    resetDropDownState: () => void
    toggleDropDownState: (key: string, id: string) => void
    // pushPopupData: (...popupData: Array<PopupDataType>) => void
    // filterPopupData: (filter: (popupData: PopupDataType) => boolean) => void
    // removePopupData: (id: string) => void
  }
}

const useDropDownStore = create<WindowSizeStoreType>()((set) => ({
  dropDownState: {},
  actions: {
    resetDropDownState: () => set({ dropDownState: {} as DropDownType }),
    toggleDropDownState: (key: string, id: string) =>
      set((prev) => ({
        dropDownState: { ...prev.dropDownState, ...{ [key]: prev.dropDownState[key] !== id ? id : undefined } },
      })),
  },
}))

export const useDropDownState = () => useDropDownStore((state) => state.dropDownState)
export const useDropDownAction = () => useDropDownStore((state) => state.actions)
