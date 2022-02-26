import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import { Post } from 'types/Post'

const Home: NextPage = () => {
  // Get articles
  let [posts, setPosts] = useState<Post[]>([])
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/posts`).then(res => res.json()).then((res: Post[]) => {
      setLoading(false)
      if (res) setPosts(res)
      else throw new Error()
    }).catch(err => {
      console.log(err)
      setLoading(false)
      setError(true)
    })
  }, [])

  // Render page
  return (
    <div>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>An error occurred when attempt to find posts</span>
      ) : (
        <div>
          {posts.map(post => (
            <>
              <a href={`/posts/${post.slug}`} key={post.id}>{post.title}</a>
              <br />
            </>
          ))}
          <code><pre>{JSON.stringify(posts, null, 4) ?? '{}'}</pre></code>
        </div>
      )}
    </div>
  )
}

export default Home
