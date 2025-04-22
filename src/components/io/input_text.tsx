import '@/styles/input2.scss'
import { memo, useId, useMemo, useState } from 'react'
import { getClassNames } from '@/utils/common'

type InputTextProps<T extends string> = {
  name: T
  label: string
  className?: string
  value: string | undefined
  onChange?: (name: T, value: string) => void
}

const InputText = <T extends string>(props: InputTextProps<T>) => {
  const [focused, setFocused] = useState(false)
  const contained = !!props.value
  const id = useId()

  const inputBoxClassName = useMemo(() => getClassNames('input_box', { focused, contained }), [focused, contained])

  const disabled = true

  return (
    <label className={inputBoxClassName}>
      <label className='input_placeholder' htmlFor={id}>
        {props.label}
      </label>
      <input
        className='input'
        name={props.name}
        id={id}
        type='text'
        value={props.value}
        onChange={(e) => {
          props.onChange?.(props.name, e.currentTarget.value)
        }}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
      />
      <span className='input_underline'></span>
    </label>
  )
}

export default InputText
