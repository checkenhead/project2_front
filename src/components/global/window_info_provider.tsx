import { themeState, windowSizeState } from '@/atoms/global'
import useDebounce from '@/hooks/common/useDebounce'
import { ReactElement, useEffect, useLayoutEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

type WindowInfoProviderProps = {
  children: ReactElement | null
}
const WindowInfoProvider = ({ children }: WindowInfoProviderProps) => {
  const setWinSize = useSetRecoilState(windowSizeState)
  const [theme, setTheme] = useRecoilState(themeState)

  const resizeHandler = useDebounce(() => {
    const { innerWidth, innerHeight } = window
    setWinSize({ innerWidth, innerHeight })
  }, 100)

  const themeHandler = (e: MediaQueryListEvent) => {
    if (theme.provider === 'system') {
      setTheme({ provider: 'system', mode: e.matches ? 'dark' : 'light' })
    }
  }

  const init = () => {
    resizeHandler()
    if (theme.provider === 'system') {
      setTheme({
        provider: 'system',
        mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      })
    }
  }

  useLayoutEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.setAttribute('data-theme', theme.mode)
    }
  }, [theme.mode])

  useEffect(() => {
    init()
    window.addEventListener('resize', resizeHandler)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeHandler)
    }
  }, [])

  return children
}

export default WindowInfoProvider
