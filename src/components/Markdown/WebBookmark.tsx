// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocCard/index.tsx
import React, {type ReactNode} from 'react';
import isInternalUrl from '@docusaurus/isInternalUrl';
import CardLayout from './CardLayout';

interface WebBookmarkProps {
  name: string;
  url: string;
  description: string;
  image: string;
}

export default function WebBookmark({name, url, description, image=""}: WebBookmarkProps): JSX.Element {
  const icon = image === "" ? (isInternalUrl(url) ? '📄️' : '🔗') : <img style={{width:"32px"}} src={image} />;
  return (
    <CardLayout
      href={url}
      icon={icon}
      title={name}
      description={description}
    />
  );
}