import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AuthenticationFilter from '@/components/global/authentication_filter'
import { AUTHORITIES } from '@/constants/user'
import LoadingPage from '@/pages/common/loading_page'

// common
const Index = lazy(() => import('@/pages/common'))
const PageNotFound = lazy(() => import('@/pages/common/page_not_found'))

// user
const Login = lazy(() => import('@/pages/user/login'))
const Join = lazy(() => import('@/pages/user/join'))
const Home = lazy(() => import('@/pages/user/home'))
const Profile = lazy(() => import('@/pages/user/profile'))

const RouterRoot = () => {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes location={location}>
        <Route element={<AuthenticationFilter key={location.pathname} allow={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} />}>
          <Route path='/user/:id' element={<Home />} />
          <Route path='/profile_update' element={<Profile />} />
        </Route>
        {/*<Route element={<AuthenticationFilter key={location.pathname} allow={[AUTHORITIES.ADMIN]} />}>*/}
        {/*<Route path='/admin' element={<AdminPage />} />*/}
        {/*</Route>*/}
        <Route element={<AuthenticationFilter key={location.pathname} allow={[AUTHORITIES.ANONYMOUS_ONLY]} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />
        </Route>
        <Route element={<AuthenticationFilter key={location.pathname} allow={[AUTHORITIES.ALL]} />}>
          <Route path='/' element={<Index />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default RouterRoot
