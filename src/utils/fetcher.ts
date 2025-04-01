import axios, { AxiosError, AxiosProgressEvent, AxiosResponse } from 'axios'
import { sleep, toQueryString } from '@/utils/common'
import jwtUtil from '@/utils/jwt'
import { ENV } from '@/constants/env'
import { RESPONSE_CODE, ResponseCodeValueType } from '@/constants/response_code'

export type ApiResponseType<T> = { code: ResponseCodeValueType; data: T }
export type QueryType = Record<string, string | number | undefined>
export type ObjectType = Record<string, any>
export type ProgressType = {
  id: number
  status: 'PREPARING' | 'LOADING' | 'DONE' | 'CANCELED'
  rate: number | undefined
  loaded: number
  total: number | undefined
  abort?: () => void
}
export type FetcherArgsType<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  responseType?: 'blob'
  headers?: ObjectType
  query?: QueryType
  body?: ObjectType | FormData
  anonymous?: boolean
  responseDataType?: T
  onSuccess?: (response: ApiResponseType<T>) => void
  onError?: (response: ApiResponseType<T>) => void
  onDownloadProgress?: (progress: ProgressType) => void
  onUploadProgress?: (progress: ProgressType) => void

  signal?: AbortSignal
}

export class Fetcher {
  private static instance: Fetcher | null = null
  private static isRefreshing = false

  constructor() {
    if (!!Fetcher.instance) {
      return Fetcher.instance
    }
    Fetcher.instance = this
  }

  public async fetch<T>(args: FetcherArgsType<T>): Promise<ApiResponseType<T>> {
    const {
      method,
      url,
      responseType,
      headers,
      query,
      body: data,
      anonymous,
      onSuccess,
      onError,
      onDownloadProgress,
      onUploadProgress,
      signal,
    } = args

    let authorization = undefined

    if (!anonymous) {
      const MARGIN_TIME = 30
      let accessToken = jwtUtil.getAccessTokenBeforeExpired(MARGIN_TIME)

      if (accessToken === undefined) {
        await this.tokenRefresh()
        accessToken = jwtUtil.getToken('ACCESS')
      }

      authorization = `Bearer ${accessToken}`
    }

    const contentType = data instanceof FormData ? 'multipart/form-data' : 'application/json'
    let res = { code: RESPONSE_CODE.UNKNOWN_ERROR, data: null } as ApiResponseType<T>

    try {
      const axiosResponse = await axios({
        method,
        url: `${ENV.API_BASE_URL}${url}${toQueryString(query)}`,
        responseType,
        headers: {
          'Content-Type': contentType,
          Authorization: authorization,
          ...headers,
        },
        data,
        signal,
        onDownloadProgress: (progressEvent: AxiosProgressEvent) =>
          this.progressHandler(progressEvent, onDownloadProgress),
        onUploadProgress: (progressEvent: AxiosProgressEvent) => this.progressHandler(progressEvent, onUploadProgress),
      })

      if (!!axiosResponse) {
        res = {
          code: axiosResponse.data.code,
          data: axiosResponse.data.data,
        }

        onSuccess?.(res)
      }
    } catch (error: any) {
      const {
        code: axiosCode,
        response: {
          data: { code, data },
        },
      } = error

      res = { code, data }

      if (!anonymous && (code === RESPONSE_CODE.EXPIRED_TOKEN || code === RESPONSE_CODE.INVALID_TOKEN)) {
        onError?.(res)
        if (await this.tokenRefresh()) {
          await this.fetch(args)
        } else {
          window.location.replace('/login')
        }
      } else if (axiosCode === 'ERR_CANCELED') {
        onError?.({ code: RESPONSE_CODE.REQUEST_CANCELED, data })
      } else {
        onError?.(res)
      }
    }

    return res
  }

  private progressHandler(progressEvent: AxiosProgressEvent, onProgress?: (progress: ProgressType) => void) {
    if (!onProgress) return

    const { lengthComputable, loaded, total } = progressEvent
    const status = lengthComputable
      ? total === undefined
        ? 'PREPARING'
        : loaded >= total
          ? 'DONE'
          : 'LOADING'
      : loaded === 0
        ? 'PREPARING'
        : 'LOADING'

    const progress = { status, loaded, total } as ProgressType

    onProgress(progress)
  }

  public async tokenRefresh(
    onSuccess?: (response: ApiResponseType<any>) => void,
    onError?: (response: ApiResponseType<any>) => void
  ) {
    if (Fetcher.isRefreshing) {
      await this.sleepWhileRefreshing()
      return true
    } else {
      Fetcher.isRefreshing = true
      const result = await jwtUtil.refresh(onSuccess, onError)
      Fetcher.isRefreshing = false
      return result
    }
  }

  /** refresh 중이 아니면 곧바로 false return, refresh 중이라면 대기하고 refresh 가 완료된 후 true return */
  private async sleepWhileRefreshing() {
    if (!Fetcher.isRefreshing) return false

    while (Fetcher.isRefreshing) {
      await sleep(50)
    }

    return true
  }
}
