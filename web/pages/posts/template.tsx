import useTemplate from '@hooks/template'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useCallback, useEffect, useState } from 'react'

const PostTemplate: NextPage = () => {
  const slug = useTemplate()
  if (!slug) return <></>

  let [post, setPost] = useState()

  const fetchData = useCallback(() => {
    fetch(`/api/posts/${slug}`, {
      method: 'GET'
    }).then(res => res.json()).then((res: any) => {
      setPost(res.data[0])
    }).catch(err => {
      console.log('An error occurred attempting to fetch the post')
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <code><pre>{JSON.stringify(post, null, 4) ?? 'Nothing to display'}</pre></code>
    </div>
  )
}

export default PostTemplate
