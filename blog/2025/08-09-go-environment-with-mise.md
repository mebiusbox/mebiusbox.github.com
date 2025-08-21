---
title: Windows で mise を使用した Go 環境のパス設定
description: Windows で mise を使用した Go 環境パス設定
keywords:
  - mise
  - go
  - windows
category: note
authors: [mebiusbox]
tags: [mise, go, windows]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Windows+%e3%81%a7+mise+%e3%82%92%e4%bd%bf%e7%94%a8%e3%81%97%e3%81%9f+Go+%e7%92%b0%e5%a2%83%e3%81%ae%e3%83%91%e3%82%b9%e8%a8%ad%e5%ae%9a&subtitle=Windows+%e3%81%a7+mise+%e3%82%92%e4%bd%bf%e7%94%a8%e3%81%97%e3%81%9f+Go+%e7%92%b0%e5%a2%83%e3%83%91%e3%82%b9%e8%a8%ad%e5%ae%9a&date=2025%2F08%2F09&tags=mise,go,windows
---

Windows で mise を使ったGo言語の環境を構築するときのパス設定について備忘録です．

<!-- truncate -->

Python や Node の環境を mise を使うようにしたので、Go の環境も mise を使うようにしました．
WindowsにおけるGo言語の環境は、バージョンが上がるたびにインストーラを使ってインストール（アップグレード）すると思います．
インストーラは自動で環境変数にパスを設定するので問題ありません．
しかし、mise の場合、環境変数が設定されないので自分で設定する必要があります．`use`コマンドでgoをインストールするとパスにはバージョン名が含まれています．なので、このパスを環境変数に直接設定しているとバージョンを上げるごとに設定し直す必要があります．

:::note
`mise activate` していれば環境変数 `GOBIN` と `PATH` に設定されます．今回の内容は `GOPATH` への設定や `shims` を使っている場合になります．
:::

そこで、自動的に現在のバージョンを環境変数に設定するため、PowerShellのユーザープロファイルを使うようにしました．
Go の環境は `mise which go` で調べられます．

```powershell
PS > mise where go
C:\Users\xxx\AppData\Local\mise\installs\go\1.24.5
```

バイナリは `bin` にありますので、これらを `GOPATH` と `PATH` に設定します．

```powershell
$env:GOPATH = mise where go
$env:Path = "${env:GOPATH}\bin;${env:Path}"
```

以上です．
