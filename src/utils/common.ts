import { QueryType } from '@/utils/fetcher'

export const toQueryString = (query: QueryType | undefined | null): string => {
  if (!query) return ''
  const queryString = Object.keys(query)
    .filter((key) => query[key] !== undefined)
    .sort()
    .map((key) => `${key}=${query[key]}`)
    .join('&')

  return !!queryString ? `?${queryString}` : ''
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    const timer = setTimeout((): void => {
      resolve(() => {
        clearTimeout(timer)
      })
    }, ms)
  })
}

export const deepCompare = (valueA: any, valueB: any, strict: boolean = true): boolean => {
  if (valueA === valueB) return true

  const keyA = Object.keys(valueA ?? {})
  const keyB = Object.keys(valueB ?? {})

  if (keyA.length !== keyB.length) return false

  return keyA.every((key) => {
    const _valueA = valueA?.[key]
    const _valueB = valueB?.[key]

    if (typeof _valueA === 'object' && typeof _valueB === 'object') {
      return deepCompare(_valueA, _valueB, strict)
    }

    return strict ? _valueA === _valueB : _valueA == _valueB
  })
}

export const addPostpositionKor = (
  korStr: string,
  type: '이/가' | '은/는' | '을/를' | '으로/로',
  onlyPostposition: boolean = false
): string => {
  const code = korStr.charCodeAt(korStr.length - 1)
  const condition = +((code - 44032) % 28 === 0)

  return (onlyPostposition ? '' : korStr) + type.split('/')[condition]
}

const objKeys = <K extends keyof T, T extends Record<K, T[K]>>(obj: T) => Object.keys(obj) as K[]

const objMap = <T extends Record<keyof T, unknown>, R extends Record<any, unknown>>(
  obj: T,
  callbackFn: <K extends keyof T>(key: K, value: T[K]) => R
): { [P in keyof R]: R[P] } => {
  return Object.assign({}, ...Object.keys(obj).map((key) => callbackFn(key as keyof T, obj[key as keyof T])))
}

const getNotNullish = <K extends keyof T, T extends Record<K, T[K]>>(
  obj: T
): Record<K, Exclude<T[K], null | undefined>> | object => {
  return Object.assign(
    {},
    ...Object.keys(obj).map((key) =>
      obj[key as K] === undefined || obj[key as K] === null ? {} : { [key]: obj[key as K] }
    )
  )
}

export const objUtil = {
  keys: objKeys,
  map: objMap,
  getNotNullish,
}

export const getClassNames = <T extends object>(prefix: string, props: T, ...keys: Array<keyof T>): string => {
  const joinedStr = (keys.length === 0 ? objKeys(props) : keys)
    .map((key) => (props[key] ? (typeof props[key] === 'string' ? props[key] : key) : null))
    .filter(Boolean)
    .join(' ')

  return joinedStr ? `${prefix} ${joinedStr}` : prefix
}

export const camelToSnakeCase = (str: string) => str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)

export const regExAndTest = (data: string | number, ...regex: RegExp[]): boolean => {
  const str = typeof data === 'number' ? data.toString() : data

  for (const rx of regex) {
    if (!rx.test(str)) return false
  }

  return true
}

export const regExOrTest = (data: string | number, ...regex: RegExp[]): boolean => {
  const str = typeof data === 'number' ? data.toString() : data

  for (const rx of regex) {
    if (rx.test(str)) return true
  }

  return false
}

export const regExNorTest = (data: string | number, ...regex: RegExp[]): boolean => {
  const str = typeof data === 'number' ? data.toString() : data

  for (const rx of regex) {
    if (rx.test(str)) return false
  }

  return true
}
