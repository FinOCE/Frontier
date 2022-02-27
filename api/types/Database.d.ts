export type User = {
  type: 'user'
  id: string
  username: string
  discriminator: string
  avatar: string
  is_writer: boolean
  refresh_token: string
}
