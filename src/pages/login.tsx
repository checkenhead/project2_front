import { Flex } from '@/components/layout/flex'
import { Card } from '@/components/layout/card'
import Button from '@/components/io/button'
import { Input } from '@/components/io/input'
import useCustomState, { VALIDATE_RESULT } from '@/hooks/common/useCustomState'
import Icon from '@/components/common/icon'
import { Link, useNavigate } from 'react-router-dom'
import useCustomFetcher from '@/hooks/common/useCustomFetcher.tsx'
import useUserManager from '@/hooks/user/useUserManager'

const Login = () => {
  const [input, validation] = useCustomState({ username: '', password: '' })
  const [, fetcherUtil] = useCustomFetcher()
  const { login } = useUserManager()
  const navigate = useNavigate()

  const onClickLogin = async () => {
    if (!inputValidate()) return

    // api call
    await login({
      data: input.state,
      onError: () => {
        validation.set.username('아이디를 확인해주세요.')
        validation.set.password('비밀번호를 확인해주세요.')
      },
    })
  }
  const inputValidate = () => {
    return validation.checkAll((key, state) => {
      switch (key) {
        case 'username':
          if (state[key] === '') return '아이디를 입력해주세요.'
          break
        case 'password':
          if (state[key] === '') return '비밀번호를 입력해주세요.'
          break
      }
      return VALIDATE_RESULT.OK
    })
  }

  console.log(validation)

  return (
    <Flex.Col.Center width='100vw' height='100vh' gap='1.5rem'>
      <Card elevated>
        <Flex.Col.Center width='16rem' gap='0.5rem' padding='1rem'>
          <Card.Section>
            <Card.Title>Login</Card.Title>
          </Card.Section>
          <Card.Section>
            <Input.Labeled
              label='아이디'
              name='username'
              value={input.state}
              onChange={(name, value) => {
                input.onChange(name, value)
                validation.reset(name)
              }}
            />
            <Card.ErrorMessage name='username' validation={validation.result} width='100%' />
          </Card.Section>
          <Card.Section>
            <Input.Labeled
              password
              label='비밀번호'
              name='password'
              value={input.state}
              onChange={(name, value) => {
                input.onChange(name, value)
                validation.reset(name)
              }}
            />
            <Card.ErrorMessage name='password' validation={validation.result} width='100%' />
          </Card.Section>
          <Card.Section>
            <Button submit pending={fetcherUtil.isPending} onClick={onClickLogin}>
              <Flex.Row.Center gap='0.2rem'>
                <Icon type='login' size='1rem' />
                로그인
              </Flex.Row.Center>
            </Button>
          </Card.Section>
        </Flex.Col.Center>
      </Card>
      <Card>
        <Link to='/join'>회원가입</Link>
      </Card>
    </Flex.Col.Center>
  )
}

export default Login
