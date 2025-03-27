import '@/styles/icon.scss'
import { ComponentType, lazy, LazyExoticComponent, Suspense, useMemo } from 'react'
import { camelToSnakeCase, getClassNames } from '@/utils/common'

const IconNames = [
  'alertTriangle',
  'check',
  'checkCircle',
  'checkSquare',
  'chevronDown',
  'circle',
  'feather',
  'helpCircle',
  'infoCircle',
  'loading',
  'login',
  'logout',
  'moon',
  'search',
  'square',
  'squareInSquare',
  'sun',
] as const

type IconType = (typeof IconNames)[number]

const IconSet: Record<IconType, LazyExoticComponent<ComponentType<any>>> = Object.assign(
  {},
  ...IconNames.map((name) => ({
    [name]: lazy(() => import(`@/assets/icon/${camelToSnakeCase(name)}.svg?react`)),
  }))
)

type IconProps = {
  className?: string
  type: IconType
  size?: string
  color?: string
  strokeAnimation?: boolean
  rotateAnimation?: boolean
  onClick?: () => void
}
const Icon = (props: IconProps) => {
  const {
    className,
    type,
    size = '100%',
    color,
    strokeAnimation: stroke_animation,
    rotateAnimation: rotate_animation,
    onClick,
  } = props

  const SelectedIcon = useMemo(() => IconSet[type], [type])
  const iconClassName = useMemo(
    () => getClassNames('icon', { className, stroke_animation, rotate_animation }),
    [className, stroke_animation, rotate_animation]
  )

  return (
    <Suspense fallback={<div className={iconClassName} style={{ width: size, height: size }}></div>}>
      <SelectedIcon
        className={iconClassName}
        width={size}
        height={size}
        style={{ aspectRatio: '1', color }}
        onClick={() => {
          onClick?.()
        }}
      />
    </Suspense>
  )
}

export default Icon
