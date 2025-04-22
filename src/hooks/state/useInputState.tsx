import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { objUtil } from '@/utils/common'

type InputStateProps<S extends InputStateType<S>, L extends InputLabelType<S>> = {
  init: S
  label?: L
}
type InputStateType<S> = { [P in keyof S]: string | number }
type InputLabelType<S> = { [P in keyof S]?: string }
type ReturnLabelType<S extends InputStateType<S>, L extends InputLabelType<S>> = {
  [K in keyof S]: K
}

const useInputState = <S extends InputStateType<S>, L extends InputLabelType<S>>({
  init,
  label: _label,
}: InputStateProps<S, L>) => {
  const keys = Object.keys(init) as Array<keyof S>
  const [state, setState] = useState(init)
  const label = keys as ReturnLabelType<S, L>

  return [state, label] as const
}

export default useInputState
