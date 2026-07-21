import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Pillars from '@site/src/components/Pillars';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <span className={styles.heroRule} aria-hidden="true" />
        <p className={styles.heroLead}>
          Sightline binds architecture, risk and compliance into one
          workspace of linked models, so a change in one place is visible
          everywhere it matters.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">
            Read the knowledge base
          </Link>
          <Link className="button button--secondary button--lg" to="/blog">
            Read the whitepapers
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Sightline"
      description="Architecture, risk and compliance in one connected model.">
      <HomepageHeader />
      <main>
        <Pillars />
      </main>
    </Layout>
  );
}
