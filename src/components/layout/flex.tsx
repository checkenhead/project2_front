import '@/styles/layout.scss'
import { memo, useMemo } from 'react'
import { SimpleLayoutProps } from '@/components/layout/simple_layout'
import { getClassNames, objUtil } from '@/utils/common'

type FlexAlignByDirection<D extends boolean> = true extends D
  ? 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly'
  : 'center' | 'start' | 'end'

type FlexLayoutProps<D extends 'row' | 'col'> = SimpleLayoutProps & {
  direction: D
  xAlign?: FlexAlignByDirection<'row' extends D ? true : false>
  yAlign?: FlexAlignByDirection<'row' extends D ? false : true>
  gap?: string
}

const FlexLayout = <D extends 'row' | 'col'>(props: FlexLayoutProps<D>) => {
  const { children, className, direction, xAlign, yAlign, ...styles } = props

  const flexClassNames = useMemo(
    () => ({
      className,
      direction: `direction_${direction}`,
      justify: `justify_${(direction === 'row' ? xAlign : yAlign) ?? 'start'}`,
      align: `align_${(direction === 'col' ? xAlign : yAlign) ?? 'start'}`,
    }),
    [className, direction, xAlign, yAlign]
  )

  const flexLayoutClassName = useMemo(() => getClassNames('layout flex', flexClassNames), [flexClassNames])
  const flexLayoutStyle = useMemo(() => objUtil.getNotNullish(styles), [styles])

  return (
    <div className={flexLayoutClassName} style={flexLayoutStyle}>
      {props.children}
    </div>
  )
}

type FlexRowType = Omit<FlexLayoutProps<'row'>, 'direction'>
type RowVariantType = Omit<FlexLayoutProps<'row'>, 'direction' | 'xAlign' | 'yAlign'>
type FlexColType = Omit<FlexLayoutProps<'col'>, 'direction'>
type ColVariantType = Omit<FlexLayoutProps<'col'>, 'direction' | 'xAlign' | 'yAlign'>

const FlexRow = (props: FlexRowType) => <FlexLayout direction='row' {...props} />
const RowCenter = (props: RowVariantType) => <FlexLayout direction='row' xAlign='center' yAlign='center' {...props} />
const RowCenterStart = (props: RowVariantType) => (
  <FlexLayout direction='row' xAlign='center' yAlign='start' {...props} />
)
const RowCenterEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='center' yAlign='end' {...props} />
const RowStart = (props: RowVariantType) => <FlexLayout direction='row' xAlign='start' yAlign='start' {...props} />
const RowStartCenter = (props: RowVariantType) => (
  <FlexLayout direction='row' xAlign='start' yAlign='center' {...props} />
)
const RowStartEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='start' yAlign='end' {...props} />
const RowEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='end' yAlign='end' {...props} />
const RowEndCenter = (props: RowVariantType) => <FlexLayout direction='row' xAlign='end' yAlign='center' {...props} />
const RowEndStart = (props: RowVariantType) => <FlexLayout direction='row' xAlign='end' yAlign='start' {...props} />
const RowBetween = (props: RowVariantType) => <FlexLayout direction='row' xAlign='between' yAlign='center' {...props} />
const RowBetweenStart = (props: RowVariantType) => (
  <FlexLayout direction='row' xAlign='between' yAlign='start' {...props} />
)
const RowBetweenEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='between' yAlign='end' {...props} />
const RowAround = (props: RowVariantType) => <FlexLayout direction='row' xAlign='around' yAlign='center' {...props} />
const RowAroundStart = (props: RowVariantType) => (
  <FlexLayout direction='row' xAlign='around' yAlign='start' {...props} />
)
const RowAroundEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='around' yAlign='end' {...props} />
const RowEvenly = (props: RowVariantType) => <FlexLayout direction='row' xAlign='evenly' yAlign='center' {...props} />
const RowEvenlyStart = (props: RowVariantType) => (
  <FlexLayout direction='row' xAlign='evenly' yAlign='start' {...props} />
)
const RowEvenlyEnd = (props: RowVariantType) => <FlexLayout direction='row' xAlign='evenly' yAlign='end' {...props} />
const FlexCol = (props: FlexColType) => <FlexLayout direction='col' {...props} />
const ColCenter = (props: ColVariantType) => <FlexLayout direction='col' xAlign='center' yAlign='center' {...props} />
const ColCenterStart = (props: ColVariantType) => (
  <FlexLayout direction='col' xAlign='start' yAlign='center' {...props} />
)
const ColCenterEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='center' {...props} />
const ColStart = (props: ColVariantType) => <FlexLayout direction='col' xAlign='start' yAlign='start' {...props} />
const ColStartCenter = (props: ColVariantType) => (
  <FlexLayout direction='col' xAlign='center' yAlign='start' {...props} />
)
const ColStartEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='start' {...props} />
const ColEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='end' {...props} />
const ColEndCenter = (props: ColVariantType) => <FlexLayout direction='col' xAlign='center' yAlign='end' {...props} />
const ColEndStart = (props: ColVariantType) => <FlexLayout direction='col' xAlign='start' yAlign='end' {...props} />
const ColBetween = (props: ColVariantType) => <FlexLayout direction='col' xAlign='center' yAlign='between' {...props} />
const ColBetweenStart = (props: ColVariantType) => (
  <FlexLayout direction='col' xAlign='start' yAlign='between' {...props} />
)
const ColBetweenEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='between' {...props} />
const ColAround = (props: ColVariantType) => <FlexLayout direction='col' xAlign='center' yAlign='around' {...props} />
const ColAroundStart = (props: ColVariantType) => (
  <FlexLayout direction='col' xAlign='start' yAlign='around' {...props} />
)
const ColAroundEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='around' {...props} />
const ColEvenly = (props: ColVariantType) => <FlexLayout direction='col' xAlign='center' yAlign='evenly' {...props} />
const ColEvenlyStart = (props: ColVariantType) => (
  <FlexLayout direction='col' xAlign='start' yAlign='evenly' {...props} />
)
const ColEvenlyEnd = (props: ColVariantType) => <FlexLayout direction='col' xAlign='end' yAlign='evenly' {...props} />

export const Flex = Object.assign(FlexLayout, {
  Row: Object.assign(FlexRow, {
    Center: Object.assign(RowCenter, { Start: RowCenterStart, End: RowCenterEnd }),
    Start: Object.assign(RowStart, { Center: RowStartCenter, End: RowStartEnd }),
    End: Object.assign(RowEnd, { Center: RowEndCenter, Start: RowEndStart }),
    Between: Object.assign(RowBetween, { Start: RowBetweenStart, End: RowBetweenEnd }),
    Around: Object.assign(RowAround, { Start: RowAroundStart, End: RowAroundEnd }),
    Evenly: Object.assign(RowEvenly, { Start: RowEvenlyStart, End: RowEvenlyEnd }),
  }),
  Col: Object.assign(FlexCol, {
    Center: Object.assign(ColCenter, { Start: ColCenterStart, End: ColCenterEnd }),
    Start: Object.assign(ColStart, { Center: ColStartCenter, End: ColStartEnd }),
    End: Object.assign(ColEnd, { Center: ColEndCenter, Start: ColEndStart }),
    Between: Object.assign(ColBetween, { Start: ColBetweenStart, End: ColBetweenEnd }),
    Around: Object.assign(ColAround, { Start: ColAroundStart, End: ColAroundEnd }),
    Evenly: Object.assign(ColEvenly, { Start: ColEvenlyStart, End: ColEvenlyEnd }),
  }),
})
