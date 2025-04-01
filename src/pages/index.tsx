import { Navigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'

const Index = () => {
  const { user } = useUserManager({ autoLogin: true })

  return <Navigate to={user ? `/${user.nickname}` : '/login'} />
}

export default Index
