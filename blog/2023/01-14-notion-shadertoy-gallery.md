---
title: NotionでShadertoyやつぶやき系のツイートをギャラリーにまとめる
description: なるべく手間をかけずにサムネイルを作成する方法を紹介します
keywords:
  - Notion
  - Shadertoy
  - つぶやきGLSL
category: note
authors: [mebiusbox]
tags: [Notion,Shadertoy,つぶやきGLSL]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Notion%E3%81%A7Shadertoy%E3%82%84%E3%81%A4%E3%81%B6%E3%82%84%E3%81%8D%E7%B3%BB%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92%E3%82%AE%E3%83%A3%E3%83%A9%E3%83%AA%E3%83%BC%E3%81%AB%E3%81%BE%E3%81%A8%E3%82%81%E3%82%8B&subtitle=%E3%81%AA%E3%82%8B%E3%81%B9%E3%81%8F%E6%89%8B%E9%96%93%E3%82%92%E3%81%8B%E3%81%91%E3%81%9A%E3%81%AB%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95%E3%82%92%E7%B4%B9%E4%BB%8B%E3%81%97%E3%81%BE%E3%81%99&date=2023%2F01%2F14&tags=Notion%2CShadertoy%2C%E3%81%A4%E3%81%B6%E3%82%84%E3%81%8DGLSL
---

Notionのギャラリービューを使うと、ページをサムネイル一覧で確認できます．

![](/img/post/2023-01-14-notion-shadertoy-gallery-230114021100.png)

とはいえ、サムネイルを用意しなければなりません．
ここではなるべく手間をかけずにサムネイルを作成する方法を紹介します．

<!-- truncate -->

まずは、データベースを作成します．`Link(URL)`と`Description(Text)`プロパティを作成します．
そして、ギャラリービューにして、プレビューをカバー、サイズを小にします

![](/img/post/2023-01-14-notion-shadertoy-gallery-230114030500.png)

Shadertoyやツイートへのリンクをデータベースに保存します．[Save to Notion](https://chromewebstore.google.com/detail/save-to-notion/ldmmifpegigmeammaeckplhnjbbpccmm?hl=ja)やWebブックマークにしてからデータベースに移動すると Description をいい感じに埋めてくれます．

ここから、リンク元によって処理が変わります．

## つぶやき系

Notionのページ上にツイートを埋め込みます．埋め込んだツイートの動画(画像)部分を右クリックして、「画像アドレスをコピー」します．次に、Notionのページ上部にある`Add Cover` を選択してカバー画像を追加し、コピーしたアドレスを `Link` にペーストして送信します．

![](/img/post/2023-01-14-notion-shadertoy-gallery-230114032100.png)

## Shadertoy

Shadertoyの画面に行きます．左上のレンダリングしている場所を右クリックして「画像をコピー」します．Notionのページにそのまま貼り付けます．

![](/img/post/2023-01-14-notion-shadertoy-gallery-230114032500.png)

ちなみに、Shadertoyの場合はWebブックマークを作成するといい感じのサムネイルができます．


## GLSLSandbox

GLSLSandboxの場合は、StylusとDevToolsを使ってサムネイルを作成します．
まず、Stylusを使ってサムネイル用の画像サイズに調整します．

```css
canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    height: 200px;
    margin: auto;
}
```

そして、DevToolsでcanvasを選択した状態で、コマンドパレット(`Ctrl+Shift+P`)から`Run> Capture node screenshot`を選択するとサムネイルが保存されるので、それをページに貼り付けます．


## Save To Notion

[Save to Notion](https://chromewebstore.google.com/detail/save-to-notion/ldmmifpegigmeammaeckplhnjbbpccmm?hl=ja)を使うと、GLSLSandboxやShadertoyをもっと簡単に保存できます．

### Shadertoy

`Name`, `Cover`, `Description` を次のように設定します．タグは任意に設定してください．

![Save To Notion for Shadertoy](/img/post/2024-01-14-notion-shadertoy-gallery-240118-142658.png)

Save To Notion はコンテンツをCSSセレクタを使って指定することができます．
Shadertoyでは名前や詳細をCSSセレクタを使って取得する必要があります．

それぞれ、`Data on Webpage` を指定してピックします．

### GLSLSandbox

`Name`, `Content`, `Cover` を次のように設定します．タグは任意に設定してください．

![Save To Notion for GLSLSandbox](/img/post/2024-01-14-notion-shadertoy-gallery-240118-142315.png)


以上です．
