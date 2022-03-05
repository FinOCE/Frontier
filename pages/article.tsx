import useTemplate from '@hooks/template'
import type { NextPage } from 'next'
import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import { Post } from 'api/types/Post'
import Page from '@components/Page'
import styles from '@styles/pages/article.module.sass'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import Stack from '@components/article/Stack'

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
      ) : error || !post ? (
        <span>Post not found</span>
      ) : (
        <Page>
          <div id={styles.wrapper}>
            <div id={styles.nav}>
              <a href="/">Return</a>
            </div>
            <article id={styles.article}>
              <h1>{post.title}</h1>
              <span>By {post.author}</span>
              <br />
              <span>Posted {moment.duration(moment().unix() / 1000 - post.timestamp).humanize(true)}</span>
              {' '}&middot;{' '}
              <span>{post.views} views</span>
              <div id={styles.socials}>
                {/* TODO: Add locations to anchor tags */}
                <a>
                  <FontAwesomeIcon icon={faLink} />
                </a>
                <a>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </div>
              <p>{post.content}</p>
            </article>
            <div id={styles.links}>
              <span id={styles.heading}>Recent Posts</span>
              <Stack exclude={post.slug} />
            </div>
          </div>
        </Page>
      )}
    </div>
  )
}

export default PostTemplate
