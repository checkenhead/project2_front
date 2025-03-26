import { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { useRecoilValue } from 'recoil'
import { popupDataState } from '@/atoms/global'

const popupRoot = document.getElementById('popup_root') as HTMLElement

const PopupPortal = () => {
  const popupData = useRecoilValue(popupDataState)

  return ReactDOM.createPortal(
    <>
      {popupData.map((popup) => (
        <Fragment key={popup.id}>{popup.node}</Fragment>
      ))}
    </>,
    popupRoot
  )
}

export default PopupPortal