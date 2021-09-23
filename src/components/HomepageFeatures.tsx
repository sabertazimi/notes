import clsx from 'clsx';
import React from 'react';
import MountainSVG from '../../static/img/undraw_docusaurus_mountain.svg';
import TreeSVG from '../../static/img/undraw_docusaurus_tree.svg';
import ReactSVG from '../../static/img/undraw_docusaurus_react.svg';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Powered by Markdown',
    Svg: MountainSVG,
    description: (
      <>
        Simply write notes with Markdown/MDX. Even embed JSX components into
        Markdown thanks to MDX.
      </>
    ),
  },
  {
    title: 'Built Using React',
    Svg: TreeSVG,
    description: (
      <>
        Extend or customize notes layout by reusing React. Notes can be extended
        while reusing the same header and footer.
      </>
    ),
  },
  {
    title: 'Today I Learned',
    Svg: ReactSVG,
    description: (
      <>
        All notes come from everyday I learned. Deploy to both Github Pages and
        GitBook IO.
      </>
    ),
  },
];

function Feature({ Svg, title, description }): JSX.Element {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
