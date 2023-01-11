import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';

interface LinkCardProps {
  name: string;
  image: string;
  url: string;
  description: string;
  label: string;
}

export default function LinkCard({name, image, url, description, label}: LinkCardProps): JSX.Element {
  return (
    <div className="col col--6 margin-bottom--lg">
      <div className={clsx('card')}>
        <div className={clsx('card__image')}>
          <Link to={url}>
            <Image img={image} alt={`${name}'s image`} />
          </Link>
        </div>
        <div className="card__body">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            <Link className="button button--secondary" to={url}>
              {label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}