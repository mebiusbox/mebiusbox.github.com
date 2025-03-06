import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import EditMetaRow from '@theme/EditMetaRow';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, XIcon, HatenaShareButton, HatenaIcon } from "react-share";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Giscus from '@site/src/components/GiscusComponent';
import styles from './styles.module.css';
export default function BlogPostItemFooter(): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {
    tags,
    title,
    editUrl,
    hasTruncateMarker,
    lastUpdatedBy,
    lastUpdatedAt,
  } = metadata;

  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;

  const tagsExists = tags.length > 0;

  const renderFooter = tagsExists || truncatedPost || editUrl;

  if (!renderFooter) {
    return null;
  }

  const {siteConfig} = useDocusaurusContext();
    const shareConfig = {
      size: 48
    }
    const url = `${siteConfig.url}${metadata.permalink}`
    const shareTitle = `${title} | Mebiusbox`
    const { disableComments } = metadata.frontMatter;
    const isBrowser = useIsBrowser();
    let isCurrentUrlBlog = false;
    if (isBrowser) {
      isCurrentUrlBlog = window.location.pathname === "/blog"
    }
    const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
    return (
      <footer
        className={clsx(
          'row docusaurus-mt-lg',
          isBlogPostPage && styles.blogPostFooterDetailsFull,
        )}>
        {isBlogPostPage && (
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
        )}
        {(!disableComments && !isCurrentUrlBlog && isBlogPostPage) && (
          <Giscus />
        )}
  
        {tagsExists && (
          <div className={clsx('col', {'col--9': truncatedPost})}>
            <TagsListInline tags={tags} />
          </div>
        )}
  
        {canDisplayEditMetaRow && (
          <EditMetaRow
            className={clsx(
              'margin-top--sm',
              ThemeClassNames.blog.blogFooterEditMetaRow,
            )}
            editUrl={editUrl}
            lastUpdatedAt={lastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}

        {truncatedPost && (
          <div
            className={clsx('col text--right', {
              'col--3': tagsExists,
            })}>
            <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
          </div>
        )}
      </footer>
    );
}
