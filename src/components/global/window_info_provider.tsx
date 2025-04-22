import useDebounce from '@/hooks/common/useDebounce'
import { ReactElement, useEffect, useLayoutEffect } from 'react'
import { useWindowSizeActions } from '@/store/useWindowSizeStore'
import { useThemeActions, useThemeState } from '@/store/useThemeStore'

type WindowInfoProviderProps = {
  children: ReactElement | null
}
const WindowInfoProvider = ({ children }: WindowInfoProviderProps) => {
  // const setWinSize = useSetRecoilState(windowSizeState)
  // const [theme, setTheme] = useRecoilState(themeState)
  const { setWindowSizeState } = useWindowSizeActions()
  const themeState = useThemeState()
  const { setThemeState } = useThemeActions()

  const resizeHandler = useDebounce(() => {
    const { innerWidth, innerHeight } = window
    setWindowSizeState({ innerWidth, innerHeight })
  }, 100)

  const themeHandler = (e?: MediaQueryListEvent) => {
    if (themeState.provider === 'system') {
      const mode = e
        ? e.matches
          ? 'dark'
          : 'light'
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      setThemeState({ provider: 'system', mode })
    }
  }

  const init = () => {
    resizeHandler()
    themeHandler()
  }

  useLayoutEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.setAttribute('data-theme', themeState.mode)
    }
  }, [themeState.mode])

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
