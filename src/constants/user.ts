export const USER_AUTHORITIES = {
  ADMIN: 'admin',
  USER: '1',
} as const

export const AUTHORITIES = {
  ...USER_AUTHORITIES,
  ANONYMOUS_ONLY: '@',
  ALL: '*',
} as const

export type UserAuthoritiesValueType = (typeof USER_AUTHORITIES)[keyof typeof USER_AUTHORITIES]
export type AuthoritiesValueType = (typeof AUTHORITIES)[keyof typeof AUTHORITIES]
