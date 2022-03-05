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
import { faCheck, faLink } from '@fortawesome/free-solid-svg-icons'
import Stack from '@components/article/Stack'
import copy from 'copy-to-clipboard'

const PostTemplate: NextPage = () => {
  // Get article from slug
  const slug = useTemplate('template')
  let [post, setPost] = useState<Post>()
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState(false)

  let [href, setHref] = useState<string>()

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then((res: Post) => {
      setLoading(false)
      if (res) {
        setPost(res)
        setHref(`${window.location.protocol}//${window.location.host}/posts/${res.slug}`)
      } else throw new Error()
    }).catch(err => {
      console.log(err)
      setLoading(false)
      setError(true)
    })
  }, [slug])

  let [copied, setCopied] = useState(false)

  function copyToClipboard() {
    copy(href ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

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
                <a onClick={copyToClipboard}>
                  <FontAwesomeIcon icon={!copied ? faLink : faCheck} />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${href}`} target="_blank">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${href}`} target="_blank">
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
