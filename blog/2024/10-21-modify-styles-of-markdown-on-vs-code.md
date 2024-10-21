---
title: Visual Studio CodeでJupyter NotebookのMarkdownセルのスタイルを変更する
description: Visual Studio CodeでJupyter NotebookのMarkdownセルのスタイルを変更する方法について解説
keywords:
  - Visual Studio Code
  - VS Code
  - Jupyter Notebook
  - StyleSheet
category: note
authors: [mebiusbox]
tags: [vscode,jupyter]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual+Studio+Code%e3%81%a7Jupyter+Notebook%e3%81%aeMarkdown%e3%82%bb%e3%83%ab%e3%81%ae%e3%82%b9%e3%82%bf%e3%82%a4%e3%83%ab%e3%82%92%e5%a4%89%e6%9b%b4%e3%81%99%e3%82%8b&subtitle=Visual+Studio+Code%e3%81%a7Jupyter+Notebook%e3%81%aeMarkdown%e3%82%bb%e3%83%ab%e3%81%ae%e3%82%b9%e3%82%bf%e3%82%a4%e3%83%ab%e3%82%92%e5%a4%89%e6%9b%b4%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6%e8%a7%a3%e8%aa%ac&date=2024%2F10%2F21&tags=vscode,jupyter
---

Visual Studio CodeでJupyter NotebookのMarkdownセルの見た目を変更する方法に関する備忘録です．

<!-- truncate -->

Jupyter Notebookサーバーを使ってNotebookを編集するのではなく、Visual Studio Codeで編集できるとエディタの機能が使えてとても便利です．
しかし、Markdownセルの見た目が標準のままだとわかりづらいので、カスタマイズしたいです．
そのためにはテーマや拡張機能「[Apc Customize UI++](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension)」を使う方法があります．
とくにApc Customize UI++拡張機能がお手軽で楽なのですが、影響範囲が広く、またVisual Studio Codeのバージョンによって動作が不安定になります．
Visual Studio CodeのUIをカスタマイズする拡張機能には他にも「[Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension)」があります．私はこれを利用しているのですが、Notebookのカスタマイズに
は手が届きませんでした．

何とかしてスタイルシートによる調整をしたかったので調査しました．

:::warning
この内容と同じことをする場合は自己責任でお願いします．また、バックアップは事前にしておいたほうがいいでしょう．
:::

Developerツールを使ってJupyter Notebookのプレビュー画面を調べてみると、Markdownセルを表示しているタグの直前にいくつかのスタイルシートが定義されたり読み込まれていることがわかりました．これはビルトイン拡張機能 Markdown Language Features, Markdown Math によって行われているようです．
これらの拡張機能は `C:\Users\<user>\AppData\Local\Program\Microsoft VS Code\resources\app\extensions` にあります．
それらの拡張機能に含まれている `notebook-out` に含まれているファイルが処理されているようです．
Markdown Language Featuresはデフォルトのスタイルを、Markdown MathはKaTeXのスタイルを管理しているようです．

ということで、デフォルトのスタイル部分を直接いじることで強引に見た目をカスタマイズします．
具体的には `markdown-language-features\notebook-out\index.js` ファイルを編集します．
ファイルを開くと、ファイル後ろにスタイルの定義がありますので、書き換えます．
あとは、Visual Studio Codeを再起動すれば反映されます．

変更前：

![カスタマイズ前](/img/post/2024/10-21-modify-styles-of-markdown-on-vs-code-before.jpg)

変更後：

![カスタマイズ後](/img/post/2024/10-21-modify-styles-of-markdown-on-vs-code-after.jpg)

ビルトイン拡張機能を直接書き換えているのでよろしくない方法ではありますが、現状だとこれがお手軽だと思います．
他に良い方法があれば教えていただけると助かります．

以上です．
