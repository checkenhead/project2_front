const REGEX_PRESET = {
  WORD: /\w/,
  NUMBER: /\d/,
  ENG: /[a-zA-Z]/,
  ENG_UPPER: /[a-z]/,
  ENG_LOWER: /[A-Z]/,
  KOR: /[ㄱ-ㅣ가-힣]/,
  KOR_JAMO: /[ㄱ-ㅣ]/,
  KOR_COMPOSED: /[가-힣]/,
  UNDERSCORE: /_/,
  EMAIL: /([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})/,
  TEL: /\d{3}-\d{4}-\d{4}/,
  DATE: /(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/,
} as const

type RegExOptionsType = keyof typeof REGEX_PRESET

function is(this: typeof REGEX_PRESET, ...regex: RegExOptionsType[]) {
  const pattern = regex
    .map((r) => {
      const _pattern = this[r].source
      return _pattern.startsWith('[') && _pattern.endsWith(']') ? _pattern.slice(1, -1) : _pattern
    })
    .join('')
  const hasBracket = !!(pattern.split('[').length - 1)

  return RegExp(hasBracket ? `^${pattern}+$` : `^[${pattern}]+$`)
}
function has(this: typeof REGEX_PRESET, ...regex: RegExOptionsType[]) {
  const pattern = regex.map((r) => this[r].source).join('|')
  return RegExp(pattern)
}

/**
 * Regular Expression Utility
 */
export const REGEX = Object.assign(REGEX_PRESET, {
  is,
  has,
})
