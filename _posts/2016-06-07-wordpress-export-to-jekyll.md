---
layout: post
title: WorldPress から Jekyll へのエクスポート
category: note
tagline: ""
tags: [WordPress, Jekyll]
---
{% include JB/setup %}

GitHub Pages + Jekyll の環境を構築したので、現在のブログ（随分更新していない）から Jekyll へのインポートを試してみました。
使ったのは [Jekyll Exporter](https://ja.wordpress.org/plugins/jekyll-exporter/) です。
WorldPress のプラグイン管理からインストールしました。

インストールしたときはエラーが出ていたので、WorldPress を最新にアップデート。
そしたら WordPress 自体が動かなくなったので PHP のバージョンを最新に。
それでも動かなかったので、Jekyll Exporter が動作する PHP 5.3 に。これで WorldPress、Jekyll Exporter ともに有効に。

WordPress の管理画面から `Export To Jekyll` を選択して出力。
zip ファイルなので適当な場所に解凍して、`_posts` に入っているファイルをコピー。
Jekyll でビルドするもエラー。Windows だと、rb_sysopen で失敗。CentOS7 だと Protocol Error で失敗。  
とりあえず、CentOS 側で原因調査したところ、エラーの内容を見るにパーマリンクが怪しかった。  
なので、WordPress のパーマリンク設定でカスタム構造にし、`/%category%/%postname%` に変更。
カテゴリのスラッグをすべて設定して、英文字で出力できるように。
これで、もう一度 `Export To Jekyll` をしてビルドをすると、CentOS7 では成功。でも、Windows では変わらずエラー。
Windows のエラーはよくわからんです。

## 参考
 * [WordPressのパーマリンク設定を変更して、SEOや日本語URLの対策をしよう](http://liginc.co.jp/web/wp/customize/148458)
