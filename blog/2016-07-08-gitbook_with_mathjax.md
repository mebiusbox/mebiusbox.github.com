---
layout: post
title: Windows で Gitbook + mathjax を使った文書作成
category: note
tags: [gitbook]
authors: [mebiusbox]
---

Gitbook は Markdown 形式で書かれた文書から HTML や PDF, EPUB, MOBI 形式の作成が行えるツールです。
ここでは　Windows で環境を構築する方法を解説します。

## Node.js のインストール
まず、Node.js が必要です。以下のサイトから LTS 版をダウンロードします。

<i class="fa fa-external-link"></i>
[Node.js](https://nodejs.org/)

ダウンロードしたファイルを実行してインストールします。
インストール先はデフォルトのままで構いません。

## gitbook-cli のインストール
gitbook をコマンドで実行するために `gitbook-cli` をインストールします。
コマンドプロンプトを開いて以下のコマンドを実行します。

	npm install -g gitbook-cli

gitbook-cli 自体は　gitbook を含んでいません。
gitbook の機能を使うときに自動でインストールされます。そこで適当なサブコマンドを実行してインストールします。

	gitbook help

## テストしてみる
サンプルとして以下の文書をビルドしてみます。

<i class="fa fa-external-link"></i>
[Learn Javascript](https://github.com/GitbookIO/javascript)

適当なフォルダを作成します。
git が使えるなら clone します。

	git clone https://github.com/GitbookIO/javascript

git が使えない場合はリンク先から `Clone or download > Download Zip` でダウンロードします。

パスを javascript に設定して以下のコマンドを実行します。

	gitbook serve

ビルドが開始され `Serving book on http://localhost:4000` と出たら成功です。
ブラウザで `http://localhost:4000` を開いて確認してみます。

## Mathjax を使う
gitbook のプラグインとして　mathjax が使用できます。
新規にフォルダを作成して新しい文書を作成しましょう。
適当なフォルダを作成してパスを通し、以下のコマンドを実行します。

	gitbook init

実行するといくつかのファイルが生成されます。そのまま `gitbook serve` を実行して動作確認しておきます。

## プラグインの追加
`book.json` にプラグインを記述することができます。
gitbook init では作成されませんので、新規に作成します。
プラグインの指定は `plugins` で行います。
mathjax を使う場合は以下のようになります。

```json
{
	"plugins":["mathjax"]
}
```

## VisualStudio 2015 のインストール
mathjax を使うためにはビルド環境が必要です。
VisualStudio の最新版である 2015 を入れます。

<i class="fa fa-external-link"></i>
[VisualStudio 2015](https://www.microsoft.com/ja-jp/dev/products/visual-studio-2015.aspx)

上記のサイトから Community 版をダウンロードしてインストールします。
デフォルトのままでは必要なファイルがインストールされませんので、カスタムインストールします。

インストールの種類を選択するときに `カスタム` を選択します。
`プログラミング言語 > Visual C++ > Visual C++ 2015 用の共通ツール` にチェックを入れます。
それ以外はチェックをはずしても問題ありません。
インストール先はデフォルトのままで構いません。
インストールには時間がかかりますので、待ちましょう。

## python 2.7.x のインストール
次に python が必要になります。python には 2.x 系と 3.x 系がありますが 2.x 系をインストールします。
以下のサイトから 2.7.x 系の最新版をダウンロードしてインストールします。

<i class="fa fa-external-link"></i>
[python](http://www.python.jp/)

インストール先はデフォルトのままで構いません。
コマンドから python を実行するために環境変数にパスを登録する必要があります。
インストーラを使ってインストールする場合は `Add python.exe to Path` を有効にしておきます。

## mathjax をインストールする
これで準備が整ったので mathjax をインストールします。
book.json に書かれたプラグインをインストールする場合は以下のコマンドを実行します。

	gitbook install

`info: >> plugin "mathjax" installed with success` と表示されればインストール成功です。
もし次のようなエラーが出た場合：

	C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v12.0\CodeAnalysis\Microsoft.CodeAnalysis.targets(214,5): error	MSB4175: タスク ファクトリ "CodeTaskFactory" を
	アセンブリ ":\Program Files (x86)\MSBuild\v12.0\bin\Microsoft.Build.Tasks.v12.0.dll" から読み込めませんでした。
	プロセスを開始するのに使用される環境ブロックの長さは、65,535 バイトを超えて指定することはできません。
	ユーザーの環境ブロックの長さは 1860986 バイトです。環境変数のいくつかを削除して、もう一度実行してください。
	"c:\book\node_modules\contextity\build\contextify.vcxproj"
	...
	Error: contextify@0.1.15 install: `node-gyp rebuild`
	Exit status 1

問題となっている contextify を直接インストールします。
以下のコマンドを実行します。

	npm install contextify

問題なくインストールされたら再度プラグインのインストールを試みます。

	gitbook install

`info: >> plugin "mathjax" installed with success` と表示されればインストール成功です。
あとは文書をビルドして確認してみます。

	gitbook serve

## PDF, epub, mobi 形式の作成

### svgexport
PDF などで数式を文書に含めるには `SVGexport` が必要です。
以下のコマンドを実行してインストールします。

	npm install -g svgexport

### ebook-convert
PDF などの文書を作成するには `ebook-convert` が必要です。
以下のサイトから `calibre` をダウンロードしてインストールします。

<i class="fa fa-external-link"></i>
[calibre](https://calibre-ebook.com/)

### pdf, epub, mobi 形式の作成
それぞれ次のコマンドで作成することができます。

	gitbook pdf
	gitbook epub
	gitbook mobi

## プラグインのオプション指定
gitbook のプラグインのオプションは `book.json` で指定できます。
例えば mathjax のオプションを指定する場合は次のようになります。

```json
"plugins":["mathjax"],
"pluginsConfig":{
	"mathjax":{
		"forceSVG":true
	}
}
```

## 最後に...
残念ながら Windows で mathjax を使った pdf を作成すると数式の解像度がひどいことになっており、使えません。
HTML 形式では問題ないので、html でデプロイする場合には問題ないと思います。
CentOS7 で pdf 出力した場合はぎりぎり許容できそうなレベルではありますが、それでもイマイチな出来です。
そのあたり改善されるか、または調整できるのであれば大変便利ですね。
また、[gitbook](https://www.gitbook.com/) でビルドすると綺麗ですので、こちらを使うのもありです。
専用のエディタもあるので、なかなか便利です。
Windowsでは数式を使わなければ問題ないので、文書作成環境として問題ないと思います。
