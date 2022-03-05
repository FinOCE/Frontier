import useUser from '@hooks/user'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import { Post } from 'api/types/Post'

const Home: NextPage = () => {
  // Get user
  let [user, jwt] = useUser()
  const animatedAvatar = user?.avatar?.startsWith('a_') ?? false

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
      <h1>Authentication</h1>
      {!user ? (
        <a href="/api/login">Login</a>
      ) : (
        <>
          <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${animatedAvatar ? 'gif' : 'png'}`} />
          <br />
          Welcome {user.username}#{user.discriminator} ({user.id})
          <br />
          You <b>{user.is_writer ? 'ARE' : 'ARE NOT'}</b> a writer
          <br />
          <a href="/api/logout">Logout</a>
        </>
      )}
      <h1>Posts</h1>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>An error occurred when attempt to find posts</span>
      ) : (
        <div>
          {posts.map(post => (
            <>
              <a href={`/posts/${post.slug}`} key={post.id}>{post.title}</a>
              <br /><br />
            </>
          ))}
          {/* <code><pre>{JSON.stringify(posts, null, 4) ?? '{}'}</pre></code> */}
        </div>
      )}
    </div>
  )
}

export default Home
