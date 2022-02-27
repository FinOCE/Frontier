import { User } from 'api/types/Database'
import jar from 'js-cookie'

export default function useUser(): [Omit<User, 'refresh_token'> | null, string | null] {
  let user: Omit<User, 'refresh_token'> | null = null
  let jwt: string | null = null

  let token = jar.get('jwt')
  if (token) {
    try {
      user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'))
      jwt = token
    } catch (err) {}
  }

  return [user, jwt]
}
