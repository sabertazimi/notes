import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Heading from '@theme/Heading'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import styles from './index.module.css'
import 'katex/dist/katex.css'

function Hero(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  return (
    <main className={clsx('hero', styles.banner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={clsx('button button--lg', styles.button)} to="/intro">
            Start to Read 🎉
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Today I Learned">
      <Hero />
    </Layout>
  )
}
