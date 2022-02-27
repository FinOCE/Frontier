export type AccessTokenResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  scope: 'identify'
}

export type UserResponse = {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner: string
  banner_color: string
  accent_color: string
  locale: string
  mfa_enabled: boolean
  premium_type: number
}

export type MemberResponse = {
  roles: string[]
  nick: string | null
  avatar: string | null
  premium_since: string | null
  joined_at: string
  is_pending: boolean
  pending: boolean
  communications_disabled_until: string | null
  user: {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
  }
  mute: boolean
  deaf: boolean
}
