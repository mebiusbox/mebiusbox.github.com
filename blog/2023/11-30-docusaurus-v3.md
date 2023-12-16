---
title: Docusaurus v3 にアップグレードしました
description: このサイトに使っているDocusaurusをv2からv3にアップグレードしました
keywords:
  - Docusaurus
category: note
authors: [mebiusbox]
tags: [Docusaurus]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Docusaurus%20v3%20%E3%81%AB%E3%82%A2%E3%83%83%E3%83%97%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%89%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F&subtitle=%E3%81%93%E3%81%AE%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AB%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8BDocusaurus%E3%82%92v2%E3%81%8B%E3%82%89v3%E3%81%AB%E3%82%A2%E3%83%83%E3%83%97%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%89%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F&date=2023%2F11%2F30&tags=Docusaurus
---

このサイトを生成するのに使っている [Docusaurus](https://docusaurus.io/) を [v2](https://docusaurus.io/blog/2022/08/01/announcing-docusaurus-2.0) から [v3](https://docusaurus.io/blog/releases/3.0) にアップグレードしました．

<!-- truncate -->

## 動機

単純に最新にしたかっただけです．古いままだとやはりメンテしづらいですから．
あまり独自でいじってしまうとアップグレードしづらくなって、結局面倒なことになりかねないので、なるべく用意されている機能で拡張していくのがいいですね．私もプラグインを自作して使っていますが、大したことはしていないですし、補助的なものです．


## アップグレード時の問題

[MDX](https://mdxjs.com/) のバージョンが上がって v1 から一気に v3 に上がったみたいです．Markdown ファイルの制限が厳しくなり、より厳密なチェックがされるようになりました．特に影響の大きかったのは[数式処理の部分をCSRにしているところ](/blog/2023/01/15/docusaurus-katex-client-side-rendering)で、`{}`がJavaScriptとして認識されてしまい、数式内のコマンドがエラーになってしまいました．これに関してはエスケープをすることで対応しましたが、数式すべてで`{}`をエスケープするのは置換で対応できるとはいえ面倒なので、普通に`remark-math`、`rehype-katex`プラグインを使うのが一番だと思います．この処理をしたのは数式が多いとDocusaurusのビルド時間が増えることやバンドル時の容量も増えてしまうためでした．これに関しては何らかの方法でHTMLにしたものを静的コンテンツとして扱うのがいいかなと思います．

あとは、カード形式のリンクを作成するために `react-link-card` を使っていたのですが、これがエラーを出すようになりました．また、このプラグインはメンテもされていないため、使わないことにしました．

もう1つ、最新のブログ投稿をトップページに表示するところで、デプロイするとエラーが表示されるものがありました．これは開発環境では発生しません．エラーは [React 18 による hydration エラー](https://docusaurus.io/blog/releases/3.0#debug-builds)で結局原因はよくわからなかったのですが、[問題箇所は特定できたので対応](https://github.com/mebiusbox/mebiusbox.github.com/commit/b01ed25abf87a41ac40c810648be1d1a7642e713)しました．

他は特に苦労したところはありません．Node を v18 に、React も v18、TypeScript を v5 にしたことや、コンフィグファイルでESMの文法に変更したことぐらいです．


## 静的コンテンツの扱い

これは Docusaurus v3 でのお話ではありませんが、 デフォルトだと `static` フォルダに入っているものはビルド時にコピーされます．多言語（私は`ja`と`en`）をサポートしていると、その言語ごとに静的コンテンツがコピーされることを今更ながら知りました．ちょっと静的コンテンツに入れているものが大きかったのでビルドやデプロイに時間が余計に時間がかかってました．とりあえず、`static`から別のフォルダに移動してビルド時にコピーするようにして対応しました．


以上です．
