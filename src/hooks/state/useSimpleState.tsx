import { useState } from 'react'
type SimpleStateValueType = any
type SimpleStateProps<S, K extends keyof S, V extends SimpleStateValueType> = {
  init: { [P in K]: V }
}

const useSimpleState = <S, K extends keyof S>({ init }: SimpleStateProps<S, K, SimpleStateValueType>) => {
  const [state, setState] = useState(init)
  return [state, setState] as const
  // return useState(init)
}

type InputStateValueType = string | number | boolean | undefined

export const useInputState2 = <S, K extends keyof S>({ init }: SimpleStateProps<S, K, InputStateValueType>) => {
  const [state, setState] = useSimpleState({ init })
  return [state, setState] as const
}

export default useSimpleState
