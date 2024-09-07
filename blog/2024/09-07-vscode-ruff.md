---
title: Visual Studio Codeで Ruff を使ったときの問題
description: Visual Studio Codeで Ruff を使ったときに問題が発生したのでその対処方法について
keywords:
  - Visual Studio Code
  - Ruff
category: note
authors: [mebiusbox]
tags: [vscode, python, ruff]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual+Studio+Code+%e3%81%a7+Ruff+%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%9f%e3%81%a8%e3%81%8d%e3%81%ae%e5%95%8f%e9%a1%8c&subtitle=Visual+Studio+Code+%e3%81%a7+Ruff+%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%9f%e3%81%a8%e3%81%8d%e3%81%ab%e5%95%8f%e9%a1%8c%e3%81%8c%e7%99%ba%e7%94%9f%e3%81%97%e3%81%9f%e3%81%ae%e3%81%a7%e3%81%9d%e3%81%ae%e5%af%be%e5%87%a6%e6%96%b9%e6%b3%95%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2024%2F09%2F07&tags=vscode,python,ruff
---

Visual Studio CodeでRuffを使うときに1つ問題があったので対処方法を記録しておきます．

<!-- truncate -->

[Ruff](https://docs.astral.sh/ruff/) はリンターおよびフォーマッタです．高速なのが特徴です．
Visual Studio Codeで使う場合、[拡張機能](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)をインストールします．

使用していると、整形時に最終行が複製されてしまう問題が発生しました．
どうやら、他の拡張機能と合わせて使っていると起きるようです．
issue([#128](https://github.com/astral-sh/ruff-vscode/issues/128))として報告はされているようです．
対処方法は確認したところ、2つあるようです．

- 他のリンターやフォーマッタなどの拡張機能を無効にする
- `ruff.organizeImports` を無効にする

前者の場合、[ms-python.isort](https://marketplace.visualstudio.com/items?itemName=ms-python.isort) を無効にします．
もしかするとそれ以外も無効にする必要があるかもしれません．

厄介な問題なので、対応はしておきましょう．

以上です．
