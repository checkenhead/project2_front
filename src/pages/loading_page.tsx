import { Flex } from '@/components/layout/flex'
import Icon from '@/components/common/icon.tsx'

const LoadingPage = () => {
  return (
    <Flex.Row.Center width='100dvw' height='100dvh'>
      <Icon type='loading' size='2rem' />
    </Flex.Row.Center>
  )
}

export default LoadingPage
