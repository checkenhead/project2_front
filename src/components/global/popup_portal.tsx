import { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { useRecoilValue } from 'recoil'
import { popupDataState } from '@/atoms/global'
import { usePopupData } from '@/store/usePopupDataStore'

const popupRoot = document.getElementById('popup_root') as HTMLElement

const PopupPortal = () => {
  // const popupData = useRecoilValue(popupDataState)
  const popupDataset = usePopupData()

  return ReactDOM.createPortal(
    <>
      {popupDataset.map((popup) => (
        <Fragment key={popup.id}>{popup.node}</Fragment>
      ))}
    </>,
    popupRoot
  )
}

export default PopupPortal
