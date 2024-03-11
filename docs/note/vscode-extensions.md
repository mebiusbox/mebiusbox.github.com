---
title: Visual Studio Codeの拡張機能
description: 私が使っているVisual Studio Codeの拡張機能について
keywords:
  - VSCode
  - Visual Studio Code
pagination_next: null
pagination_prev: null
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual%20Studio%20Code%E3%81%AE%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD&subtitle=Visual%2520Studio%2520Code%25E3%2581%25AE%25E6%258B%25A1%25E5%25BC%25B5%25E6%25A9%259F%25E8%2583%25BD&date=2023%2F12%2F17&tags=VSCode
last_update:
  date: 2024-03-11
  author: mebiusbox
---

ここでは私が使用しているVisual Studio Code (VSCode)の拡張機能についてまとめました．
これは、備忘録も兼ねていて試したものの利用していない拡張機能についてもメモ程度に記録しています．
言語や言語サーバーの拡張機能については割愛．


## Code Runner

- [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

ファイルの中にプログラムを埋め込んで、それを実行するときに利用しています．


## Code Spell Checker

- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

スペルチェッカ．


## Custom CSS and JS Loader

- [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)

VSCode本体のフォントを変更するために使用．


## EditorConfig for VSCode

- [EditorConfig for VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

`.editorconfig` を有効にするための拡張機能．


## Error Lens

- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

エラーや警告をエディタ内に表示する拡張機能．警告やエラーをしっかり対応しないと画面がひどいことになる．


## Fix JSON

- [Fix JSON](https://marketplace.visualstudio.com/items?itemName=oliversturm.fix-json)

jsonicという構文を使ってJSONを書ける拡張機能．慣れると便利．


## Font Switcher

- [Font Switcher](https://marketplace.visualstudio.com/items?itemName=evan-buss.font-switcher)

フォントを素早く切り替えられる．プログラム用のフォントと文章を書く時のフォントを切り替えるときに利用．


## GistPad

- [GistPad](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.gistfs)

GitHub の Gist を管理できる拡張機能．


## GitGraph

- [GitGraph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

Gitグラフツリーを確認できる拡張機能．


## GitLens

- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

エディタ内で履歴を確認できる拡張機能．


## indent-rainbow

- [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow)

インデントのネストを色でわかりやすくする拡張機能．


## Jupyter

- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

Jupyter Notebook を扱える拡張機能．


## LaTeX Workshop

- [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)

LaTeX 文章を書くのに便利な拡張機能．これと TeXLive で快適な TeX執筆環境を構築できる．


## Markdown Preview Enhanced

- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)

Markdownプレビュー．数式やMermaidなどサポートしている．また、PDFなどの出力も対応している．
特に重要なのは CSS (less) でカスタマイズすることが簡単なこと．

これ以外だと Microsoft の [Learn Preview](https://marketplace.visualstudio.com/items?itemName=docsmsft.docs-preview) があります．これは GitHub のシンタックスに似ていることもあって特にテーマをいじらないのであればこれがいいかも．

標準のMarkdownプレビューは、CSS によるカスタマイズがしづらい．Markdownファイルからの相対パスかWebからのリンクにしか対応していない．検索すると絶対パスでも出来るということが書かれているが、現在では出来ない．


## Markdown Table

- [Markdown Table](https://marketplace.visualstudio.com/items?itemName=TakumiI.markdowntable)

Markdownでの表を書くときに便利な拡張機能．項目を作成してからの表生成や、各セルの移動などがサポートされている．


## Markmap

- [Markmap](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode)

Markdownで書いたものをマインドマップのように表示してくれる拡張機能．情報や頭の中を整理するときに便利．


## Marp for VS Code

- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)

Marp を使ってスライドを作成する拡張機能．スライドに数式があるなら、かなり楽に作成できる．


## Notes

- [Notes](https://marketplace.visualstudio.com/items?itemName=dionmunk.vscode-notes)

VSCodeで手軽にメモ管理．
他に [VSNotes](https://marketplace.visualstudio.com/items?itemName=patricklee.vsnotes) がありますが、こちらはVSCodeでメモの削除ができないため見送り．また、タグも不要だったので．


## Numbered Bookmarks

- [Numbered Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.numbered-bookmarks)

番号のついたブックマーク機能．ブックマーク拡張機能は [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks) がありますが、こちらは何故か上手く機能しなかったので、代わりに Numbered Bookmarks を利用しています．


## Paste Image

- [Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image)

Markdownで画像を挿入するときに利用している拡張機能．挿入するときの設定が細かく出来るので利用．


## PlantUML

- [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)

UMLを描画するための拡張機能．


## Rainbow CSV

- [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

CSVの列に色をつけてくれる拡張機能．


## REST Client

- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

VSCodeから手軽にHTTPリクエストをテストできる拡張機能．


## Shortcut Menu Bar

- [Shortcut Menu Bar](https://marketplace.visualstudio.com/items?itemName=jerrygoyal.shortcut-menu-bar)

エディタの右上にカスタムボタンを表示する拡張機能．あらかじめ用意されたボタンと、カスタムボタンを最大10個表示できる．
アイコンをいじれないなどの不満はあるものの、ショートカットに追加するほどでもない機能を入れてます．


## Simple New File

- [Simple New File](https://marketplace.visualstudio.com/items?itemName=fayras.simple-new-file)

ワークスペース内でファイルを作成したり開くときに便利な拡張機能．自動でフォルダを作成してくれる．
似たような拡張機能は多いですが、これが一番シンプルで使いやすい．


## Sort JSON objects

- [Sort JSON objects](https://marketplace.visualstudio.com/items?itemName=richie5um2.vscode-sort-json)

JSONオブジェクトのキーを整列する拡張機能．


## Subtitles Editor

- [Subtitles Editor](https://marketplace.visualstudio.com/items?itemName=pepri.subtitles-editor)

字幕編集の拡張機能．SRT形式の編集や翻訳の機能があって便利．


## Table Formatter

- [Table Formatter](https://marketplace.visualstudio.com/items?itemName=shuworks.vscode-table-formatter)

Markdownの表を整形してくれる拡張機能．


## TODO Highlight

- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)

TODO や FIXME などをハイライト表示してくれる拡張機能．カスタマイズもできる．


## vscode-pixy-outline

関数や目印(MARKS)をアウトラインに表示する拡張機能．自作です．
詳しくは [自分用にVSCodeのアウトライン拡張を作ってみました](https://mebiusbox.github.io/blog/2023/12/13/vscode-pixy-outline) を参照してください．


## Whitespace++

- [Whitespace++](https://marketplace.visualstudio.com/items?itemName=chihiro718.whitespacepp)

全角の空白をわかりやすくするための拡張機能．

## Control Snippets

- [Control Snippets](https://marketplace.visualstudio.com/items?itemName=svipas.control-snippets)

各スニペットの有効・無効を設定できる拡張機能です．ビルトインのスニペットや、特定の拡張機能のスニペットを個別に設定できます．
余計なスニペットを無効にしたいときに使います．

## Snippets Manager

- [Snippets Manager](https://marketplace.visualstudio.com/items?itemName=zjffun.snippetsmanager)

スニペット管理の拡張機能です．複数行のスニペットを作成する場合はこのような拡張機能を使ったほうが管理しやすいです．
スニペットの追加・削除・編集や、現在のスニペットの確認もわかりやすいです．

## その他

特に説明が不要なもの．

- C/C++
- CodeLLDB
- Deno
- Dev Container
- Docker
- ES7+ React/Redux/React-Native snippets
- ESLint
- Flake8
- Go
- Graphviz (dot) language support for Visual Studio Code
- Graphviz Preview
- isort
- Jupyter Notebook Renderers
- Prettier - Code formatter
- Pretteir ESLint
- Pylance
- Python
- Remote - SSH
- Remote Development
- Remote Explorer
- rust-analyzer
- Shader languages support for Visual Studio Code
- Tailwind CSS IntelliSense
- WSL
- YAML


## テーマ

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [Monokai Dark Soda](https://marketplace.visualstudio.com/items?itemName=AdamCaviness.theme-monokai-dark-soda)
