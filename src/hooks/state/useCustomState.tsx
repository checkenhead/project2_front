import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { objUtil } from '@/utils/common'
import { VALIDATION_RESULT, ValidationResultValueType } from '@/constants/validation'

// props type

type CustomStateProps<T extends InitStateType<T>, L extends LabelType<T>> = {
  init: T
  label?: L
  constraint?: ConstraintType<ConstraintLabelType<T, L>>
}
type InitStateType<T> = { [P in keyof T]: T[P] }
type LabelType<T> = Partial<Record<keyof T, string>>
type ConstraintType<T> = {
  empty?: { onError: ConstraintCallbackType<T> }
  length?: { min: number; max: number; onError: ConstraintCallbackType<T> }
  size?: { min: number; max: number; onError: ConstraintCallbackType<T> }
}
type ConstraintCallbackType<T> = (label: T) => string
type ConstraintLabelType<T, L> = undefined extends L[keyof L] ? keyof T : L[keyof L] | Exclude<keyof T, keyof L>
type ReturnLabelType<T, L, K extends keyof T> = K extends keyof L ? (L[K] extends string ? L[K] : K) : K

// hook return type

type CustomStateReturnType<T, L> = [StateRelatedType<T, L>, ValidationRelatedType<T, L>]
type StateRelatedType<T, L> = Readonly<{
  state: T
  setState: React.Dispatch<React.SetStateAction<T>>
  set: SetSingleStateType<T>
  onChange: OnChangeType<T>
  label: { [P in keyof T]: ReturnLabelType<T, L, P> }
}>
type ValidationRelatedType<T, L> = Readonly<{
  isPassed: boolean
  check: CheckSingleStateType<T, L>
  checkAll: CheckAllStateType<T, L>
  reset: ResetResultType<T>
  result: ValidationType<T>
  set: SetSingleResultType<T>
}>

// hook util types

export type ValidationType<T> = Record<keyof T, { isValid: boolean | undefined; msg: string | undefined }>
type SetSingleStateType<T> = { [P in keyof T]: (setStateAction: React.SetStateAction<T[P]>) => void }
type OnChangeType<T> = (name: keyof T, value: T[keyof T]) => void
type CheckSingleStateType<T, L> = {
  [P in keyof T]: (validator: ValidatorType<T, T[P], L> | ValidationResultValueType) => boolean
}
type CheckAllStateType<T, L> = (validator: CommonValidatorType<T, keyof T, L> | ValidationResultValueType) => boolean
type ResetResultType<T> = (...keys: Array<keyof T>) => void
type SetSingleResultType<T> = { [P in keyof T]: (result: ValidationResultValueType) => void }
type ValidatorType<T, V, L> = (value: V, state: T, label: ConstraintLabelType<T, L>) => ValidationResultValueType
type CommonValidatorType<T, K, L> = (key: K, state: T, label: ConstraintLabelType<T, L>) => ValidationResultValueType

/**
 *
 * @param init 초기 state
 * @param label 각 state에 대응하는 label을 지정
 * @param constraint 모든 state가 공통적으로 갖는 constraint
 */
