import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type Pillar = {
  step: string;
  name: string;
  role: string;
  description: ReactNode;
  href: string;
};

const PIPELINE: Pillar[] = [
  {
    step: '1',
    name: 'Tetra',
    role: 'Models the architecture',
    description: 'Zones, devices, networks, channels and flows, as plain YAML.',
    href: '/docs/tetra/',
  },
  {
    step: '2',
    name: 'Bowtie',
    role: 'Grounds the risk',
    description: 'Causes, controls and consequences, referencing the real architecture.',
    href: '/docs/bowtie/',
  },
  {
    step: '3',
    name: 'Metron',
    role: 'Proves compliance',
    description: 'Requirement packages assessed against the model, with a findings ledger.',
    href: '/docs/metron/',
  },
];

const FOUNDATION: Pillar = {
  step: '',
  name: 'Prism',
  role: 'Collects the asset data underneath',
  description:
    'Multi-source collection and normalisation, so the three pillars above stay current.',
  href: '/docs/prism/',
};

export default function Pillars(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          How the pieces connect
        </Heading>
        <p className={styles.sectionLead}>
          Sightline follows one pipeline: model the architecture, ground risk
          in it, then prove compliance against it.
        </p>

        <div className={styles.pipeline}>
          {PIPELINE.map((pillar, idx) => (
            <div className={styles.pillarWrap} key={pillar.name}>
              <Link to={pillar.href} className={styles.pillar}>
                <span className={styles.step}>{pillar.step}</span>
                <Heading as="h3" className={styles.pillarName}>
                  {pillar.name}
                </Heading>
                <p className={styles.pillarRole}>{pillar.role}</p>
                <p className={styles.pillarDescription}>{pillar.description}</p>
              </Link>
              {idx < PIPELINE.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className={styles.foundationWrap}>
          <span className={styles.foundationConnector} aria-hidden="true" />
          <Link to={FOUNDATION.href} className={styles.foundation}>
            <Heading as="h3" className={styles.pillarName}>
              {FOUNDATION.name}
            </Heading>
            <p className={styles.pillarRole}>{FOUNDATION.role}</p>
            <p className={styles.pillarDescription}>{FOUNDATION.description}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
