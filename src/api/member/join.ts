type MemberJoinParamsType = {
  username: string
  nickname: string
  password: string
  email: string
}
export const apiParamsMemberJoin = (data: MemberJoinParamsType) => {
  const { username, nickname, password, email } = data

  return {
    method: 'POST',
    url: '/member/join',
    anonymous: true,
    body: { username, nickname, password, email },
  } as const
}
