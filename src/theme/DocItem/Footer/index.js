import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/theme-common/internal';
import LastUpdated from '@theme/LastUpdated';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, XIcon, HatenaShareButton, HatenaIcon } from "react-share";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Giscus from '@site/src/components/GiscusComponent';
import styles from './styles.module.css';
function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        'row margin-bottom--sm',
      )}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}
function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, 'row')}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx('col', styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  );
}
export default function DocItemFooter() {
  const {metadata} = useDoc();
  const {title, editUrl, lastUpdatedAt, formattedLastUpdatedAt, lastUpdatedBy, tags} =
    metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  // const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;
  // if (!canDisplayFooter) {
  //   return null;
  // }
  const {siteConfig} = useDocusaurusContext();
  const shareConfig = {
    size: 48
  }
  const url = `${siteConfig.url}${metadata.permalink}`
  const shareTitle = `${title} | Mebiusbox`
  const { disableComments } = metadata.frontMatter;
  const isBrowser = useIsBrowser();
  let isCurrentUrlDocs = false;
  if (isBrowser) {
    isCurrentUrlDocs = window.location.pathname === "/docs"
  }
  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      <div className="text--center margin-bottom--sm">
        <FacebookShareButton url={url} className={styles.shareButton}>
          <FacebookIcon size={shareConfig.size} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={shareTitle} className={styles.shareButton}>
          <XIcon size={shareConfig.size} round />
        </TwitterShareButton>
        <HatenaShareButton url={url} title={shareTitle} className={styles.shareButton}>
          <HatenaIcon size={shareConfig.size} round />
        </HatenaShareButton>
      </div>
      {(!disableComments && !isCurrentUrlDocs) && (
        <Giscus />
      )}
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}
    </footer>
  );
}