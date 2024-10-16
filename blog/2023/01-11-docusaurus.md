---
layout: post
title: リニューアル：Docusaurusへ移行
description: サイトリニューアルしました
keywords:
  - Docusaurus
  - MkDocs
  - mdBook
  - Notion
  - Jekyll
authors: [mebiusbox]
category: note
tags: [diary, docusaurus, MkDocs, mdBook, Notion, Jekyll]
image: https://og-image-mebiusbox.vercel.app/api/og?title=%E3%83%AA%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%AB%EF%BC%9ADocusaurus%E3%81%B8%E7%A7%BB%E8%A1%8C&subtitle=%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E3%83%AA%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%AB%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F&date=2023%2F01%2F11&tags=diary%2C%20docusaurus%2C%20MkDocs%2C%20mdBook%2C%20Notion%2C%20Jekyll
---

サイトをリニューアルしました．そして、数年振りのブログ更新です．
自分のサイトを持つ意味があまりなくなってきている感じはしますが、もはや学習も含めて新しいフレームワークを使ってみるテストになりつつあります．

<!-- truncate -->

import HL from '@site/src/components/Markdown/Highlight.tsx'

## Docusaurus

これまで、WordPressやMkDocs、Jekyllなどを使ってきました．今回は Meta(旧Facebook)製 [Docusaurus v2](https://docusaurus.io/) を使いました．

なぜ、Docusaurusにしたのか．

それはReactを使いたかったから．あとは、バージョン指定だったりAPIなどに対応したサイトも作れるということで試してみたかった．まだまだReactやらTypeScriptに慣れていないこともあって、Docusaurusを使う前にある程度学習したおかげか、ここまで作るのに4,5日程度でした．Jekyllで使っていたMarkdownは多少の調整は入ったものの、ほぼそのまま移行できているのであまり苦労はしなかったです．環境を構築できればかなり楽かなとは思います．まあ、それはどのフレームワークでも同じことが言えます．


## ReactとMDX

やはり目玉はこの2つ <HL>React</HL> と <HL>MDX</HL> です． [React](https://reactjs.org/) はUIフレームワーク、 [MDX](https://mdxjs.com/) はマークダウンの中に <HL>JSX</HL> を使用することができる機能です． JSXはJavaScriptの拡張構文で、JavaScript内にタグ構文をそのまま使用できます．今、 <HL>React</HL> や <HL>MDX</HL> という表示がありますが、まさにこれがReactコンポーネントです．ちなみに、 codeタグで囲むと、 `React`, `MDX` というようになります．このブログのソースファイルはマークダウン形式であり、Reactコンポーネントを使用できます．しかも簡単に．ただ、通常のマークダウンは MDX と互換がありますが、MDXは通常のマークダウンとは互換がありません．

Docusaurusで構築するときにReactコンポーネントを使って構築しなければならないかと言われればそうではないです．マークダウンファイルだけでも十分構築できます．今回のサイトではトップページのみ JSX で構築していますが、それ以外のものはすべてマークダウンを使っています．


## 静的サイトジェネレータとしての比較

個人的な所感に基づいて、以下のドキュメントサイトを生成するツールの使い分けみたいなのを書いておきます．

- [Docusaurus](https://docusaurus.io/)
- [MkDocs](https://www.mkdocs.org/)
- [mdBook](https://rust-lang.github.io/mdBook/)
- [Jekyll](http://jekyllrb-ja.github.io/)
- [Notion](https://www.notion.so/)


### 単にブログを書きたいなら

ブログサービスを使いましょう．静的サイトを使う理由がとくにないです．


### ブログをマークダウンで書きたいけど、githubで管理したい

<HL>Jekyll</HL>を使いましょう．GitHubが標準でサポートしています．お手軽ですし、こだわりたいならテンプレートを使ってレイアウトを自分で構築してカスタマイズできます．


### ドキュメントをマークダウンのみでWeb上に公開するなら

<HL>MkDocs</HL>を使いましょう．お手軽です． また、<HL>mdBook</HL>でも構いません． Nodeの環境があるなら MkDocs、Rust (cargo) の環境があるなら mdBook という感じでもいいです．どちらの環境もあってどうしようという場合は <HL>mdBook</HL> を使いましょう．


### 本のようなある程度まとまったドキュメントを公開するなら

もし、それがローカルではなくワールドに公開したいのであれば、 <HL>Zennのブック</HL>を使いましょう．
Zennのブックなら、無料で公開していてもサポートでお金が入ってくることがあります．また、有料にすることもできます．SEOも強いので、検索で見つけやすいです．<HL>Qiita</HL>ではできないですし、なによりQiitaは規約で公開した内容がQiita側にも帰属することになります．

ローカルの場合や、Zenn以外の方法だと <HL>mdBook</HL>を使いましょう．mdBookは機能が他よりも劣っているように見えるかもしれませんが、本として執筆する最低限の環境は整っています．むしろ、余計な機能（Webでのインタラクティブなものなど）があると、実際に印刷するときに困ることになります．mdBookの印刷はブラウザの機能を使うことになりますが、1つのPDFとして出力できます．PDFでも出力したいということであれば mdBook がいいでしょう．また、 mdBook は Rust のエコシステムの一部なので、メンテナンスがしっかりしていることもあります．


### Notion

<HL>Notion</HL>はマークダウンの文法をサポートしていて、かつさまざまなブロックを使うことができるツールです．お手軽に公開することもできて便利です．私もずっと使っています．ブロックはReactコンポーネントと考えることもできます．ブロックを開発することはできませんが、多くのブロックがあったり、埋め込みブロックでウィジットという形で追加することもできます．1人だったり多人数であってもドキュメントを構築するツールとして Notion はありかなと思っています．ただ、ブログとか記事をNotionで公開するのは限定的なので、どこからかリンクするかサイトとしてデプロイするといったことをやったほうがいいです．また、ReactコンポーネントとしてNotionを使うこともできますので、Notionで原稿を書いてReactで表示するといったことも可能だと思います．

---
- [NotionX/react-notion-x](https://github.com/NotionX/react-notion-x)


### えっ、じゃあ Docusaurusは？

正直なところ、あまりオススメはしないです．用途もあまり思いつきません．恐らく Docusaurusで作るなら Next で作った方がいいよね、ということになるとは思います．もしくはそれ以外で Gatsby とか．Reactの[公式サイト](https://reactjs.org/)は Gatsby ですし、新しいReactの[ドキュメントサイト](https://beta.reactjs.org/)も Next みたいです．Nextなどに精通しているなら、そちらを使った方がいいです．では、あまり詳しくない場合、Docusaurusはどうかという話になると思いますが、日本語の解説がかなり不足しているので、余計につらいかなと思います．公式ドキュメントはもちろんありますが、あまりわかりやすいものではないです．また、対応状況ももはや保守という感じも否めません．標準で採用しているCSSフレームワークの [Infima](https://infima.dev/) もまだ開発段階みたいですし．時間があるなら、Nextを覚えた方がいいのではと思ってしまいます．ただ、DocusaurusもReactに精通しているならアリかなとは思います．プラグインとか数は少ないように見えますが、それで十分とも言えなくもないです．あとはReactで構築してどうぞという感じ．もう少しいろいろいじったら、まとめて記事にするかもしれません．


## さいごに

<HL>Docusaurus</HL>はドキュメントをReactで構築するフレームワークだと思います．どこにどのファイルを置くのか、どういうルーティング処理がされるのか、プラグインはどう実装するのか、そういったことが決まっているものです．あとはそれをベースにカスタマイズしていってね、というものですね．とくに最初はナビゲーション当たりが手こずる感じです．わかると大分サクっと作れるようになるのですが、ただ、今でもまだ完全には把握できていないです．まだ、導入したばかりなので探っていきたいところですね．それでは．

