---
title: ちょっとしたMarkdown編集用の拡張機能を作りました
description: ショートカットをムダに増やさないために
keywords:
  - Visual Studio Code
category: note
authors: [mebiusbox]
tags: [vscode,markdown]
image: https://og-image-mebiusbox.vercel.app/api/og?title=%e3%81%a1%e3%82%87%e3%81%a3%e3%81%a8%e3%81%97%e3%81%9fMarkdown%e7%b7%a8%e9%9b%86%e7%94%a8%e3%81%ae%e6%8b%a1%e5%bc%b5%e6%a9%9f%e8%83%bd%e3%82%92%e4%bd%9c%e3%82%8a%e3%81%be%e3%81%97%e3%81%9f&subtitle=%e3%82%b7%e3%83%a7%e3%83%bc%e3%83%88%e3%82%ab%e3%83%83%e3%83%88%e3%82%92%e3%83%a0%e3%83%80%e3%81%ab%e5%a2%97%e3%82%84%e3%81%95%e3%81%aa%e3%81%84%e3%81%9f%e3%82%81%e3%81%ab&date=2025%2F03%2F21&tags=vscode,markdown
---

Markdown編集用にちょっと欲しかった機能があったので拡張機能を作りました．

<!-- truncate -->

import VideoPlayer from '@site/src/components/Markdown/VideoPlayer.tsx'

Markdownを編集するときに太字などにショートカットが使えると便利です．しかし、たとえば太字は `Ctrl+B` とか、斜体は `Ctrl+I` など、他に割り当てている機能とかぶることが多いです．そこで、1つのショートカットキーで「斜体」→「太字」→「斜体＋太字」→「取り消し線」→「なし」と切り替える機能が欲しくなりました．ざっくり調べたところ、とくにそういう機能がなかったので自作することにしました．といっても、1から作るよりかは既存のものを改良すると楽なので、今回もそのように作りました．

今回の拡張機能は「[toggleQuotes](https://marketplace.visualstudio.com/items?itemName=BriteSnow.vscode-toggle-quotes)」にインスパイアされました．また、ソースコードも参考にしています．

## 実装

実装してみたんですがいくつか問題、というか不便な部分が残っています．改良できるといいのですが、とりあえず様子見で．
まず、あらかじめクォーテーションで囲んである必要があります．これは、Visual Studio Code で `editor.autoSurround` を `quotes` に設定することで選択した文字を簡単に囲むことができます．その状態で作成したコマンドを呼び出すショートカットキーを入力すれば切り替わります．

今回の実装では、太字や斜体から逆に取り消したいことがあったので、最後に「なし」に設定しているのですが、「なし」の状態からまた「斜体」などに繰り返すことができません．ちょっと難しそうだったのであきらめました．

この機能を使うと次のようになります．

<VideoPlayer url='/img/post/2025/vscode-toggle-markers-mute.mp4' />

以上です．
