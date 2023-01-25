import React from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, HatenaShareButton, HatenaIcon } from "react-share";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
export default function BlogPostItemFooter() {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {tags, title, editUrl, hasTruncateMarker} = metadata;
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
            <TwitterIcon size={shareConfig.size} round />
          </TwitterShareButton>
          <HatenaShareButton url={url} title={shareTitle} className={styles.shareButton}>
            <HatenaIcon size={shareConfig.size} round />
          </HatenaShareButton>
        </div>
      )}

      {tagsExists && (
        <div className={clsx('col', {'col--9': truncatedPost})}>
          <TagsListInline tags={tags} />
        </div>
      )}

      {isBlogPostPage && editUrl && (
        <div className="col margin-top--sm">
          <EditThisPage editUrl={editUrl} />
        </div>
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
