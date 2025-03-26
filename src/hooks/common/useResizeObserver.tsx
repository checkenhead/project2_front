import { useCallback, useEffect, useRef, useState } from 'react'

type rectStateType = { width: number; height: number }

export const useResizeObserver = () => {
  const [rect, setRect] = useState<rectStateType | undefined>(undefined)

  const observerRef = useRef(
    new ResizeObserver((entries) => {
      const { width, height } = entries.reduce(
        (acc, entry) => {
          return {
            width: acc.width + entry.contentRect.width,
            height: acc.height + entry.contentRect.height,
          }
        },
        { width: 0, height: 0 }
      )
      setRect({ width, height })
    })
  )

  const observer = useCallback((element: HTMLElement | null) => {
    if (element) observerRef.current.observe(element, { box: 'border-box' })
  }, [])

  useEffect(() => {
    return () => {
      observerRef.current.disconnect()
    }
  }, [])

  return { observer, rect }
}