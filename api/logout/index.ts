import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'
import * as jwt from 'jsonwebtoken'

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

  // Remove user refresh token from database
  try {
    if (!req.headers.cookie) throw new Error()

    const apiToken = req.headers.cookie!.split('jwt=')[1].split(';')[0]
    const { id } = jwt.verify(apiToken, process.env.JWT_SECRET!) as { id: string }

    await container.item(id, id).patch([
      {
        op: 'remove',
        path: '/refresh_token'
      }
    ])
  } catch (e) {}

  // Remove cookie from user
  const domain = req.url.replace(/(http\:\/\/)|(https\:\/\/)|(\:\d{1,5})|(\/(\w|\W)+)|(\/)/g, '')

  // Redirect user to app with new cookie
  context.res = {
    status: 307,
    headers: {
      location: req.url.split('?')[0].substring(0, req.url.split('?')[0].length - 10),
      'Set-Cookie': `jwt=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=${domain}; Path=/; Secure`
    }
  }
}

export default GetPosts
