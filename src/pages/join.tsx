import { Card } from '@/components/layout/card.tsx'
import { Flex } from '@/components/layout/flex.tsx'
import { Input } from '@/components/io/input.tsx'
import Button from '@/components/io/button.tsx'
import Icon from '@/components/common/icon.tsx'
import { Link } from 'react-router-dom'
import useCustomState, { VALIDATE_RESULT } from '@/hooks/common/useCustomState.tsx'
import useCustomFetcher from '@/hooks/common/useFetcher.tsx'

const Join = () => {
  const [input, validation] = useCustomState({
    username: '',
    nickname: '',
    password: '',
    re_password: '',
    email: '',
  })
  const [fetcher, fetcherUtil] = useCustomFetcher()

  const onClickJoin = () => {
    if (!inputValidate()) return

    // api call
  }
  const inputValidate = () => {
    return validation.checkAll((key, state) => {
      switch (key) {
        case 'username':
          if (state[key] === '') return '아이디를 입력해주세요.'
          break
        case 'nickname':
          if (state[key] === '') return '닉네임을 입력해주세요.'
          break
        case 'password':
          if (state[key] === '') return '비밀번호를 입력해주세요.'
          break
        case 're_password':
          if (state[key] === '') return '비밀번호 확인을 입력해주세요.'
          break
        case 'email':
          if (state[key] === '') return '이메일을 입력해주세요.'
          break
      }
      return VALIDATE_RESULT.OK
    })
  }

  return (
    <Flex.Col.Center width='100vw' height='100vh' gap='1.5rem'>
      <Card elevated>
        <Flex.Col.Center width='16rem' gap='0.5rem' padding='1rem'>
          <Card.Section>
            <Card.Title>Join</Card.Title>
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
              label='닉네임'
              name='nickname'
              value={input.state}
              onChange={(name, value) => {
                input.onChange(name, value)
                validation.reset(name)
              }}
            />
            <Card.ErrorMessage name='nickname' validation={validation.result} width='100%' />
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
            <Input.Labeled
              password
              label='비밀번호 확인'
              name='re_password'
              value={input.state}
              onChange={(name, value) => {
                input.onChange(name, value)
                validation.reset(name)
              }}
            />
            <Card.ErrorMessage name='re_password' validation={validation.result} width='100%' />
          </Card.Section>
          <Card.Section>
            <Input.Labeled
              label='이메일'
              name='email'
              value={input.state}
              onChange={(name, value) => {
                input.onChange(name, value)
                validation.reset(name)
              }}
            />
            <Card.ErrorMessage name='email' validation={validation.result} width='100%' />
          </Card.Section>
          <Card.Section>
            <Button submit onClick={onClickJoin}>
              <Flex.Row.Center gap='0.2rem'>
                <Icon type='feather' size='1rem' />
                회원가입
              </Flex.Row.Center>
            </Button>
          </Card.Section>
        </Flex.Col.Center>
      </Card>
      <Card>
        <Link to='/login'>로그인</Link>
      </Card>
    </Flex.Col.Center>
  )
}

export default Join
