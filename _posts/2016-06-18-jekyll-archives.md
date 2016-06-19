---
layout: post
title: Jekyll：jekyll-archives でアーカイブページを作る
category: note
tags: [Jekyll]
---

`jekyll-archives` を使うと、日付・カテゴリ・タグごとにアーカイブページを生成してくれます。

[jekyll-archives](https://github.com/jekyll/jekyll-archives)

まずはインストールします。

	gem install jekyll-archives

次に `_config.yml` を編集して生成するようにします。

	gems: [jekyll-archives]
	jekyll-archives:
	  enabled: [all]
	  layout: 'archive'
	  permalinks:
	    year: '/archives/year/:year/'
	    month: '/archives/month/:year:month/'
	    day: '/archives/month/:year:month:day/'
	    tag: '/archives/tag/:name/'
	    category: '/archives/category/:name/'

この設定だと、すべてのアーカイブページを `archives` フォルダ以下に作成します。
例えば 2016 年の記事の場合 `/archives/year/2016` になります。

`enabled` のところで生成する種類を指定できます。`all` ならすべて、`[year, tag, category]` なら年・タグ・カテゴリの３種類になります。

`layout` ではアーカイブページのレイアウトを指定します。今回は `archive` と指定しているので、`_layouts/archive.html` となります。
レイアウトについては [こちら](https://github.com/jekyll/jekyll-archives/blob/master/docs/layouts.md) を参照してください。

各アーカイブページへのリンクは自分で作成する必要があります。
それについては [こちらの記事]({% post_url 2016-06-18-jekyll-create-archives %}) を参照してください。