const useCustomState = <T extends InitStateType<T>, L extends LabelType<T>>({
  init,
  label: _label,
  constraint,
}: CustomStateProps<T, L>) => {
  const label = useMemo(
    () =>
      objUtil.map(init, (key) => ({ [key]: _label?.[key] ?? key.toString() })) as {
        [P in keyof T]: ConstraintLabelType<T, L>
      },
    [init]
  )
  const keys = useMemo(() => Object.keys(init) as Array<keyof T>, [init])

  const initResult: ValidationType<T> = useMemo(
    () => Object.assign({}, ...keys.map((key) => ({ [key]: { isValid: undefined, msg: undefined } }))),
    [keys]
  )

  const [state, setState] = useState(init)
  const [result, setResult] = useState(initResult)
  const [isPassed, setIsPassed] = useState(false)

  const setSingleState = useMemo(
    () =>
      objUtil.map(state, (key) => ({
        [key]: (setStateAction: React.SetStateAction<InitStateType<T>[keyof T]>) => {
          setState((prev) => ({
            ...prev,
            [key]:
              typeof setStateAction === 'function'
                ? (setStateAction as (prevState: InitStateType<T>[keyof T]) => InitStateType<T>[keyof T])(prev[key])
                : setStateAction,
          }))
        },
      })) as SetSingleStateType<T>,
    [init]
  )

  const onChange: OnChangeType<T> = useCallback((name, value) => {
    return setState((prev) => ({ ...prev, [name]: value }))
  }, [])

  const checkSingleState = useMemo(
    () =>
      objUtil.map(state, (key, value) => ({
        [key]: (validator: ValidatorType<T, typeof value, L> | ValidationResultValueType) => {
          const constraintResult = checkConstraint(key)
          const validateResult =
            constraintResult !== VALIDATION_RESULT.OK
              ? constraintResult
              : typeof validator === 'function'
                ? validator(value, state, label[key])
                : validator

          const isValid = validateResult === VALIDATION_RESULT.OK

          setResult((prev) => {
            if (validateResult === VALIDATION_RESULT.UNCHECK)
              return { ...prev, [key]: { isValid: undefined, msg: undefined } }
            return isValid
              ? { ...prev, [key]: { isValid, msg: undefined } }
              : { ...prev, [key]: { isValid, msg: result } }
          })

          return isValid
        },
      })) as CheckSingleStateType<T, L>,
    [init]
  )

  const checkAllState: CheckAllStateType<T, L> = useCallback(
    (validator) => {
      const validateResults = keys.map((key) => {
        const constraintResult = checkConstraint(key)
        return constraintResult !== VALIDATION_RESULT.OK
          ? constraintResult
          : typeof validator === 'function'
            ? validator(key, state, label[key])
            : validator
      })

      const newResult = validateResults.map((result, index) => {
        if (result === VALIDATION_RESULT.UNCHECK) return { [keys[index]]: { isValid: undefined, msg: undefined } }

        const isValid = result === VALIDATION_RESULT.OK
        return isValid ? { [keys[index]]: { isValid, msg: undefined } } : { [keys[index]]: { isValid, msg: result } }
      })

      setResult(Object.assign({}, ...newResult))

      return validateResults.every((result) => result === VALIDATION_RESULT.OK)
    },
    [init]
  )

  const setSingleResult = useMemo(
    () =>
      objUtil.map(state, (key) => ({
        [key]: (result: ValidationResultValueType) => {
          setResult((prev) => {
            if (result === VALIDATION_RESULT.UNCHECK) return { ...prev, [key]: { isValid: undefined, msg: undefined } }

            const isValid = result === VALIDATION_RESULT.OK
            return isValid
              ? { ...prev, [key]: { isValid, msg: undefined } }
              : { ...prev, [key]: { isValid, msg: result } }
          })
        },
      })) as SetSingleResultType<T>,
    [init]
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

  const checkConstraint = (key: keyof T): ValidationResultValueType => {
    if (constraint?.empty !== undefined && !state[key]) return constraint.empty.onError(label[key])
    if (
      constraint?.length !== undefined &&
      typeof state[key] === 'string' &&
      ((state[key] as string).length > constraint.length.max || (state[key] as string).length < constraint.length.min)
    )
      return constraint.length.onError(label[key])

    let convertedValue
    if (
      constraint?.size !== undefined &&
      !isNaN((convertedValue = Number(state[key]))) &&
      (convertedValue > constraint.size.max || convertedValue < constraint.size.min)
    )
      return constraint.size.onError(label[key])

    return VALIDATION_RESULT.OK
  }

  useEffect(() => {
    return () => {
      setState({} as InitStateType<T>)
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
      label,
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
  ] as CustomStateReturnType<T, L>
}

export default useCustomState
