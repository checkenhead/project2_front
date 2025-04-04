type ValidationSuccessType = { OK: 1 }
type ValidationUncheckType = { UNCHECK: null }
type ValidationErrorType = { ERROR: string }
type ValidationResultType = ValidationSuccessType & ValidationUncheckType & ValidationErrorType
export type ValidationResultValueType = ValidationResultType[keyof ValidationResultType]
export const VALIDATION_RESULT: Omit<ValidationResultType, keyof ValidationErrorType> = {
  UNCHECK: null,
  OK: 1,
} as const
