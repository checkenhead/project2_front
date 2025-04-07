import { Navigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'

const Index = () => {
  const { user } = useUserManager({ autoLogin: true })

  if (!user) return <Navigate to={'/login'} />
  else if (!user.nickname) return <Navigate to={'/profile_update'} />
  else return <Navigate to={`/user/${user.nickname}`} />
}

export default Index
