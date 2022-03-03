import useTemplate from '@hooks/template'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import { Post } from 'api/types/Post'

const PostTemplate: NextPage = () => {
  // Get article from slug
  const slug = useTemplate('template')
  let [post, setPost] = useState<Post>()
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then((res: Post) => {
      setLoading(false)
      if (res) setPost(res)
      else throw new Error()
    }).catch(err => {
      console.log(err)
      setLoading(false)
      setError(true)
    })
  }, [slug])

  // Render page
  return (
    <div>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>Post not found</span>
      ) : (
        <div>
          <a href="/">Return to home</a>
          <code><pre>{JSON.stringify(post, null, 4) ?? '{}'}</pre></code>
        </div>
      )}
    </div>
  )
}

export default PostTemplate
