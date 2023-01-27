import React from 'react';
import Giscus from "@giscus/react"
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div className="margin-top--lg margin-bottom--sm">
      <Giscus
        repo="mebiusbox/mebiusbox.github.com"
        repoId="MDEwOlJlcG9zaXRvcnk2MDQ0OTA3Ng=="
        category="Announcements"
        categoryId="DIC_kwDOA5phNM4CT08m"
        mapping="url"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={colorMode}
        lang="ja"
        loading="lazy"
        crossorigin="anonymous"
        async
      />
    </div>
  );
}



