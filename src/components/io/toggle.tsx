import '@/styles/toggle.scss'
import { ReactNode } from 'react'
import { getClassNames } from '@/utils/common.ts'

type ToggleProps<V, K extends Extract<keyof V, string>, CV> = {
  name: K
  value: V
  /** valueMap must be an array of [falsy value, truthy value] or undefined. If value does not match any element in valueMap, a runtime error occurs. */
  valueMap?: undefined extends CV ? undefined : [V[K], V[K]]
  onChange?: (name: K, value: undefined extends CV ? boolean : V[K]) => void
  inactiveIcon?: ReactNode
  activeIcon?: ReactNode
  disabled?: boolean
  className?: string
}

const Toggle = <V, K extends Extract<keyof V, string>, CV>(props: ToggleProps<V, K, CV>) => {
  const checked = props.valueMap ? props.valueMap[0] !== props.value[props.name] : !!props.value[props.name]

  const classNames = { className: props.className, disabled: props.disabled, active: checked }
  const toggleButtonBoxClassName = getClassNames('toggle_button_box', classNames, 'className')
  const toggleButtonClassName = getClassNames('toggle_button', classNames, 'disabled', 'active')

  return (
    <label className={toggleButtonBoxClassName}>
      <div className={toggleButtonClassName}>
        <div className='switch'>
          <div className='inactive'>{props.inactiveIcon ? props.inactiveIcon : <div className='none_icon'></div>}</div>
          <div className='active'>{props.activeIcon ? props.activeIcon : <div className='none_icon'></div>}</div>
        </div>
        <input
          type='checkbox'
          name={props.name}
          checked={checked}
          onChange={(e) => {
            if (props.disabled) return

            if (props.valueMap === undefined)
              (props.onChange as (name: K, value: boolean) => void)(props.name, e.currentTarget.checked)
            else
              (props.onChange as (name: K, value: V[K]) => void)(props.name, props.valueMap[+e.currentTarget.checked])
          }}
          style={{ display: 'none' }}
        />
      </div>
    </label>
  )
}

export default Toggle
