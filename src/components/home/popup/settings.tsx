import { Flex } from '@/components/layout/flex'
import { Card } from '@/components/layout/card'
import Icon from '@/components/common/icon'
import Toggle from '@/components/io/toggle'
import useCustomState from '@/hooks/state/useCustomState'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useThemeActions, useThemeState } from '@/store/useThemeStore'

export const Settings = () => {
  // const [theme, setTheme] = useRecoilState(themeState)
  const themeState = useThemeState()
  const { setThemeState } = useThemeActions()
  const [setting] = useCustomState({ init: { ...themeState } })

  useEffect(() => {
    if (!setting.state.provider || !setting.state.mode) return
    setThemeState(setting.state)
  }, [setting.state])

  useEffect(() => {
    if (themeState.provider === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setting.set.mode((prev) => systemMode)
    }
  }, [themeState.provider])

  return (
    <Card elevated filled backgroundColor='var(--card-background-color)'>
      <Flex.Col.Start width='15rem' height='auto' padding='1rem' gap='1rem'>
        <Card.Title>
          <Flex.Row.Start.Center gap='0.5rem'>
            <Icon type='setting' size='2rem' />
            Settings
          </Flex.Row.Start.Center>
        </Card.Title>
        <Flex.Row.Between>
          <Card.Title.H3>테마</Card.Title.H3>
          {/*<Toggle name='provider' valueMap={['system', 'user']} value={setting.state} onChange={setting.onChange} />*/}
          <select
            style={{ fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.2rem' }}
            value={setting.state.provider}
            onChange={(e) => {
              setting.set.provider(e.currentTarget.value as 'system' | 'user')
            }}
          >
            <option value='system'>시스템 설정</option>
            <option value='user'>사용자 설정</option>
          </select>
        </Flex.Row.Between>
        <Card.Transition width='100%'>
          {themeState.provider === 'user' && (
            <Flex.Row.Between width='100%'>
              <Card.Title.H3>다크모드</Card.Title.H3>
              <Toggle
                name='mode'
                inactiveIcon={<Icon type='sun' color='#ffffff' />}
                activeIcon={<Icon type='moon' color='#ffffff' />}
                valueMap={['light', 'dark']}
                value={setting.state}
                onChange={setting.onChange}
              />
            </Flex.Row.Between>
          )}
        </Card.Transition>
      </Flex.Col.Start>
    </Card>
  )
}
