import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'
import fetch from 'node-fetch'
import { AccessTokenResponse, MemberResponse } from 'types/Discord'
import * as jwt from 'jsonwebtoken'
import { User } from 'types/Database'

const GetPosts: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { endpoint, key, databaseId, containerId } = {
    endpoint: 'https://frontier-db.documents.azure.com:443/',
    key: process.env.DB_KEY,
    databaseId: 'frontier',
    containerId: 'items'
  }

  const client = new CosmosClient({ endpoint, key })
  const database = client.database(databaseId)
  const container = database.container(containerId)

  // Generate Discord token
  let token: AccessTokenResponse | null = null
  if (req.query.code) {
    token = await (
      await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: '947424007249076264',
          client_secret: process.env.DISCORD_SECRET as string,
          grant_type: 'authorization_code',
          redirect_uri: req.url.split('?')[0],
          code: req.query.code as string,
          scope: 'identify guilds.members.read'
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    ).json()
  } else if (req.headers.cookie) {
    const apiToken = req.headers.cookie.split('jwt=')[1].split(';')[0]

    try {
      const { id } = jwt.verify(apiToken, process.env.JWT_SECRET!) as { id: string }
      const { resource: user } = await container.item(id, id).read<User>()

      if (!user) throw new Error()

      token = await (
        await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: '947424007249076264',
            client_secret: process.env.DISCORD_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: user.refresh_token
          }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      ).json()
    } catch (err) {
      token = null
    }
  }

  // Login user through Discord OAuth code
  if (token) {
    const member: MemberResponse = await (
      await fetch('https://discord.com/api/users/@me/guilds/931057221280862248/member', {
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      })
    ).json()

    if (!member.user) {
      context.res = {
        status: 400
      }

      return
    }

    // Create or access the user in the database
    const user: Omit<User, 'refresh_token'> = {
      type: 'user',
      id: member.user.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      avatar: member.user.avatar,
      is_writer: member.roles.includes('931072895235551252')
    }

    // Upsert user to database
    await container.items.upsert(
      Object.assign(user, {
        refresh_token: token.refresh_token
      })
    )

    // Create cookie for user
    const apiToken = jwt.sign(user!, process.env.JWT_SECRET!, { expiresIn: '7d' })
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()
    const domain = req.url.replace(/(http\:\/\/)|(https\:\/\/)|(\:\d{1,5})|(\/(\w|\W)+)|(\/)/g, '')

    // Redirect user to app with new cookie
    context.res = {
      status: 307,
      headers: {
        location: req.url.split('?')[0].substring(0, req.url.split('?')[0].length - 10),
        'Set-Cookie': `jwt=${apiToken}; Expires=${expiry}; Domain=${domain}; Path=/; Secure; HttpOnly`
      }
    }
  } else {
    // Redirect to Discord OAuth if no code or cookie is available
    context.res = {
      status: 307,
      headers: {
        location: `https://discord.com/api/oauth2/authorize?client_id=947424007249076264&redirect_uri=${req.url}&response_type=code&scope=identify%20guilds.members.read`
      }
    }
  }
}

export default GetPosts
