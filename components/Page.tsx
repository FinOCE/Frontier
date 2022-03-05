import styles from '../styles/components/Page.module.sass'

type PageProps = {
  children?: JSX.Element | JSX.Element[]
}

export default function Page(props: PageProps) {
  return (
    <div id={styles.page}>{props.children}</div>
  )
}