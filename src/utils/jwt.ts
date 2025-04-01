import axios from 'axios'
import { TokenType } from '@/atoms/global'
import { ApiResponseType } from '@/utils/fetcher'
// import { STATUS } from '@/constants/response_status'
import { ENV } from '@/constants/env'
import { RESPONSE_CODE } from '@/constants/response_code.ts'

const jwtUtil = {
  store: function (access: string | undefined, refresh: string | undefined) {
    if (!access || !refresh || !this.remove()) return false

    sessionStorage.setItem(ENV.ACCESS_TOKEN_NAME, access)
    localStorage.setItem(ENV.REFRESH_TOKEN_NAME, refresh)

    return true
  },
  remove: function () {
    if (!ENV.ACCESS_TOKEN_NAME || !ENV.REFRESH_TOKEN_NAME) return false

    sessionStorage.removeItem(ENV.ACCESS_TOKEN_NAME)
    localStorage.removeItem(ENV.REFRESH_TOKEN_NAME)

    return true
  },
  refresh: async function (
    onSuccess?: (response: ApiResponseType<any>) => void,
    onError?: (response: ApiResponseType<any>) => void
  ) {
    const refreshToken = this.getToken('REFRESH')
    if (!refreshToken) return false

    let res = { code: RESPONSE_CODE.UNKNOWN_ERROR, data: null } as ApiResponseType<any>

    try {
      const axiosResponse = await axios({
        method: 'GET',
        url: `${ENV.API_BASE_URL}/member/token-refresh`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      res = {
        code: axiosResponse.data.code,
        data: axiosResponse.data.data,
      }

      if (res.code !== RESPONSE_CODE.OK) return false
      const { access_token, refresh_token } = res.data as {
        access_token: string | undefined
        refresh_token: string | undefined
      }

      this.store(access_token, refresh_token)
      onSuccess?.(res)

      return true
    } catch (error: any) {
      const {
        response: {
          data: { code, data },
        },
      } = error

      res = { code, data }

      this.remove()
      onError?.(res)

      return false
    }
  },
  getParsedToken: function (type: 'ACCESS' | 'REFRESH') {
    return this.parseToken(this.getToken(type))
  },
  getToken: function (type: 'ACCESS' | 'REFRESH') {
    const key = type === 'ACCESS' ? ENV.ACCESS_TOKEN_NAME : ENV.REFRESH_TOKEN_NAME
    const storage = type === 'ACCESS' ? sessionStorage : localStorage

    if (!key) return undefined

    return storage.getItem(key) ?? undefined
  },
  parseToken: function (token: string | undefined) {
    if (!token) return undefined

    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const process = JSON.parse(payload)
    const authorities = process.authorities ? process.authorities.toString().split(',') : undefined
    return { ...process, authorities } as TokenType
  },
  getAccessTokenBeforeExpired: function (marginSec: number = 0) {
    const token = this.getToken('ACCESS')
    const { exp = 0 } = { ...this.parseToken(token) }

    if (exp === 0) return undefined

    const now = new Date().getTime() / 1000 + marginSec

    if (now < exp) return token
    else return undefined
  },
} as const

export default jwtUtil
