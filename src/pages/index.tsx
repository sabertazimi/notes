import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { NotesMarquee } from '@site/src/components/notes-marquee'
import { LineShadowText } from '@site/src/components/ui/line-shadow-text'
import { RainbowButton } from '@site/src/components/ui/rainbow-button'
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
          Awesome
          <LineShadowText className="italic ml-2">Notes</LineShadowText>
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="flex items-center justify-center">
          <Link to="/intro">
            <RainbowButton size="lg">Start to Read 🎉</RainbowButton>
          </Link>
        </div>
        <NotesMarquee />
      </div>
    </main>
  )
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Today I Learned"
      description="Awesome Notes is a personal TIL (Today I Learned) documentation website built with Docusaurus. It serves as a comprehensive knowledge repository covering AI, CS, web, programming, and more."
    >
      <Hero />
    </Layout>
  )
}
