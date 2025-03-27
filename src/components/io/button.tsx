import '@/styles/button.scss'
import React, { useMemo } from 'react'
import { getClassNames, objUtil } from '@/utils/common'
import Icon from '@/components/common/icon'

type ButtonProps = {
  children?: React.ReactNode
  id?: string
  className?: string
  submit?: boolean
  disabled?: boolean
  pending?: boolean
  width?: string
  height?: string
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({ children, id, onClick, className, submit, disabled, pending, width, height }: ButtonProps) => {
  const buttonBoxClassName = useMemo(
    () => getClassNames('button_box', { className, submit, disabled, pending }),
    [className, submit, disabled, pending]
  )
  const buttonBoxStyle = useMemo(() => objUtil.getNotNullish({ width, height }), [width, height])

  return (
    <div className={buttonBoxClassName} style={buttonBoxStyle}>
      <button
        id={id}
        className='button'
        type='button'
        onClick={(e) => {
          e.preventDefault()
          if (disabled || pending) return
          onClick?.(e)
        }}
      >
        <div className='content'>{children}</div>
        {pending && (
          <div className='pending_box'>
            <Icon type='loading' size='100%' />
          </div>
        )}
      </button>
    </div>
  )
}

export default Button
