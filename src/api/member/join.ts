type MemberJoinParamsType = {
  username: string
  password: string
}
export const apiParamsMemberJoin = (data: MemberJoinParamsType) => {
  const { username, password } = data

  return {
    method: 'POST',
    url: '/member/join',
    anonymous: true,
    body: { username, password },
  } as const
}
