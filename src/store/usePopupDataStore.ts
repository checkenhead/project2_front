import { create } from 'zustand'
import React from 'react'

type PopupDataType = {
  id: string
  node: React.ReactNode
}
type WindowSizeStoreType = {
  popupDataset: Array<PopupDataType>
  actions: {
    pushPopupData: (...popupData: Array<PopupDataType>) => void
    filterPopupData: (filter: (popupData: PopupDataType) => boolean) => void
    removePopupData: (id: string) => void
  }
}

const usePopupDataStore = create<WindowSizeStoreType>()((set) => ({
  popupDataset: [],
  actions: {
    pushPopupData: (...popupData) => set((prev) => ({ popupDataset: [...prev.popupDataset, ...popupData] })),
    filterPopupData: (filter) => set((prev) => ({ popupDataset: [...prev.popupDataset.filter(filter)] })),
    removePopupData: (id: string) =>
      set((prev) => ({ popupDataset: [...prev.popupDataset.filter((popup) => popup.id !== id)] })),
  },
}))

export const usePopupData = () => usePopupDataStore((state) => state.popupDataset)
export const usePopupDataAction = () => usePopupDataStore((state) => state.actions)
