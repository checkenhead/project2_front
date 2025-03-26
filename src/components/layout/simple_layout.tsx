import '@/styles/layout.scss'
import { ReactNode, useMemo } from 'react'
import { getClassNames, objUtil } from '@/utils/common'

export type SimpleLayoutProps = {
  children?: ReactNode
  className?: string

  width?: string
  height?: string
  padding?: string
  margin?: string
  border?: string
  borderRadius?: string
  backgroundColor?: string
}
export const SimpleLayout = (props: SimpleLayoutProps) => {
  const { children, className, ...styles } = props

  const layoutClassName = useMemo(() => getClassNames('layout', props, 'className'), [className])
  const layoutStyle = useMemo(() => objUtil.getNotNullish(styles), [styles])

  return (
    <div className={layoutClassName} style={layoutStyle}>
      {children}
    </div>
  )
}