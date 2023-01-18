import * as React from 'react';
import ReactPlayer from "react-player";
import styles from './styles.module.scss';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({url}: VideoPlayerProps): JSX.Element {
  return (
    <div className={styles.videoWrapper}>
      <ReactPlayer
        className={styles.videoPlayer}
        url={url}
        width='100%'
        height='100%'
        controls={true}
      />
    </div>
  )
};
