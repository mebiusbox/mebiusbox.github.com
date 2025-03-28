---
title: Obsidianで複数のディレクトリを1つのVaultで管理する方法
description: （場所がばらばらな）複数のディレクトリを1つのVaultで管理する方法について
keywords:
  - Obsidian
category: note
authors: [mebiusbox]
tags: [Obsidian]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Obsidian%e3%81%a7%e8%a4%87%e6%95%b0%e3%81%ae%e3%83%87%e3%82%a3%e3%83%ac%e3%82%af%e3%83%88%e3%83%aa%e3%82%921%e3%81%a4%e3%81%aeVault%e3%81%a7%e7%ae%a1%e7%90%86%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95&subtitle=%ef%bc%88%e5%a0%b4%e6%89%80%e3%81%8c%e3%81%b0%e3%82%89%e3%81%b0%e3%82%89%e3%81%aa%ef%bc%89%e8%a4%87%e6%95%b0%e3%81%ae%e3%83%87%e3%82%a3%e3%83%ac%e3%82%af%e3%83%88%e3%83%aa%e3%82%921%e3%81%a4%e3%81%aeVault%e3%81%a7%e7%ae%a1%e7%90%86%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2025%2F03%2F29&tags=Obsidian
---

Obsidianで（場所がばらばらな）複数のディレクトリを1つのVaultで管理する方法について解説します．

<!-- truncate -->

先日、[VS CodeとmdBookとObsidianを使った環境](/blog/2025/03/23/vscode-mdbook-obsidian)という記事を書きました．
非常に快適なので、他のドキュメントも Obsidian で閲覧できるようにしたいなと思いました．

バージョン管理するほどでないちょっとしたメモ（テキストベース）は Visual Studio Code の拡張機能 Notes で管理しています．
このデータは Google Drive で保存しています．これは Markdown で書かれていたり、PDFの資料が入っています．このディレクトリも合わせて Obsidian で見れないかと思いました．Vault を新規に作成して管理する方法もありますが、プラグインや設定が別々になってしまって管理しづらくなってしまうので、なんとか1つのVaultで管理できないか、というのが今回のテーマです．

## シンボリックリンクの作成

結論から言うと、標準の Vault ディレクトリの中に、それぞれシンボリックリンクを作成する方法で解決しました．
もはや Visual Studio Code で管理する必要はないのではと思わなくもないですが、やはり、手軽に Visual Studio Code で編集したいので、とりあえず Notes を使いつつ、Obsidian はビューアとして使っていこうと思います．

以上です．
