---
layout: post
title: Jekyll：site.url をローカル環境と本番環境とで切り替える方法
category: note
tags: [Jekyll]
authors: [mebiusbox]
---

`site.url` は `_config.yml` で設定されています。ローカル環境で確認しているときは `site.url` が `localhost:4000` だと便利です。
`_config.yml` を複製し `_config-dev.yml` という名前にします。この名前は適当で構いません。
下記のコマンドを実行することで `_config-dev.yml` を参照するようになります。

<!-- truncate -->

	jekyll serve -w --config _config-dev.yml
