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
  let icon;
  let awesomeicon = "";
  if (image === "") {
    if (isInternalUrl(url)) {
      icon = '📄️';
    } else if (url.startsWith('https://github.com')) {
      icon = '';
      awesomeicon = 'fab fa-github';
    } else {
      // icon = '🔗';
      icon = '';
      awesomeicon = 'fas fa-external-link-alt';
    }
  } else {
    icon = <img style={{width:"32px"}} src={image} />;
  }
  return (
    <CardLayout
      href={url}
      icon={icon}
      awesomeicon={awesomeicon}
      title={name}
      description={description}
    />
  );
}