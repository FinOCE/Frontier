import styles from '@styles/components/Stack.module.sass'
import { Post } from 'api/types/Post'
import { useEffect, useState } from 'react'
import Item from './Item'

type StackProps = {
  exclude?: string
}

export default function Stack(props: StackProps) {
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

  return (
    <div className={styles.stack}>
      {loading ? (
        <>
          <div className={styles.itemskeleton} />
          <div className={styles.itemskeleton} />
          <div className={styles.itemskeleton} />
        </>
      ) : (
        posts.filter(post => post.slug !== props.exclude).map(post => <Item {...post} />)
      )}
    </div>
  )
}