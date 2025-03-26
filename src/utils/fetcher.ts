import axios, { AxiosProgressEvent } from 'axios'
import { sleep, toQueryString } from '@/utils/common'
import jwtUtil from '@/utils/jwt'
import { STATUS } from '@/constants/response_status'
import { ENV } from '@/constants/env'

export type ResponseType = { status: number; code: number; data: any }
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
export type FetcherArgsType = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  responseType?: 'blob'
  headers?: ObjectType
  query?: QueryType
  body?: ObjectType | FormData
  anonymous?: boolean
  onSuccess?: (response: ResponseType) => void
  onError?: (response: ResponseType) => void
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

  public async fetch(args: FetcherArgsType): Promise<any> {
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

    try {
      const response = await axios({
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

      if (!!response) {
        const { status, data } = response
        const res = {
          status,
          code: data.code,
          data: data.data,
        } as ResponseType
        onSuccess?.(res)
      }
      return response
    } catch (error: any) {
      const { status = STATUS.ERROR.UNKNOWN_ERROR, data = undefined } = {
        ...error?.response,
      }
      const code = data?.code ? data.code : STATUS.ERROR.UNKNOWN_ERROR
      const res = { status, code, data: null } as ResponseType

      if (!anonymous && status === STATUS.ERROR.FORBIDDEN) {
        onError?.(res)
        if (await this.tokenRefresh()) {
          await this.fetch(args)
        } else {
          window.location.replace('/login')
        }
      } else if (error?.code === 'ERR_CANCELED') {
        onError?.({ ...res, code: STATUS.ERROR.REQUEST_CANCELED })
      } else {
        onError?.(res)
      }
    }
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

  public async tokenRefresh(onSuccess?: (response: ResponseType) => void, onError?: (response: ResponseType) => void) {
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
