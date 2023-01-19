import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import SoftwareList from './software.yml';
import RecentList from './recent.yml';
import Link from '@docusaurus/Link';
import Admonition from '@theme/Admonition';
import WebBookmark from '@site/src/components/Markdown/WebBookmark';
import Highlight from '@site/src/components/Markdown/Highlight';
import isInternalUrl from '@docusaurus/isInternalUrl';

type SoftwareInfo = {
  name: string;
  version: string;
  url: string;
  description: string;
}

type BlogInfo = {
  name: string;
  date: Date;
  title: string;
}

function BlogItem({name, date, title}: BlogInfo) {
  const dateStr = name.slice(0,11).replaceAll("-", "/");
  const url = "/blog/" + dateStr + name.slice(11);
  return (
    <li>
      {date.toLocaleDateString()} : <Link to={url}> {title}</Link>
    </li>
  );
}

function Blog() {
  return (
    <div className='col col--6 margin-bottom--lg'>
      <h2 className={styles.head}>Blog</h2>
      <ul>
        {RecentList.map((props, idx) => (
          <BlogItem key={idx} {...props} />
        ))}
      </ul>
    </div>
  );
}

function Announce() {
  return (
    <div className='col col--6 margin-bottom--lg'>
      <h2 className={styles.head}>お知らせ</h2>
      <p>
      ここで公開している全てのソフトウェアはフリーソフトウェアです。
      </p>
      <Admonition type="caution">
      個人・法人でもご自由に使って頂いてかまいません（頒布も含む）。 ただし、当ソフトウェアを使って直接的に利益を生じる使い方は禁止です。
      </Admonition>
    </div>
  );
}

function SoftwareItem({name, version, url, description}: SoftwareInfo) {
  const newUrl = isInternalUrl(url) ? "/docs/software" + url : url;
  const image = `/img/${name}.ico`;
  return (
    <article className="col col--6">
      <WebBookmark name={name} url={newUrl} description={description} image={image} />
    </article>
  );
}

function Software() {
  return (
    <div className='col margin-bottom--lg'>
      <h2 className={styles.head}>ソフトウェア</h2>
      <div className='row'>
        {SoftwareList.map((props, idx) => (
          <SoftwareItem key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}

function Support() {
  return (
    <div className={clsx('col col--6 margin-bottom--lg')}>
      <h2 className={styles.head}>サポート</h2>
      <p>
        <Highlight>mebiusbox[at]gmail[dot]com</Highlight>までご連絡ください。
      </p>
    </div>
  );
}

function Donation() {
  return (
    <div className={clsx('col col--6 margin-bottom--lg')}>
      <h2 className={styles.head}>寄付</h2>
      <p>
      新規開発やサポート継続などのため、ご協力をお願い致します。
      </p>
      <p>
        Amazon ギフト券の場合、
        <Highlight>mebiusbox[at]gmail[dot]com</Highlight>
        にお願いします。
      </p>
    </div>
  );
}

export default function Homepage(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Blog />
          <Announce />
          <Software />
          <Support />
          <Donation />
        </div>
      </div>
    </section>
  );
}
