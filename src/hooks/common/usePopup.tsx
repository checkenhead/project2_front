import '@/styles/popup.scss'
// import { useSetRecoilState } from 'recoil'
// import { popupDataState } from '@/atoms/global'
import React, { cloneElement, ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react'

import Icon from '@/components/common/icon'
import { Card } from '@/components/layout/card'
import { Flex } from '@/components/layout/flex'
import Button from '@/components/io/button.tsx'
import { usePopupDataAction } from '@/store/usePopupDataStore'

const POPUP_ID_PREFIX = 'popup_'

type ConfirmProps = {
  title?: string
  message?: string
  buttons?: Array<ConfirmButtonType>
  onClickCancel?: () => void
  onClickOk?: () => void
}
type ConfirmButtonType = {
  submit?: boolean
  content?: React.ReactNode
  callback?: (close: () => void, e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type AlertProps = {
  title?: string
  message?: string
  onClickOk?: () => void
}

export const usePopup = () => {
  // const _setPopupData = useSetRecoilState(popupDataState)
  const { pushPopupData, filterPopupData } = usePopupDataAction()
  const childrenIds = useRef<string[]>([])

  const confirm = useCallback((props: ConfirmProps) => {
    const id = generateId()
    const buttons = !!props.buttons
      ? props.buttons
      : ([
          {
            content: '취소',
            callback: (close) => {
              props.onClickCancel?.()
              close()
            },
          },
          {
            submit: true,
            content: '확인',
            callback: (close) => {
              props.onClickOk?.()
              close()
            },
          },
        ] as Array<ConfirmButtonType>)

    setPopupData({
      id,
      node: (
        <Container
          className='confirm'
          autoAllocatedId={id}
          dim='transparent'
          clickDimToClose={false}
          position='top'
          animation
          buttons={buttons}
        >
          <Flex.Row xAlign='start' gap='0.5rem'>
            <Icon type='infoCircle' size='75px' />
            <Flex.Col gap='0.3rem'>
              {!!props.title && <Card.Title>{props.title}</Card.Title>}
              {props.message}
            </Flex.Col>
          </Flex.Row>
        </Container>
      ),
    })
  }, [])

  const alert = useCallback((props: AlertProps) => {
    const id = generateId()

    setPopupData({
      id,
      node: (
        <Container
          className='alert'
          autoAllocatedId={id}
          dim='transparent'
          clickDimToClose={false}
          position='top'
          animation
          buttons={[
            {
              submit: true,
              content: '확인',
              callback: (close) => {
                props.onClickOk?.()
                close()
              },
            },
          ]}
        >
          <Flex.Row gap='0.5rem'>
            <Icon type='alertTriangle' size='75px' />
            <Flex.Col gap='0.3rem'>
              {!!props.title && <Card.Title>{props.title}</Card.Title>}
              {props.message}
            </Flex.Col>
          </Flex.Row>
        </Container>
      ),
    })
  }, [])

  const toast = useCallback((props: AlertProps) => {
    const id = generateId()

    setPopupData({
      id,
      node: (
        <Container
          className='toast'
          autoAllocatedId={id}
          dim='none'
          clickDimToClose={false}
          position='bottom'
          animation={2000}
        >
          <Flex.Row yAlign='center' gap='0.3rem'>
            <Icon type='infoCircle' size='25px' />
            {!!props.title && <Card.Title>{props.title}</Card.Title>}
            {props.message}
          </Flex.Row>
        </Container>
      ),
    })
  }, [])

  const generateId = useCallback(() => {
    const lastIndex = childrenIds.current.length - 1
    const lastId = lastIndex > -1 ? childrenIds.current[lastIndex] : `${POPUP_ID_PREFIX}${-1}`
    let id = +lastId.replace(POPUP_ID_PREFIX, '')

    while (!!document.getElementById(`${POPUP_ID_PREFIX}${++id}`)) {
      /* empty */
    }

    const newId = `${POPUP_ID_PREFIX}${id}`
    childrenIds.current.push(newId)

    return newId
  }, [])

  const setPopupData = useCallback((newPopup: { id: string; node: ReactNode }) => {
    // _setPopupData((prev) => [...prev.filter((popup) => !!document.getElementById(popup.id)), newPopup])
    filterPopupData((popup) => !!document.getElementById(popup.id))
    pushPopupData(newPopup)
  }, [])

  return { confirm, alert, toast }
}

type ControllerProps = {
  children?: ReactNode
  open?: number
  onClose?: () => void
}
const Controller = (props: ControllerProps) => {
  if (props.open === undefined) return <></>

  const child = React.Children.toArray(props.children)
    .filter((child: any) => child.type.name === 'Container')
    .find((child: any) => child.props.popupIndex === props.open)

  if (!!child) {
    return cloneElement(child as JSX.Element, { onClose: props.onClose })
  } else return <></>
}

type ContainerProps = {
  children?: ReactNode
  id?: string
  className?: string
  autoAllocatedId?: string
  /** default: "normal" */
  dim?: 'normal' | 'blur' | 'transparent' | 'none'
  /** default: true */
  clickDimToClose?: boolean
  /** default: true */
  preventBackgroundScroll?: boolean
  /** default: "center" */
  position?: 'center' | 'top' | 'bottom'
  /** default: false */
  animation?: boolean | number
  buttons?: {
    submit?: boolean
    content?: ReactNode
    callback?: (close: () => void, e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }[]
  onClose?: () => void
  popupIndex?: number
}

export const Container = (props: ContainerProps) => {
  const { dim = 'normal', clickDimToClose = true, preventBackgroundScroll = true, position = 'center' } = props

  const _id = useId()
  const id = !!props.autoAllocatedId ? props.autoAllocatedId : props.id ? props.id : _id
  const className = !!props.className ? ` ${props.className}` : ''
  const preventScroll = preventBackgroundScroll ? ' prevent_scroll' : ''

  // const setPopupData = useSetRecoilState(popupDataState)
  const { pushPopupData, removePopupData } = usePopupDataAction()
  const [animation, setAnimation] = useState<boolean>(false)

  const close = useCallback(() => {
    if (!!props.animation) {
      setAnimation(false)
      const timer = setTimeout(() => {
        props.onClose?.()
        // setPopupData((prev) => prev.filter((popup) => popup.id !== id))
        removePopupData(id)
        clearTimeout(timer)
      }, 300)
    } else {
      props.onClose?.()
      // setPopupData((prev) => prev.filter((popup) => popup.id !== id))
      removePopupData(id)
    }
  }, [])

  const focusOnMount = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.focus()
    }
  }, [])

  useEffect(() => {
    if (!!props.animation) {
      setAnimation(true)
      if (typeof props.animation === 'number') {
        const timer = setTimeout(() => {
          close()
          clearTimeout(timer)
        }, props.animation)
      }
    }
  }, [])

  useEffect(() => {
    if (!props.autoAllocatedId) {
      // setPopupData((prev) => [...prev, { id, node }])
      pushPopupData({ id, node })
    }
  }, [])

  const node = (
    <div
      ref={focusOnMount}
      id={id}
      className={`popup${preventScroll}${dim === 'none' ? ' none_dim' : ''}`}
      tabIndex={0}
    >
      {dim !== 'none' && <div className={`dim dim_${dim}`} onClick={clickDimToClose ? close : undefined}></div>}
      <div className={`content_box${className}${animation ? ' animation' : ''} ${position}`}>
        <div className='content'>{props.children}</div>
        {!!props.buttons && (
          <div className='buttons'>
            {props.buttons?.map((button, index) => (
              <Button
                submit={button.submit}
                width='100%'
                key={index}
                onClick={(e) => {
                  button.callback?.(close, e)
                }}
              >
                {button.content}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return props.autoAllocatedId ? node : <></>
}

const Popup = {
  Controller,
  Container,
}

export default Popup
