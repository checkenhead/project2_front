import { Navigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'

const Index = () => {
  const { user } = useUserManager()

  return <Navigate to={user ? `/${user.name}` : '/login'} />
}

export default Index
