import { useCallback, useEffect, useRef, useState } from 'react'
import { FetcherArgsType, ResponseType, ProgressType, Fetcher } from '@/utils/fetcher'

type FetcherOptions = {
  /** 다운로드/업로드 취소 */
  cancelable?: boolean
  /** unmount 시 모든 요청 취소 */
  autoCancel?: boolean
}
type FetcherProgressesType = Record<string | number, ProgressType>

const INIT_PROGRESS: ProgressType = {
  id: 0,
  status: 'PREPARING',
  rate: undefined,
  loaded: 0,
  total: undefined,
}

const useCustomFetcher = (options?: FetcherOptions) => {
  const { cancelable = false, autoCancel = false } = { ...options }

  const progressIdSequenceRef = useRef<number>(0)
  const _progresses = useRef<FetcherProgressesType>({})
  const [progresses, setProgresses] = useState<FetcherProgressesType>({})
  const [currentProgress, setCurrentProgress] = useState<ProgressType | undefined>(undefined)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [fetcherInstance] = useState<Fetcher>(() => new Fetcher())

  const fetcher = useCallback(async (args: FetcherArgsType) => {
    setIsPending(true)
    if (cancelable || autoCancel || !!args.onDownloadProgress || !!args.onUploadProgress) {
      let canceled = false

      const id = ++progressIdSequenceRef.current
      const abortController = new AbortController()
      const signal = abortController.signal

      const abort = () => {
        abortController.abort()
        canceled = true
      }

      updateProgress({ ...INIT_PROGRESS, id, abort })

      const onDownloadProgress = (progress: ProgressType) => {
        updateProgress({ ...progress, id, abort, status: canceled ? 'CANCELED' : progress.status })
        args.onDownloadProgress?.(_progresses.current[id])
      }
      const onUploadProgress = (progress: ProgressType) => {
        updateProgress({ ...progress, id, abort, status: canceled ? 'CANCELED' : progress.status })
        args.onUploadProgress?.(_progresses.current[id])
      }
      const onSuccess = (response: ResponseType) => {
        updateProgress({ ..._progresses.current[id], status: 'DONE' })
        args.onSuccess?.(response)
      }
      const onError = (response: ResponseType) => {
        updateProgress({ ..._progresses.current[id], status: canceled ? 'CANCELED' : _progresses.current[id].status })
        args.onError?.(response)
      }

      const res = await fetcherInstance.fetch({
        ...args,
        signal,
        onDownloadProgress,
        onUploadProgress,
        onSuccess,
        onError,
      })
      args.onDownloadProgress?.(_progresses.current[id])
      args.onUploadProgress?.(_progresses.current[id])
      setIsPending(false)
      return res
    } else {
      const res = await fetcherInstance.fetch({ ...args })
      setIsPending(false)
      return res
    }
  }, [])

  const tokenRefresh = useCallback(async (onSuccess: () => void) => {
    await fetcherInstance.tokenRefresh(onSuccess)
  }, [])

  const cancelAll = useCallback(() => {
    for (const [, value] of Object.entries(_progresses.current)) {
      if (value.status === 'PREPARING' || value.status === 'LOADING') value.abort?.()
    }
  }, [])

  const updateProgress = useCallback((newProgress: ProgressType) => {
    _progresses.current = { ..._progresses.current, ...{ [newProgress.id]: newProgress } }
    setProgresses(_progresses.current)
    setCurrentProgress(newProgress)
  }, [])

  useEffect(() => {
    return () => {
      if (autoCancel) cancelAll()
      _progresses.current = {}
      setProgresses({})
    }
  }, [])

  return [fetcher, { isPending, progresses, currentProgress, cancelAll, tokenRefresh }] as const
}

export default useCustomFetcher
