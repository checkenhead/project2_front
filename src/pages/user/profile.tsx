import useUserManager from '@/hooks/user/useUserManager'
import { Navigate } from 'react-router-dom'
import { Flex } from '@/components/layout/flex'
import { Card } from '@/components/layout/card'
import Icon from '@/components/common/icon'
import { Input } from '@/components/io/input'
import useCustomState from '@/hooks/common/useCustomState'
import { VALIDATION_RESULT } from '@/constants/validation'
import Button from '@/components/io/button'

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

  if (!user) return <Navigate to={'/login'} />
  return (
    <Flex.Col.Center height='100dvh'>
      <Card elevated filled>
        <Card.Section padding='1rem'>
          <Flex.Row.Center gap='0.5rem'>
            <Icon type='user' size='2rem' />
            <Card.Title>My Profile</Card.Title>
          </Flex.Row.Center>
        </Card.Section>

        <Card.Section width='15rem' padding='0 2rem'>
          {/*<Card.Title>Profile</Card.Title>*/}
          <div
            style={{
              width: '100%',
              border: '3px solid var(--sub-font-color)',
              borderRadius: '50%',
              overflow: 'hidden',
              color: 'var(--sub-font-color)',
            }}
          >
            <Icon type='user' size='100%' />
          </div>
        </Card.Section>
        <Flex.Col.Start width='15rem' padding='1rem' gap='0.5rem'>
          <Flex.Row.Between>
            <Input.Labeled
              name='username'
              label={profile.label}
              value={profile.state}
              onChange={profile.onChange}
              disabled
            />
          </Flex.Row.Between>
          <Flex.Row.Between>
            <Input.Labeled name='nickname' label={profile.label} value={profile.state} onChange={profile.onChange} />
            <div>
              <Button>등록</Button>
            </div>
          </Flex.Row.Between>

          <Flex.Row.Between>
            <Input.Labeled name='email' label={profile.label} value={profile.state} onChange={profile.onChange} />
            <div>
              <Button>등록</Button>
            </div>
          </Flex.Row.Between>
          <Button submit>저장</Button>
        </Flex.Col.Start>
      </Card>
    </Flex.Col.Center>
  )
}

export default Profile
