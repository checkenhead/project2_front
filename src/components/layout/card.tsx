import '@/styles/layout.scss'
import React, { cloneElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { SimpleLayout } from '@/components/layout/simple_layout'
import { useResizeObserver } from '@/hooks/common/useResizeObserver'
import { getClassNames, objUtil } from '@/utils/common'
import { ValidationType } from '@/hooks/common/useCustomState'

type OutlinedStyleType<T> = true extends T ? { outlined?: T; border?: string } : { outlined?: T }
type ElevatedStyleType<T> = true extends T ? { elevated?: T; boxShadow?: string } : { elevated?: T }
type FilledStyleType<T> = true extends T ? { filled?: T; backgroundColor?: string } : { filled?: T }

type CardContainerProps<O extends undefined | boolean, E extends undefined | boolean, F extends undefined | boolean> = {
  children?: ReactNode
  className?: string
  margin?: string
  borderRadius?: string
} & OutlinedStyleType<undefined extends O ? false : O> &
  ElevatedStyleType<undefined extends E ? false : E> &
  FilledStyleType<undefined extends F ? false : F>

const CardContainer = <O extends boolean | undefined, E extends boolean | undefined, F extends boolean | undefined>(
  props: CardContainerProps<O, E, F>
) => {
  const { children, className, outlined, elevated, filled, ...styles } = props as CardContainerProps<true, true, true>

  const cardBoxClassName = useMemo(
    () => getClassNames('card_box', props, 'className', 'outlined', 'elevated', 'filled'),
    [className, outlined, elevated, filled]
  )

  const cardBoxStyle = useMemo(() => objUtil.getNotNullish(styles), [styles])

  return (
    <div className={cardBoxClassName} style={cardBoxStyle}>
      {children}
    </div>
  )
}

type CardTransitionProps = {
  children?: ReactNode
  durationSec?: number
  width?: string
  height?: string
}
const CardTransition = (props: CardTransitionProps) => {
  const { children, durationSec = 0.3, ...boxSize } = props

  const cloneChildren = useMemo(() => (children ? cloneElement(<>{children}</>) : null), [children])
  const [deferredChildren, setDeferredChildren] = useState<React.FunctionComponentElement<any> | null>(cloneChildren)
  const { observer, rect } = useResizeObserver()
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current)
      timer.current = undefined
    }

    if (children) {
      setDeferredChildren(cloneChildren)
    } else {
      timer.current = setTimeout(() => {
        setDeferredChildren(null)
        clearTimeout(timer.current)
        timer.current = undefined
      }, durationSec * 1000)
    }
  }, [cloneChildren])

  const customBoxSize = useMemo(() => objUtil.getNotNullish(boxSize), [boxSize])
  const convertedRect = useMemo(() => (rect ? { width: `${rect.width}px`, height: `${rect.height}px` } : {}), [rect])

  const currentBoxStyle = useMemo(
    () =>
      children
        ? { ...convertedRect, ...customBoxSize, opacity: '1' }
        : { width: '0', height: '0', ...customBoxSize, opacity: '0' },
    [children, convertedRect, customBoxSize]
  )
  const transition = useMemo(
    () =>
      durationSec
        ? {
            transition: `width ${durationSec}s ease-in-out, height ${durationSec}s ease-in-out, opacity ${durationSec}s ease-in-out`,
          }
        : {},
    [durationSec]
  )
  const cardTransitionBoxStyle = useMemo(() => ({ ...currentBoxStyle, ...transition }), [currentBoxStyle, transition])

  const cardTransitionClassName = useMemo(
    () => getClassNames('card_transition_box', { disabled: !deferredChildren }),
    [deferredChildren]
  )

  return (
    <div className={cardTransitionClassName} style={cardTransitionBoxStyle}>
      <div className='card_transition_content' style={customBoxSize} ref={observer}>
        {deferredChildren}
      </div>
    </div>
  )
}

type CardDividerProps = {
  className?: string
  margin?: string
  color?: string
}
const CardDivider = (props: CardDividerProps) => {
  const { className, margin, color: backgroundColor } = props

  const cardDividerClassName = useMemo(() => getClassNames('card_divider', props, 'className'), [className])
  const cardDividerStyle = useMemo(() => objUtil.getNotNullish({ margin, backgroundColor }), [])

  return <hr className={cardDividerClassName} style={cardDividerStyle} />
}

type CardTextProps = {
  children?: ReactNode
  className?: string
  padding?: string
  backgroundColor?: string
  color?: string
}
const CardText = (props: CardTextProps) => {
  const { children, className, ...styles } = props

  const cardTextClassName = useMemo(() => getClassNames('card_text', props, 'className'), [className])
  const cardTextStyle = useMemo(() => objUtil.getNotNullish(styles), [styles])

  return (
    <div className={cardTextClassName} style={cardTextStyle}>
      {children}
    </div>
  )
}

type CardTitleProps = {
  children?: ReactNode
  className?: string
  padding?: string
  color?: string
}
const CardTitleWrapper = (props: CardTitleProps) => {
  const { children, className, ...styles } = props

  const cardTitleClassName = useMemo(() => getClassNames('card_title', props, 'className'), [className])
  const cardTitleStyle = useMemo(() => objUtil.getNotNullish(styles), [styles])

  return (
    <div className={cardTitleClassName} style={cardTitleStyle}>
      {children}
    </div>
  )
}

const CardTitleHeading1 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h1>{props.children}</h1> })
const CardTitleHeading2 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h2>{props.children}</h2> })
const CardTitleHeading3 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h3>{props.children}</h3> })
const CardTitleHeading4 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h4>{props.children}</h4> })
const CardTitleHeading5 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h5>{props.children}</h5> })
const CardTitleHeading6 = (props: CardTitleProps) => CardTitleWrapper({ ...props, children: <h6>{props.children}</h6> })

type CardErrorMessageProps<T> = Omit<CardTransitionProps, 'children'> & {
  name: keyof T
  validation: ValidationType<T>
}
const CardErrorMessage = <T,>({ name, validation, ...rest }: CardErrorMessageProps<T>) => {
  return (
    <CardTransition {...rest}>
      {validation[name].isValid === false && (
        <CardText padding='1px' color='var(--invalid-color)'>
          {validation[name].msg}
        </CardText>
      )}
    </CardTransition>
  )
}

export const Card = Object.assign(CardContainer, {
  Section: SimpleLayout,
  Transition: CardTransition,
  Title: Object.assign(CardTitleHeading2, {
    H1: CardTitleHeading1,
    H2: CardTitleHeading2,
    H3: CardTitleHeading3,
    H4: CardTitleHeading4,
    H5: CardTitleHeading5,
    H6: CardTitleHeading6,
  }),
  Text: CardText,
  ErrorMessage: CardErrorMessage,
  Divider: CardDivider,
})
