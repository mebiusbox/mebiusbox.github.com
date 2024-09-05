---
title: Visual Studio Codeの新規ファイル作成を支援する拡張機能
description: Visual Studio Codeの拡張機能「Simple New File」の紹介
keywords:
  - Visual Studio Codee
category: note
authors: [mebiusbox]
tags: [vscode]
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
