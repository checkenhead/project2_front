import { ComponentType, lazy, LazyExoticComponent, useMemo } from 'react'
import { camelToSnakeCase } from '@/utils/common'

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
  type: IconType
}
const Icon = ({ type }: IconProps) => {
  const SelectedIcon = useMemo(() => IconSet[type], [type])
  return <SelectedIcon />
}

export default Icon
