import { atom } from 'recoil'
// import { recoilPersist } from 'recoil-persist'
import React from 'react'
// import { UserAuthoritiesValueType } from '@/constants/user'

/* User */
// export type UserType = {
//   id: number
//   username: string
//   nickname: string | null
//   email: string | null
//   provider: string
//   status: number
//   createdAt: string
//   updatedAt: string
//   authorities: Array<UserAuthoritiesValueType>
// }
// export type TokenType = {
//   exp: number
//   iat: number
// } & UserType

// const sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : undefined
// const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined
//
// const { persistAtom: sessionPersistAtom } = recoilPersist({
//   key: 'recoil-persist-session',
//   storage: sessionStorage,
// })
//
// const { persistAtom: localPersistAtom } = recoilPersist({
//   key: 'recoil-persist-local',
//   storage: localStorage,
// })

// export const userState = atom<UserType | undefined>({
//   key: 'userState',
//   default: undefined,
//   effects_UNSTABLE: [sessionPersistAtom],
// })

/* Window Size */
// type WindowSizeType = {
//   innerWidth: number
//   innerHeight: number
// }
// export const windowSizeState = atom<WindowSizeType>({
//   key: 'windowSizeState',
//   default: { innerWidth: 0, innerHeight: 0 },
// })

/* theme */
// export type ThemeType = { provider: 'system' | 'user'; mode: 'dark' | 'light' }
// export const themeState = atom<ThemeType>({
//   key: 'theme',
//   default: { provider: 'system', mode: 'light' },
//   effects_UNSTABLE: [localPersistAtom],
// })

/* Popup */
// type PopupDataType = { id: string; node: React.ReactNode }
// export const popupDataState = atom<Array<PopupDataType>>({
//   key: 'popupDataState',
//   default: [],
// })

/* Drop down*/
// type DropDownType = Record<string, string | undefined>
//
// export const dropDownState = atom<DropDownType>({
//   key: 'dropDownState',
//   default: {},
// })
