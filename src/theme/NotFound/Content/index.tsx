import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/NotFound/Content';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

export default function NotFoundContent({className}: Props): ReactNode {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              Page Not Found
            </Translate>
          </Heading>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page">
              We could not find what you were looking for.
            </Translate>
          </p>
          <p>
            <Translate
                id="mebiusbox.NotFound.p2"
                description="The 2nd paragraph of the 404 page">
                もしかして、以下のページをお探しですか？
            </Translate>
            <ul>
                <li><Link to="https://mebiusbox.github.io/contents/EffectTextureMaker">EffectTextureMaker</Link></li>
                <li><Link to="/blog/2017/01/06/EffectTextureMaker">[Blog] EffectTextureMaker というのを作りました</Link></li>
            </ul>
          </p>
        </div>
      </div>
    </main>
  );
}
