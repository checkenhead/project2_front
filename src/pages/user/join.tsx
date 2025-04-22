import { Card } from '@/components/layout/card.tsx'
import { Flex } from '@/components/layout/flex.tsx'
import { Input } from '@/components/io/input.tsx'
import Button from '@/components/io/button.tsx'
import Icon from '@/components/common/icon.tsx'
import { Link, useNavigate } from 'react-router-dom'
import useCustomState from '@/hooks/state/useCustomState.tsx'
import useCustomFetcher from '@/hooks/common/useCustomFetcher.tsx'
import { apiParamsMemberJoin } from '@/api/member/join'
import { addPostpositionKor } from '@/utils/common'
import { VALIDATION_RESULT } from '@/constants/validation'
import { REGEX } from '@/constants/regex'
import { RESPONSE_CODE } from '@/constants/response_code'
import { usePopup } from '@/hooks/common/usePopup'

const Join = () => {
  const [input, validation] = useCustomState({
    init: {
      username: '',
      password: '',
      re_password: '',
    },
    label: {
      username: '아이디',
      password: '비밀번호',
      re_password: '비밀번호 확인',
    },
  })
  const [fetcher, fetcherUtil] = useCustomFetcher()
  const { toast } = usePopup()
  const navigate = useNavigate()

  const onClickJoin = async () => {
    if (!inputValidate()) return

    // api call
    await fetcher({
      ...apiParamsMemberJoin({ ...input.state }),
      onSuccess: (res) => {
        toast({ message: '회원으로 가입되었습니다. 로그인 해주세요.' })
        navigate('/')
      },
      onError: (res) => {
        if (res.code === RESPONSE_CODE.CONFLICT) validation.set.username('이 아이디는 사용할 수 없습니다.')
        else toast({ message: '나중에 다시 시도해주세요.' })
      },
    })
  }
  const inputValidate = () => {
    return validation.checkAll((key, state, label) => {
      if (state[key] === '') return `${addPostpositionKor(label, '을/를')} 입력해주세요.`

      switch (key) {
        case 'username':
          if (state[key].length > 30 || state[key].length < 4)
            return `${addPostpositionKor(label, '은/는')} 4~30자만 가능합니다.`
          else if (!REGEX.is('WORD').test(state[key])) return `아이디는 영문, 숫자와 '_' 조합만 가능합니다.`
          break
        case 'password':
          if (state[key].length > 30 || state[key].length < 8)
            return `${addPostpositionKor(label, '은/는')} 8~30자만 가능합니다.`
          break
        case 're_password':
          if (state[key] !== state['password']) return '비밀번호 확인이 일치하지 않습니다.'
          break
      }

      return VALIDATION_RESULT.OK
    })
  }

  return (
    <Flex.Col.Center width='100vw' height='100vh' gap='1.5rem'>
      <Card>
        <Icon type='logo' size='3rem' />
      </Card>
      <Card elevated filled>
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
