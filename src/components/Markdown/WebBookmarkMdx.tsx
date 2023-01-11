// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocCard/index.tsx
import React, {type ReactNode} from 'react';
import isInternalUrl from '@docusaurus/isInternalUrl';
import CardLayout from './CardLayout';

interface WebBookmarkMbxProps {
  name: string;
  url: string;
  description: string;
}

export const WebBookmarkMdx = ({name, url, description}: WebBookmarkMbxProps) => {
  const icon = isInternalUrl(url) ? '📄️' : '🔗';
  return (
    <CardLayout
      href={url}
      icon={icon}
      title={name}
      description={description}
    />
  );
}
