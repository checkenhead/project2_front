import { Card } from '@/components/layout/card.tsx'
import { Flex } from '@/components/layout/flex.tsx'
import { Input } from '@/components/io/input.tsx'
import Button from '@/components/io/button.tsx'
import Icon from '@/components/common/icon.tsx'
import { Link } from 'react-router-dom'
import useCustomState from '@/hooks/common/useCustomState.tsx'
import useCustomFetcher from '@/hooks/common/useCustomFetcher.tsx'
import { apiParamsMemberJoin } from '@/api/member/join'
import { addPostpositionKor } from '@/utils/common'
import { VALIDATION_RESULT } from '@/constants/validation'
import { REGEX } from '@/constants/regex'

const Join = () => {
  const [input, validation] = useCustomState({
    init: {
      username: '',
      nickname: '',
      password: '',
      re_password: '',
      email: '',
    },
    label: {
      username: '아이디',
      nickname: '닉네임',
      password: '비밀번호',
      re_password: '비밀번호 확인',
      email: '이메일',
    },
    // constraint: {
    //   empty: { onError: (label) => `${addPostpositionKor(label, '을/를')} 입력해주세요.` },
    // },
  })
  const [fetcher, fetcherUtil] = useCustomFetcher()

  const onClickJoin = async () => {
    if (!inputValidate()) return

    // api call
    await fetcher({
      ...apiParamsMemberJoin({ ...input.state }),
      onSuccess: (res) => {
        console.log('onSuccess', res)
      },
      onError: (res) => {
        console.log('onError', res)
      },
    })
  }
  const inputValidate = () => {
    return validation.checkAll((key, state, label) => {
      if (state[key] === '') return `${addPostpositionKor(label, '을/를')} 입력해주세요.`

      switch (key) {
        case 'password':
          if (state[key].length > 30 || state[key].length < 8)
            return `${addPostpositionKor(label, '은/는')} 8~30자만 가능합니다.`
          break
        case 're_password':
          break
        default:
          if (state[key].length > 30 || state[key].length < 4)
            return `${addPostpositionKor(label, '은/는')} 4~30자만 가능합니다.`
          break
      }

      switch (key) {
        case 'username':
          if (!REGEX.is('WORD').test(state[key])) return `아이디는 영문, 숫자와 '_' 조합만 가능합니다.`
          break
        case 'nickname':
          if (!REGEX.is('WORD', 'KOR_COMPOSED').test(state[key]))
            return `닉네임은 영문, 한글, 숫자와 '_'조합만 가능합니다.`
          break
        case 're_password':
          if (state[key] !== state['password']) return '비밀번호 확인이 일치하지 않습니다.'
          break
        case 'email':
          if (!REGEX.is('EMAIL').test(state[key])) return '이메일 형식을 확인해주세요.'
          break
      }

      return VALIDATION_RESULT.OK
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
