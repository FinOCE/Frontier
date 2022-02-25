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
    const querySpec = {
      query: 'SELECT * FROM c'
    }

    const { resources: items } = await container.items.query(querySpec).fetchAll()

    context.res = {
      body: items
    }
  } else {
    const slug = String(context.bindingData.slug).replace(/[^a-z\d\-]/gi, '')
    const querySpec = {
      query: `SELECT * FROM c WHERE c.slug = '${slug}'`
    }

    const { resources: items } = await container.items.query(querySpec).fetchAll()

    context.res = {
      body: items
    }
  }
}

export default GetPosts
