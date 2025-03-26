import { useRef } from 'react'

const useDebounce = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dispatchDebounce = (...args: T) => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    timer.current = setTimeout(() => {
      callback(...args)
      timer.current = null
    }, delay)
  }

  return dispatchDebounce
}

export default useDebounce