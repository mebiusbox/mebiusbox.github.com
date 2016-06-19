---
layout: post
title: Jekyll：アーカイブページを作る
category: note
tags: [Jekyll]
---

[こちらの記事]({% post_url 2016-06-18-jekyll-archives %}) では `jekyll-archives` を使った方法を紹介しました。
ですが、GitHub Pages では動作しません。
ここでは GitHub Pages で使える機能でアーカイブページを作成します。

## 年月日
{% raw %}

全記事から年月日を参照して、列挙します。
記事の列挙は次のようになります。

	{% for post in site.posts %}
	  {{ post.title }}
	{% endfor %}

記事の日付は `post.date` です。
年月ごとに列挙する場合は次のようになります。

	{% for post in site.posts %}
	  {% unless post.next %}
	    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
	    {% capture month %}{{ post.date | date: '%m' }}{% endcapture %}
	    <h2 id="{{year}}{{nmonth}}">{{ month }}/{{ year }}</h2>
	    <ul class="posts">
	      <li>
	        <span class="post-date">{{ post.date | date_to_string }} &raquo;</span>
	        <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
	      </li>
	  {% else %}
	    {% capture month %}{{ post.date | date: '%m' }}{% endcapture %}
	    {% capture nmonth %}{{ post.next.date | date: '%m' }}{% endcapture %}
	    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
	    {% if month != nmonth %}
	      </ul>
	      <h2 id="{{year}}{{nmonth}}">{{ month }}/{{ year }}</h2>
	      <ul class="posts">
	    {% else %}
	      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
	      {% if year != nyear %}
	        </ul>
	        <h2 id="{{year}}{{nmonth}}">{{ month }}/{{ year }}</h2>
	        <ul class="posts">
	      {% endif %}
	    {% endif %}
	    <li>
	      <span class="post-date">{{ post.date | date_to_string }} &raquo;</span>
	      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
	    </li>
	  {% endunless %}
	{% endfor %}
	</ul>

`post.date` はそのまま出力すると `2016-06-18 00:00:00 +0900` となってしまいます。
`{{ post.date | date_to_string }}` とすると `18 Jun 2016` というように変換されます。
date_to_string 以外にも細かく指定するオプションがあります。ここでは詳しく解説しません。

`post.next` は次の記事ですが、最後の記事の場合 nil になります。そのため `unless` を使って処理を分岐しています。

`{% capture year %}` は `{% capture year %}` と `{% endcapture %}` で囲んだ内容を year に代入します。
{% endraw %}


## カテゴリ
{% raw %}

カテゴリの列挙は次のようになります。

	{% for category in site.categories %}
	  {% capture name %}{{ category[0] }}{% endcapture %}
	  <h2>{{ name }} ({{ site.categories[name] | size }})</h2>
	  <ul class="posts">
	  {% for post in site.categories[name] %}
	    <li>
	      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
	      <span class="post-date">{{ post.date | date_to_string }}</span>
	    </li>
	  {% endfor %}
	  </ul>
	{% endfor %}

例えば `hoge` というカテゴリ名の場合 `site.categories.hoge` で記事を列挙できます。
変数を使って参照する場合は `site.categories[variable]` というようになります。

`site.categories.hoge | size` を指定すると記事数を取得できます。

{% endraw %}

## タグ
{% raw %}

カテゴリとやり方は同じです。タグの場合、`site.tags` になります。

	{% for tag in site.tags %}
	  {% capture name %}{{ tag[0] }}{% endcapture %}
	  <h2>{{ name }} ({{ site.tags[name] | size }})</h2>
	  <ul class="posts">
	  {% for post in site.tags[name] %}
	    <li>
	      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
	      <span class="post-date">{{ post.date | date_to_string }}</span>
	    </li>
	  {% endfor %}
	  </ul>
	{% endfor %}

{% endraw %}


これで、カテゴリ一覧やタグ一覧などが作れます。あとは好きなようにレイアウトしてあげればいいです。
