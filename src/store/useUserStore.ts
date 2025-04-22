import { create } from 'zustand'
import { UserAuthoritiesValueType } from '@/constants/user'
import { createJSONStorage, persist } from 'zustand/middleware'

type UserType = {
  id: number
  username: string
  nickname: string | null
  email: string | null
  provider: string
  status: number
  createdAt: string
  updatedAt: string
  authorities: Array<UserAuthoritiesValueType>
}
type TokenType = UserType & {
  exp: number
  iat: number
}

type UserStoreType = {
  userState: UserType | undefined
  actions: {
    setUserState: (userState: UserType) => void
    resetUserState: () => void
  }
}
const useUserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      userState: undefined,
      actions: {
        setUserState: (userState) => set({ userState }),
        resetUserState: () => set({ userState: undefined }),
      },
    }),
    {
      name: 'user_state',
      storage: createJSONStorage(() => sessionStorage),
      version: 1.0,
      merge: (persistedState, currentState) =>
        Object.assign({}, currentState, persistedState, { actions: currentState.actions }),
    }
  )
)

export const useUserState = () => useUserStore((state) => state.userState)
export const useUserActions = () => useUserStore((state) => state.actions)
