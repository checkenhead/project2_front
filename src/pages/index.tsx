import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'

const Index = () => {
  const { user } = useUserManager()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    console.log('layout page')
    if (user) navigate(`/${user.name}`)
    else navigate('/login')
  }, [])

  return null
}

export default Index