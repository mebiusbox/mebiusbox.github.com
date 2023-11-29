// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocCard/index.tsx
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.scss';

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx('card padding--md margin-bottom--sm', styles.cardContainer)}>
      {children}
    </Link>
  );
}

export default function CardLayout({
  href,
  icon,
  awesomeicon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  awesomeicon: string;
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <CardContainer href={href}>
      <span className={clsx('text--truncate', styles.cardTitle)} title={title}>
        <i className={clsx(styles.cardIcon, awesomeicon)}>{icon}</i> {title}
      </span>
      {description && (
        <span
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </span>
      )}
    </CardContainer>
  );
}
