import useTemplate from '@hooks/template'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useCallback, useEffect, useState } from 'react'

const PostTemplate: NextPage = () => {
  const slug = useTemplate()
  if (!slug) return <></>

  let [post, setPost] = useState()

  const fetchData = useCallback(() => {
    fetch(`https://orange-grass-0fe38e810.1.azurestaticapps.net/api/posts/${slug}`, {
      method: 'GET'
    }).then(res => res.json()).then((res: any) => {
      setPost(res.data[0])
    }).catch(err => {
      console.log('An error occurred attempting to cetch the post')
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <code><pre>{JSON.stringify(post, null, 4)}</pre></code>
    </div>
  )
}

export default PostTemplate
