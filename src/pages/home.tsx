import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserManager from '@/hooks/user/useUserManager'
import { Flex } from '@/components/layout/flex'
import { Settings } from '@/components/home/popup/settings'
import { Card } from '@/components/layout/card'
import Icon from '@/components/common/icon'
import { PostCard } from '@/components/home/post/post_card'
import Popup, { usePopup } from '@/hooks/common/usePopup'

enum POPUP_INDEX {
  CLOSED,
  MY_PAGE,
  SEARCH,
  BOOKMARK,
  MENTIONS,
  SETTINGS,
}

const Home = () => {
  const { confirm } = usePopup()
  const { user, logout } = useUserManager()
  const [popupIndex, setPopupIndex] = useState(POPUP_INDEX.CLOSED)

  const onClickLogout = useCallback(() => {
    confirm({
      title: '로그아웃',
      message: '로그아웃 하시겠습니까?',
      buttons: [
        {
          content: '취소',
          callback: (close) => close(),
        },
        {
          submit: true,
          content: (
            <Flex.Row.Center gap='0.2rem'>
              로그아웃
              <Icon type='logout' size='1rem' />
            </Flex.Row.Center>
          ),

          callback: (close) => {
            logout()
            close()
          },
        },
      ],
    })
  }, [])

  return (
    <>
      <Flex.Row.Start
        // backgroundColor='rgba(0,100,0,0.1)'
        width='100%'
      >
        <div
          className='side'
          style={{
            position: 'sticky',
            top: 0,
            // backgroundColor: 'rgba(0,100,0,0.1)',
            height: '100dvh',
          }}
        >
          <nav
            style={{
              // position: 'sticky',
              // top: 0,
              // border: '1px dashed black',
              width: '5rem',
              transition: 'width 0.3s ease-in-out',
              // height: '100%',
            }}
          >
            <ul>
              <li>123</li>
              <li
                onClick={() => {
                  setPopupIndex(POPUP_INDEX.SETTINGS)
                }}
              >
                settings
              </li>
              <li onClick={onClickLogout}>logout</li>
            </ul>
          </nav>
        </div>
        <div className='content' style={{ width: '100%' }}>
          <header
            style={{
              position: 'sticky',
              top: '-5rem',
              width: '100%',
              height: '10rem',
              // padding: '5rem',
              // backgroundColor: 'orange',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              className='card_box '
              style={{ width: '90%', height: '100%', margin: '1rem', backgroundColor: 'var(--card-background-color)' }}
            >
              header area
            </div>
          </header>

          <main
            className='main'
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
          </main>
        </div>
        <div style={{ height: '150dvh' }}>
          <div
            className='card_box elevated'
            style={{
              width: '10rem',
              height: '100%',
              backgroundColor: 'var(--card-background-color)',
              marginTop: '1rem',
              marginRight: '1rem',
              // margin: '1rem'
            }}
          >
            123
          </div>
        </div>
      </Flex.Row.Start>

      <Popup.Controller
        open={popupIndex}
        onClose={() => {
          setPopupIndex(POPUP_INDEX.CLOSED)
        }}
      >
        <Popup.Container dim='blur' popupIndex={POPUP_INDEX.SETTINGS}>
          <Settings />
        </Popup.Container>
      </Popup.Controller>
    </>
  )
}

export default Home
