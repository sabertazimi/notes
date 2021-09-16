import clsx from 'clsx';
import React from 'react';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Powered by Markdown',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Simply write notes with Markdown/MDX. Even embed JSX components into
        Markdown thanks to MDX.
      </>
    ),
  },
  {
    title: 'Built Using React',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Extend or customize notes layout by reusing React. Notes can be extended
        while reusing the same header and footer.
      </>
    ),
  },
  {
    title: 'Today I Learned',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
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
