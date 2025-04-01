import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '@/atoms/global'
import jwtUtil from '@/utils/jwt'
import { deepCompare } from '@/utils/common'
import { usePopup } from '@/hooks/common/usePopup'
import useCustomFetcher from '@/hooks/common/useCustomFetcher.tsx'
import { ApiResponseType } from '@/utils/fetcher.ts'

type UserManagerProps = {
  /** 로그인 되어있지 않은 경우 refresh token이 있으면 로그인 시도 */
  autoLogin?: boolean
}

type LoginDataType = {
  access_token: string
  refresh_token: string
} | null

const useUserManager = (props?: UserManagerProps) => {
  const { autoLogin = false } = { ...props }
  const [user, setUser] = useRecoilState(userState)
  const [fetcher, fetcherUtil] = useCustomFetcher()
  const { toast } = usePopup()
  const navigate = useNavigate()

  const login = async (params: {
    data: { username: string; password: string }
    onSuccess?: (res: ApiResponseType<LoginDataType>) => void
    onError?: (res: ApiResponseType<LoginDataType>) => void
  }) => {
    await fetcher({
      method: 'POST',
      url: '/member/login',
      body: params.data,
      anonymous: true,
      responseDataType: null as LoginDataType,
      onSuccess: (res) => {
        if (res.data === null) return
        const { access_token = undefined, refresh_token = undefined } = res.data
        jwtUtil.store(access_token, refresh_token)
        updateUser()
        params.onSuccess?.(res)
      },
      onError: (res) => {
        params.onError?.(res)
      },
    })
  }

  const logout = async (redirectUrl: string = '/') => {
    const refreshToken = jwtUtil.getToken('REFRESH')

    if (refreshToken)
      await fetcher({
        method: 'PUT',
        url: `/member/logout`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        anonymous: true,
      })

    jwtUtil.remove()
    setUser(undefined)
    toast({ message: `로그아웃 되었습니다.` })
    navigate(redirectUrl, { replace: true })
  }

  const updateUser = () => {
    // refresh 토큰이 없는 경우 -> 로그아웃
    // refresh 토큰이 있지만 access 토큰이 없는 경우 -> token refresh
    // refresh, access 토큰이 있는 경우 ->
    //// 1. 로그인되어 있는 경우
    ////// 1-1. 같은 사용자, 같은 정보일 경우 -> 업데이트 하지 않음
    ////// 1-2. 다른 사용자, 다른 정보일 경우 -> 토큰 정보로 업데이트
    //// 2. 로그인되어 있지 않은 경우 -> 토큰 정보로 업데이트

    const payload = jwtUtil.getParsedToken('REFRESH')
    const hasNotRefreshToken = !payload
    const hasNotAccessToken = !jwtUtil.getParsedToken('ACCESS')

    if (hasNotRefreshToken || hasNotAccessToken) {
      if (user && hasNotRefreshToken) logout()
      return false
    }

    const { id, username, nickname, email, status, provider, createdAt, updatedAt, authorities } = payload
    const newUser = { id, username, nickname, email, status, provider, createdAt, updatedAt, authorities }

    const isValidToken = !Object.keys(newUser).find((key) => newUser[key as keyof object] === null)
    const isUpdateRequired = !deepCompare(user, newUser)

    if (!user && isValidToken && isUpdateRequired) {
      setUser(newUser)
      toast({ message: `${username}님, 로그인 되었습니다!` })
    }

    return true
  }

  const tryTokenRefresh = () => {
    if (jwtUtil.getToken('REFRESH')) fetcherUtil.tokenRefresh(updateUser)
  }

  useEffect(() => {
    if (updateUser()) return
    else if (autoLogin) tryTokenRefresh()
  }, [])

  return { user, login, logout, updateUser }
}

export default useUserManager
