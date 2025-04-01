import '@/styles/icon.scss'
import { ComponentType, lazy, LazyExoticComponent, Suspense, useMemo } from 'react'
import { camelToSnakeCase, getClassNames } from '@/utils/common'

const IconNames = [
  'alertTriangle',
  'arrowRight',
  'atSign',
  'bookmark',
  'checkCircle',
  'checkSquare',
  'check',
  'chevronDown',
  'circle',
  'clip',
  'closeCircle',
  'closeSquare',
  'close',
  'copy',
  'download',
  'editSquare',
  'edit',
  'feather',
  'filePlus',
  'file',
  'filter',
  'folderMinus',
  'folderPlus',
  'folder',
  'grid',
  'hash',
  'heart',
  'helpCircle',
  'home',
  'image',
  'infoCircle',
  'list',
  'loading',
  'login',
  'logout',
  'mail',
  'mapPin',
  'map',
  'menu',
  'moon',
  'more',
  'move',
  'none',
  'save',
  'search',
  'setting',
  'share',
  'squareInSquare',
  'square',
  'star',
  'sun',
  'tag',
  'thumbsDown',
  'thumbsUp',
  'trash',
  'upload',
  'userCheck',
  'userMinus',
  'userPlus',
  'userUncheck',
  'user',
  'users',
  'zoomIn',
  'zoomOut',
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
