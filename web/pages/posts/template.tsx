import useTemplate from '@hooks/template'
import type { NextPage } from 'next'

const PostTemplate: NextPage = () => {
  const slug = useTemplate()
  if (!slug) return <></>

  return (
    <div>
      Slug: {slug}
    </div>
  )
}

export default PostTemplate
