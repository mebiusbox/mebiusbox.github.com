---
layout: post
title: GitLab Issues のスタイルシートをカスタマイズ
category: note
tags: [gitlab]
authors: [mebiusbox]
---

## はじめに

GitLab の Issues は一覧画面、詳細画面ともにタイトルが少し見づらいイメージがあります。
一覧画面にはタイトルとそれ以外の情報が２行で表示されていますが、１行目をもう少し目立たせたい。
詳細画面ではタイトルと詳細の間に空白を入れたい。
そこで、GitLab のスタイルシートをカスタマイズして調整してみます。
なお、試したバージョンは `GitLab-CE 8.9.6` で、OS は CentOS7 です。

## 変更前と変更後のスタイル

一覧ページでは、１行目の文字色、文字の多きさ、２行目の文字色を、詳細ページではタイトルの文字色とアンダーラインの付加、詳細との間に空白を入れます。また、フォントはメイリオにします。以下は変更前と変更後の画面です。

### 変更前

* 一覧画面

![fig](/img/post/2016/2016-07-19-gitlab-issues-custom-css-001.png)

* 詳細画面

![fig](/img/post/2016/2016-07-19-gitlab-issues-custom-css-002.png)

### 変更後

* 一覧画面

![fig](/img/post/2016/2016-07-19-gitlab-issues-custom-css-003.png)

* 詳細画面

![fig](/img/post/2016/2016-07-19-gitlab-issues-custom-css-004.png)

### 「えー、イマイチじゃない？」
そんなこと言わないで。

## Issues 画面のスタイルシート

一覧ページと詳細ページのスタイルシートは `/opt/gitlab/embedded/service/gitlab-rails/public/assets` に入っています。
ここにある css は SCSS からコンパイルされたもので、ソースファイルは以下の場所にあります。

### 一覧用スタイルシート

	/opt/gitlab/embedded/service/gitlab-rails/app/assets/stylesheets/pages/issues.scss

### 詳細用スタイルシート

	/opt/gitlab/embedded/service/gitlab-rails/app/assets/stylesheets/pages/detail_page.scss

これらのファイルを編集して反映させます。

## issues.scss

以下の内容をファイル末尾に追加します。

```css
.issue-title-text {
    font-family: "メイリオ";
    font-size: 12pt;
    a {
        color: #b92a2c !important;
        &:hover {
            color: #b92a2c !important;
        }
    }
}

.issue-info {
    color: #aaa;
    a {
        color: #aaa !important;
        &:hover {
            color: #aaa !important;
        }
    }
}
```

## detail_page.scss

`.detail-page-description` のところを以下のように書き換えます。

```css
.detail-page-description {
    .title {
        margin: 0;
        font-size: 16px;
//      color: $gl-gray-dark;
        color: #b92a2c;
        padding-bottom: 8px;
        margin-bottom: 16px;
        font-family: "メイリオ";
        border-bottom: 1px dotted #999;
    }
    ・・・
}
```


## 変更の反映

css を作りなおすには `gitlab-rake` でコンパイルし直します。
以下のコマンドを実行します。

```
gitlab-rake assets:clean assets:precompile
```

そうすると、以下のようなエラーが出ます。

```
rake aborted!
Errno::EACCES: Permission denied @ rb_sysopen - /opt/gitlab/embedded/service/gitlab-rails/public/assets/application-c648926c9d8a8939cebb4416841c41fe5cfaed87c8cc16110b52113026c41fd5.css.66282720.7223.147474
...
```

パーミッションが許可されていないようです。
そこで、コンパイルするときだけパーミッションを変更し、コンパイルしたら元に戻します。
そして、再作成したスタイルシートを反映させるため、GitLab をリスタートします。

※この解決策は以下を参考にしました。
[GitLab Omnibusロゴ差し替えスクリプト](http://qiita.com/hiconyan/items/7c5cdc6965c7eb44f1b5)

```
chown -R git:git /opt/gitlab/embedded/service/gitlab-rails/public/assets
gitlab-rake assets:clean assets:precompile
chown -R root:root /opt/gitlab/embedded/service/gitlab-rails/public/assets
gitlab-ctl restart
```

再アクセスしてみると、変更していることが確認出来ます。

## 最後に

あとは好きなようにスタイルをいじりましょう。
参考になれば幸いです。
