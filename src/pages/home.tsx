import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'




enum POPUP_INDEX {
  CLOSED,
  MY_PAGE,
  SEARCH,
  BOOKMARK,
  MENTIONS,
  SETTINGS,
}

const Home = () => {
  const navigate = useNavigate()
  const { user, logout } = useUserManager()
  const [popupIndex, setPopupIndex] = useState(POPUP_INDEX.CLOSED)



  return (
    <>
     
    </>
  )
}

export default Home
