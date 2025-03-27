import { useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTHORITIES, AuthoritiesValueType } from '@/constants/user'
import useUserManager from '@/hooks/user/useUserManager'

type AuthenticationFilterProps = {
  allow: Array<AuthoritiesValueType>
}

const AuthenticationFilter = (props: AuthenticationFilterProps) => {
  const { allow } = props
  const { user } = useUserManager({ autoLogin: true })

  const hasAuth = useMemo(() => {
    if (allow.includes(AUTHORITIES.ALL)) return true
    else if (allow.includes(AUTHORITIES.ANONYMOUS_ONLY)) {
      return user === undefined
    } else {
      return !!user?.authorities.some((auth) => allow.some((_auth) => _auth === auth))
    }
  }, [allow, user])

  if (hasAuth) return <Outlet />
  else return <Navigate to='/' />
}

export default AuthenticationFilter
