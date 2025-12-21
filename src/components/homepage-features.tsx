import clsx from 'clsx'
import MountainSVG from '../../static/img/undraw_docusaurus_mountain.svg'
import ReactSVG from '../../static/img/undraw_docusaurus_react.svg'
import TreeSVG from '../../static/img/undraw_docusaurus_tree.svg'
import styles from './homepage-features.module.css'

type SVG = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

const FeatureList = [
  {
    title: 'Powered by Markdown',
    Svg: MountainSVG as unknown as SVG,
    description: (
      <>
        Simply write notes with Markdown/MDX. Even embed JSX components into
        Markdown thanks to MDX.
      </>
    ),
  },
  {
    title: 'Built Using React',
    Svg: TreeSVG as unknown as SVG,
    description: (
      <>
        Extend or customize notes layout by reusing React. Notes can be extended
        while reusing the same header and footer.
      </>
    ),
  },
  {
    title: 'Today I Learned',
    Svg: ReactSVG as unknown as SVG,
    description: (
      <>
        All notes come from everyday I learned. Deploy to both Github Pages and
        GitBook IO.
      </>
    ),
  },
]

function Feature({ Svg, title, description }: {
  Svg: SVG
  title: string
  description: React.ReactNode
}): React.JSX.Element {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.feature} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map(({ title, Svg, description }) => (
            <Feature key={title} title={title} Svg={Svg} description={description} />
          ))}
        </div>
      </div>
    </section>
  )
}
