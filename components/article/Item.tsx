import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/components/Stack.module.sass'
import { Post } from 'api/types/Post'
import moment from 'moment'
import { useEffect, useState } from 'react'

export default function Item(props: Post) {
  let [href, setHref] = useState<string>()

  useEffect(() => {
    setHref(`${window.location.protocol}//${window.location.host}/posts/${props.slug}`)
  }, [props.slug])

  return (
    <a href={href}>
      <article className={styles.item}>
        <span>{props.title}</span>
        <br />
        <span>
          Posted {moment.duration(moment().unix() / 1000 - props.timestamp).humanize(true)}
          {' '}&middot;{' '}
          <FontAwesomeIcon icon={faEye} /> {props.views}
        </span>
      </article>
    </a>
  )
}