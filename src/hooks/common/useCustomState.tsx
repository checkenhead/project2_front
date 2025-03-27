import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { objUtil } from '@/utils/common'

export type CustomStateType<T> = { [P in keyof T]: T[P] }
export type ValidationType<T> = Record<keyof T, { isValid: boolean | undefined; msg: string | undefined }>

type SetSingleStateType<T> = { [P in keyof T]: (setStateAction: React.SetStateAction<T[P]>) => void }
type OnChangeType<T> = (name: keyof T, value: T[keyof T]) => void
type CheckSingleStateType<T> = { [P in keyof T]: (validator: ValidatorType<T, T[P]>) => boolean }
type CheckAllStateType<T> = (validator: CommonValidatorType<T, keyof T>) => boolean
type ResetResultType<T> = (...keys: Array<keyof T>) => void
type SetSingleResultType<T> = { [P in keyof T]: (result: ValidateReturnType) => void }

type ValidatorType<T, V> = (value: V, state: T) => ValidateReturnType
type CommonValidatorType<T, K> = (key: K, state: T) => ValidateReturnType
type ValidateReturnType = (typeof VALIDATE_RESULT)[keyof typeof VALIDATE_RESULT]

export const VALIDATE_RESULT: { UNCHECK: void | undefined; OK: true; ERROR: string } = {
  UNCHECK: undefined,
  OK: true,
  ERROR: 'Error',
} as const

const useCustomState = <T,>(initState = {} as CustomStateType<T>) => {
  const keys = useMemo(() => Object.keys(initState) as Array<keyof T>, [initState])
  const initResult: ValidationType<T> = useMemo(
    () => Object.assign({}, ...keys.map((key) => ({ [key]: { isValid: undefined, msg: undefined } }))),
    [keys]
  )

  const [state, setState] = useState(initState)
  const [result, setResult] = useState(initResult)
  const [isPassed, setIsPassed] = useState(false)

  const setSingleState = useMemo(
    () =>
      objUtil.map(state, (key) => ({
        [key]: (setStateAction: React.SetStateAction<CustomStateType<T>[keyof T]>) => {
          setState((prev) => ({
            ...prev,
            [key]:
              typeof setStateAction === 'function'
                ? (setStateAction as (prevState: CustomStateType<T>[keyof T]) => CustomStateType<T>[keyof T])(prev[key])
                : setStateAction,
          }))
        },
      })) as SetSingleStateType<T>,
    [initState]
  )

  const onChange: OnChangeType<T> = useCallback((name, value) => {
    return setState((prev) => ({ ...prev, [name]: value }))
  }, [])

  const checkSingleState = useMemo(
    () =>
      objUtil.map(state, (key, value) => ({
        [key]: (validator: ValidatorType<T, typeof value>) => {
          const validateResult = validator(value, state)
          const isValid = validateResult === VALIDATE_RESULT.OK

          setResult((prev) => {
            if (validateResult === VALIDATE_RESULT.UNCHECK)
              return { ...prev, [key]: { isValid: undefined, msg: undefined } }
            return isValid
              ? { ...prev, [key]: { isValid, msg: undefined } }
              : { ...prev, [key]: { isValid, msg: result } }
          })

          return isValid
        },
      })) as CheckSingleStateType<T>,
    [initState]
  )

  const checkAllState: CheckAllStateType<T> = useCallback(
    (validator) => {
      const validateResults = keys.map((key) => validator(key, state))

      const newResult = validateResults.map((result, index) => {
        if (result === VALIDATE_RESULT.UNCHECK) return { [keys[index]]: { isValid: undefined, msg: undefined } }

        const isValid = result === VALIDATE_RESULT.OK
        return isValid ? { [keys[index]]: { isValid, msg: undefined } } : { [keys[index]]: { isValid, msg: result } }
      })

      setResult(Object.assign({}, ...newResult))

      return validateResults.every((result) => result === VALIDATE_RESULT.OK)
    },
    [initState]
  )

  const setSingleResult = useMemo(
    () =>
      objUtil.map(state, (key) => ({
        [key]: (result: ValidateReturnType) => {
          setResult((prev) => {
            if (result === VALIDATE_RESULT.UNCHECK) return { ...prev, [key]: { isValid: undefined, msg: undefined } }

            const isValid = result === VALIDATE_RESULT.OK
            return isValid
              ? { ...prev, [key]: { isValid, msg: undefined } }
              : { ...prev, [key]: { isValid, msg: result } }
          })
        },
      })) as SetSingleResultType<T>,
    [initState]
  )

  const resetResult: ResetResultType<T> = useCallback((...keys) => {
    if (keys.length === 0) {
      setResult(initResult)
    } else {
      setResult((prev) => ({
        ...prev,
        ...Object.assign({}, ...keys.map((key) => ({ [key]: { isValid: undefined, msg: undefined } }))),
      }))
    }
  }, [])

  useEffect(() => {
    return () => {
      setState({} as CustomStateType<T>)
      setResult({} as ValidationType<T>)
    }
  }, [])

  useEffect(() => {
    setIsPassed(keys.every((key) => result?.[key as keyof T]?.isValid))
  }, [result])

  return [
    {
      state,
      setState,
      /**
       * 한개의 state를 업데이트합니다.
       * @param {setStateAction} setStateAction
       */
      set: setSingleState,
      onChange,
    },
    {
      /**
       * validation 통과여부
       */
      isPassed,
      /**
       * 한개의 state에 대해 validation합니다. 해당 state가 validate 통과 시 true를 return합니다.
       */
      check: checkSingleState,
      /**
       * 모든 state에 대해 validation합니다. 모든 state가 validate 통과 시 true를 return합니다.
       */
      checkAll: checkAllState,
      /**
       * validation result를 초기화합니다.
       * @param {keyof T} keys 초기화할 result의 key를 rest parameter 형태로 전달합니다. key를 입력하지 않으면 전체 초기화됩니다.
       */
      reset: resetResult,
      result,
      /**
       * 한개의 validation result를 업데이트합니다.
       * @param {ValidateResultType} result VALIDATE_RESULT.OK, VALIDATE_RESULT.UNCHECK, VALIDATE_RESULT.ERROR 또는 string의 error description
       */
      set: setSingleResult,
    },
  ] as const
}

export default useCustomState
