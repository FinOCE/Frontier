import useTemplate from '@hooks/template'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import { Post } from 'types/Post'

const PostTemplate: NextPage = () => {
  // Get article from slug
  const slug = useTemplate('template')
  let [post, setPost] = useState<Post>()
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then((res: Post[]) => {
      setLoading(false)
      if (res?.[0]) setPost(res[0])
      else throw new Error()
    }).catch(err => {
      console.log('An error occurred attempting to fetch the post')
      console.error(err)
    })
  }, [])

  // Render page
  return (
    <div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <code><pre>{JSON.stringify(post, null, 4) ?? '{}'}</pre></code>
      )}
    </div>
  )
}

export default PostTemplate
