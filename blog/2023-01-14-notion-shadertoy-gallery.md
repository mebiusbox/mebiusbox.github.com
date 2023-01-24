---
title: NotionでShadertoyやつぶやき系のツイートをギャラリーにまとめる
authors: [mebiusbox]
tags: [Notion, Shadertoy, つぶやきGLSL]
---

Notionのギャラリービューを使うと、ページをサムネイル一覧で確認できます．

![](..\static\img\post\2023-01-14-notion-shadertoy-gallery-230114021100.png)

とはいえ、サムネイルを用意しなければなりません．
ここではなるべく手間をかけずにサムネイルを作成する方法を紹介します．

まずは、データベースを作成します．`Link(URL)`と`Description(Text)`プロパティを作成．ギャラリービューにして、プレビューをカバー、サイズを小にします

![](..\static\img\post\2023-01-14-notion-shadertoy-gallery-230114030500.png)

Shadertoyやツイートへのリンクをデータベースに保存します．Save to NotionやWebブックマークにしてからデータベースに移動すると Description をいい感じに埋めてくれます．

ここから、リンク元によって処理が変わります．

## つぶやき系

Notionのページ上にツイートを埋め込みます．埋め込んだツイートの動画(画像)部分を右クリックして、「画像アドレスをコピー」します．次に、Notionのページ上部にある`Add Cover` がカバー画像を追加して、コピーしたアドレスを `Link` にペーストして送信します．

![](..\static\img\post\2023-01-14-notion-shadertoy-gallery-230114032100.png)

## Shadertoy

Shadertoyの画面に行きます．左上のレンダリングしている場所を右クリックして「画像をコピー」します．Notionのページにそのまま貼り付けます．

![](..\static\img\post\2023-01-14-notion-shadertoy-gallery-230114032500.png)

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
