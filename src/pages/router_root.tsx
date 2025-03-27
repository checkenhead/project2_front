import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AuthenticationFilter from '@/components/global/authentication_filter'
import { AUTHORITIES } from '@/constants/user'
import LoadingPage from '@/pages/loading_page'

const Index = lazy(() => import('@/pages/index'))
const Login = lazy(() => import('@/pages/login'))
const Join = lazy(() => import('@/pages/join'))
const Home = lazy(() => import('@/pages/home'))
const PageNotFound = lazy(() => import('@/pages/page_not_found'))

const RouterRoot = () => {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes location={location}>
        <Route element={<AuthenticationFilter key={location.pathname} allow={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} />}>
          <Route path='/:id' element={<Home />} />
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
          <Route path='/*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default RouterRoot
