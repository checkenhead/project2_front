import { regExAndTest, regExNorTest } from '@/utils/common'

const REGEX_OPTIONS = [
  'ENG',
  'ENG_LOWER',
  'ENG_UPPER',
  'KOR',
  'KOR_COMPLETED',
  'WHITE_SPACE',
  'SPECIAL_CHAR',
  'UNDERSCORE',
  'EMAIL',
  'TEL',
  'NUMBER',
  'DATE',
] as const

export type RegExOptionsType = (typeof REGEX_OPTIONS)[number]

const REGEXP_PRESET: Record<RegExOptionsType, RegExp> = {
  ENG: /[a-zA-Z]/,
  ENG_LOWER: /[a-z]/,
  ENG_UPPER: /[A-Z]/,
  KOR: /[ㄱ-ㅣ가-힣]/,
  KOR_COMPLETED: /[가-힣]/,
  WHITE_SPACE: /\s/,
  SPECIAL_CHAR: /[^a-zA-Z0-9가-힣ㄱ-ㅣ\s]/,
  UNDERSCORE: /_/,
  NUMBER: /[0-9]/,
  EMAIL: /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/,
  TEL: /\d{3}-\d{4}-\d{4}/g,
  DATE: /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
} as const

export const REGEX = Object.assign(REGEXP_PRESET, {
  allow: regExAndTest,
  notAllow: regExNorTest,
})
