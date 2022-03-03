import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'

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

  if (!context.bindingData.slug) {
    // Get all posts
    const { resources: items } = await container.items
      .query('SELECT * FROM c ORDER BY c.timestamp DESC')
      .fetchAll()

    context.res = {
      body: items
    }
  } else {
    // Get the ID of a specific post by the slug
    const { resources: items } = await container.items
      .query({
        query: `SELECT c.id FROM c WHERE c.slug = @slug`,
        parameters: [{ name: '@slug', value: context.bindingData.slug }]
      })
      .fetchAll()

    const id = items[0]?.id

    if (id) {
      // Update view count and return post data
      const post = await (
        await container.item(id, id).patch([
          {
            op: 'incr',
            path: '/views',
            value: 1
          }
        ])
      ).resource

      context.res = {
        body: post
      }
    } else {
      // Handle unknown slug
      context.res = {
        status: 404
      }
    }
  }
}

export default GetPosts
