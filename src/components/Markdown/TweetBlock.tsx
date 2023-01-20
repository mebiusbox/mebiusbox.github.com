import React from 'react';
import { TwitterTweetEmbed } from "react-twitter-embed";

interface TweetBlockProps {
  id: string;
  url: string;
}

export default function TweetBlock({id="", url=""}: TweetBlockProps): JSX.Element {
  let validId = id;
  if (!validId) {
    const res = url.match(/.*?([0-9]+)$/);
    if (res) {
      validId = res[1];
    }
  }
  return (
    <>
      {validId.length > 0 && <TwitterTweetEmbed tweetId={validId} />}
    </>
  )
}