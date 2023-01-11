import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Homepage from '@site/src/components/Homepage';
import CookieConsent from "react-cookie-consent"
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <Homepage />
        <CookieConsent>
        This website use cookies to recognize your repeat visits and preferences, as well as evaluate the effectiveness of the content. With your consent, you're helping us to make this content better.
        </CookieConsent>
      </main>
    </Layout>
  );
}
