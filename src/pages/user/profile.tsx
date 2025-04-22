import useUserManager from '@/hooks/user/useUserManager'
import { Navigate } from 'react-router-dom'
import { Flex } from '@/components/layout/flex'
import { Card } from '@/components/layout/card'
import Icon from '@/components/common/icon'
import { Input } from '@/components/io/input'
import useCustomState from '@/hooks/state/useCustomState'
import { VALIDATION_RESULT } from '@/constants/validation'
import Button from '@/components/io/button'
import DropDown from '@/components/io/drop_down'
import InputText from '@/components/io/input_text'
import { Settings } from '@/components/home/popup/settings'
import useSimpleState, { useInputState2 } from '@/hooks/state/useSimpleState'
import useInputState from '@/hooks/state/useInputState'

const Profile = () => {
  const { user } = useUserManager()
  const [profile, validation] = useCustomState({
    init: {
      username: user?.username ?? '',
      nickname: user?.nickname ?? '',
      email: user?.email ?? '',
    },
    label: {
      username: '아이디',
      nickname: '닉네임',
      email: '이메일',
    },
  })

  // const [state, label] = useInputState({
  //   init: { test: '1' as '1' | '2', test2: 1 as 1 | 2 },
  //   label: { test2: '테스트2' },
  // })

  const [state, setState] = useSimpleState({
    init: { a: 1, b: '1', c: true, d: [1, 2, 3, '4'] },
  })
  const [input2, setInput2] = useInputState2({
    init: { a: 1, b: '1', c: true, d: undefined },
  })

  if (!user) return <Navigate to={'/login'} />
  return (
    <Flex.Col.Center height='100dvh'>
      <Settings />
      <Card elevated filled>
        <Card.Section width='25rem'>
          <Card.Section width='100%' padding='1rem'>
            <Flex.Row.Center gap='0.5rem'>
              <Icon type='user' size='2rem' />
              <Card.Title>My Profile</Card.Title>
              <div>
                <Button submit>저장</Button>
              </div>
            </Flex.Row.Center>
          </Card.Section>

          <Card.Section width='100%' padding='0 2rem'>
            {/*<Card.Title>Profile</Card.Title>*/}
            {/*<div*/}
            {/*  style={{*/}
            {/*    width: '100%',*/}
            {/*    border: '3px solid var(--sub-font-color)',*/}
            {/*    borderRadius: '50%',*/}
            {/*    overflow: 'hidden',*/}
            {/*    color: 'var(--sub-font-color)',*/}
            {/*  }}*/}
            {/*>*/}
            <DropDown
              name='profile_img_box'
              width='auto'
              height='auto'
              icon={
                <div
                  style={{
                    width: '100%',
                    border: '3px solid var(--sub-font-color)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    color: 'var(--sub-font-color)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon type='user' size='100%' />
                </div>
              }
            >
              <Card filled>
                <Card.Section padding='1rem'>
                  <p style={{}}>프로필 사진 등록</p>
                </Card.Section>
              </Card>
            </DropDown>
            {/*<Icon type='user' size='100%' />*/}
            {/*</div>*/}
          </Card.Section>
          <Flex.Col.Start width='100%' padding='1rem' gap='0.5rem'>
            <Input.Labeled
              name='username'
              label={profile.label}
              value={profile.state}
              onChange={profile.onChange}
              disabled
            />

            <Input.Labeled name='nickname' label={profile.label} value={profile.state} onChange={profile.onChange} />

            <Input.Labeled name='email' label={profile.label} value={profile.state} onChange={profile.onChange} />

            <InputText name='nickname' label='닉네임' value={profile.state.nickname} onChange={profile.onChange} />
            <input />
          </Flex.Col.Start>
        </Card.Section>
      </Card>
    </Flex.Col.Center>
  )
}

export default Profile
