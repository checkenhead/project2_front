const SUCCESS = {
  OK: 20000,
  CREATED: 20100,
} as const

const CLIENT_ERROR = {
  BAD_REQUEST: 40000,
  UNAUTHORIZED: 40100,
  EXPIRED_TOKEN: 40101,
  INVALID_TOKEN: 40102,
  DEVICE_MISMATCH_TOKEN: 40103,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  REQUEST_CANCELED: 49999,
} as const

const SERVER_ERROR = {
  INTERNAL_SERVER_ERROR: 50000,
} as const

const UNKNOWN_ERROR = {
  UNKNOWN_ERROR: 99999,
} as const

export type ResponseCodeValueType =
  | (typeof SUCCESS)[keyof typeof SUCCESS]
  | (typeof CLIENT_ERROR)[keyof typeof CLIENT_ERROR]
  | (typeof SERVER_ERROR)[keyof typeof SERVER_ERROR]
  | (typeof UNKNOWN_ERROR)[keyof typeof UNKNOWN_ERROR]

export const RESPONSE_CODE = Object.assign(
  (code: ResponseCodeValueType) => {
    switch (Math.floor(code / 10000)) {
      case 2:
        return 'SUCCESS'
      case 4:
        return 'CLIENT_ERROR'
      case 5:
        return 'SERVER_ERROR'
      default:
        return 'UNKNOWN'
    }
  },
  SUCCESS,
  CLIENT_ERROR,
  SERVER_ERROR,
  UNKNOWN_ERROR
)
