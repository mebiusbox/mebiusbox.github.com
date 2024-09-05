---
title: Visual Studio Codeの新規ファイル作成を支援する拡張機能
description: Visual Studio Codeの拡張機能「Simple New File」の紹介
keywords:
  - Visual Studio Code
category: note
authors: [mebiusbox]
tags: [vscode]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual+Studio+Code%e3%81%ae%e6%96%b0%e8%a6%8f%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e4%bd%9c%e6%88%90%e3%82%92%e6%94%af%e6%8f%b4%e3%81%99%e3%82%8b%e6%8b%a1%e5%bc%b5%e6%a9%9f%e8%83%bd&subtitle=Visual+Studio+Code%e3%81%ae%e6%8b%a1%e5%bc%b5%e6%a9%9f%e8%83%bd%e3%80%8cSimple+New+File%e3%80%8d%e3%81%ae%e7%b4%b9%e4%bb%8b&date=2024%2F09%2F05&tags=vscode
---

Visual Studio Codeで新規にファイルを作成するときに便利な拡張機能「Simple New File」を紹介します．

<!-- truncate -->

Visual Studio Codeで新規にファイルを作成するときに、ファイルエクスプローラから作成するのが基本だと思います．
しかし、現在開いているフォルダに対して作成するのはいいのですが、それ以外の場所、とくにワークスペースのルートフォルダに作成するときにちょっとやりづらいかなと思っています．
そこで、以前は新規にファイルを作成するときに便利な拡張機能「[Simple New File](https://marketplace.visualstudio.com/items?itemName=fayras.simple-new-file)」を使っていました．この拡張機能は現在更新されておらず、Visual Studio Codeのバージョンアップによってまともに動作しなくなっていました．

しばらく使わずにいたのですが、あらためて新規ファイル作成まわりを調べてもこの拡張機能が便利だなと感じたので、[フォーク](https://github.com/mebiusbox/vscode-simple-new-file)して不具合を修正しました．
この拡張機能はファイル作成時にパスを入力することで、そのファイルを一発で作成できる機能があります．たとえば `/aaa/bbb/ccc/ddd.txt` と入力すれば、`aaa` や `bbb` フォルダを自動で作成してくれます．これを使うと、ワークスペースのルートフォルダに作成する場合、`/README.md`とすれば、すぐにルートフォルダに作成できます．
また、すでに存在すればそのファイルを開くこともできます．ただ、`Ctrl+P`でも開くことはできますので使いやすいほうを選べばいいと思います．

しばらく使ってみて問題なさそうならプルリクエストしてもいいかもしれません．

以上です．

---

以下の場所からリリースページのvsixファイルを使ってインストールできます．

- [mebiusbox/vscode-simple-new-file](https://github.com/mebiusbox/vscode-simple-new-file)
