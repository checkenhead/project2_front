import { Flex } from '@/components/layout/flex'
import React from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '@/components/common/icon.tsx'

const PageNotFound = () => {
  const location = useLocation()

  return (
    <Flex.Col.Center width='100dvw' height='100dvh' gap='1rem'>
      <Icon type='alertTriangle' size='5rem' />
      <strong>{location.pathname} is not exist</strong>
    </Flex.Col.Center>
  )
}

export default PageNotFound
