import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const GetPosts: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.res = {
    body: 'Hello world'
  }
}

export default GetPosts
