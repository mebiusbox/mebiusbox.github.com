---
layout: post
title: CentOS7 + GitBook + GitLab + Hubot で 文書作成環境の構築
category: note
tags: [gitbook]
authors: [mebiusbox]
---

## はじめに

GitBook は Markdown 形式のドキュメントから電子文書を作成するツールです。
次のような文書作成環境を構築します。

<!-- truncate -->

* GitBook に使うドキュメントを GitLab でバージョン管理します
* GitLab の push イベントを Hubot でフックします
* GitBook を使って電子文書を作成します
* 作成した電子文書を Apache を使って公開しブラウザで閲覧、ダウンロードできるようにします
* これらをVirtualBox(Windows) で作成した CentOS7 上に実装します

私はWindows10 64bit環境で動作確認しました。

## CentOS7 の仮想マシンを作成

VirtualBox の仮想マシンを作成し、CentOS7 を Minimal 構成でインストールします。
使ったのは `CentOS7-x86_64-Minimal-1511.iso` です。
インストール後、`yum upgrade` を行います。
Guest Additions は入れてません。
SELinux は無効にし、`firewalld` をインストールします。

## GitLab のインストール

以下のコマンドを実行します。

```
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
yum -y install gitlab-ce
```

ホストPCからアクセスしたいので、ホストオンリーアダプタのIP(192.168.56.101) を `external_url` に設定して `gitlab-ctl reconfigure` を実行します。

ホストPCからブラウザで `http://192.168.56.101` にアクセスしてみると...
接続されませんね。ファイアウォールの設定で 80 ポートを開けます。

```
firewall-cmd --add-service=http --permanent
firewall-cmd --reload
```

再度アクセスして GitLab の画面が表示されることを確認します。
パスワードを再設定して root でログインできることを確認しましょう。

## GitBook のインストール

GitBook は Node.js のアプリケーションです。
まずは Node.js をインストールします。

```
yum install epel-release -y
yum install nodejs npm -y
```

次に `gitbook-cli` をインストールします。これは Gitbook のコマンドラインツールです。gitbook 自体は含まれていません。

```
npm install gitbook-cli -g
```

これで gitbook のコマンドが使えるようになります。
gitbook 自体は gitbook のコマンドを実行しようとすると、自動でインストールされます。

(gitbook をグローバルでインストールすると上手く動作しないのでローカルにインストールすることをオススメします)

```
gitbook help
```

上記を実行して本体をインストールします。
適当にフォルダを作って動作確認してみます。

```
mkdir book
cd book
gitbook init

> warn: no summary file in this book
> info: create README.md
> info: create SUMMARY.md
> info: initialization is finished

gitbook build

> info: 7 plugins are installed
> info: 6 explicitly listed
> info: loading plugin "highlight"... OK
> info: loading plugin "search"... OK
> info: loading plugin "lunr"... OK
> info: loading plugin "sharing"... OK
> info: loading plugin "fontsettings"... OK
> info: loading plugin "theme-default"... OK
> info: found 1 pages
> info: found 0 asset files
> info: >> generation finished with success in 0.4s !
```

PDF, epub, mobi 形式を作成する場合はそれぞれ `gitbook pdf`, `gitbook epub`, `gitbook mobi` になります。
試しに PDF で作成してみます。

```
gitbook pdf

> info: 7 plugins are installed
> info: 6 explicitly listed
> info: loading plugin "highlight"... OK
> info: loading plugin "search"... OK
> info: loading plugin "lunr"... OK
> info: loading plugin "sharing"... OK
> info: loading plugin "fontsettings"... OK
> info: loading plugin "theme-default"... OK
> info: found 1 pages
> info: found 0 asset files
>
> InstallRequiredError: "ebook-convert" is not installed.
> Install it from Calibre: https://calibre-ebook.com
```

"ebook-convert" がインストールされていないので、[Calibre](https://calibre-ebook.com/) をインストールする必要があります。

公式サイトのダウンロードから Unix 用のインストール方法が記載されていますので、それを実行します。

```
yum install wget -y
sudo -v && wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | sudo python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
```

インストールすると警告が２つ出ます。２つとも ImportError で実行に必要なもの libGL.so と QImage が見つからなかったようです。
試しにここで `gitbook pdf` を実行すると「共有オブジェクトファイルを開けません」のようなエラーが表示されます。
これらは `qt-creator` パッケージをインストールすることで解決します。

```
yum install qt-creator -y
```

再度 `gitbook pdf` を実行して問題が出てないことを確認します。

## Hubot のインストール

以下のコマンドを実行します

```
npm install hubot coffee-script generator-hubot yo -g
```

root で Hubot の作成が出来ないので、Hubot 用のユーザーを作成します。このユーザーは gitbook の変換も兼ねているので `gitbook` としました。

```
useradd gitbook
passwd gitbook
```

gitbook ユーザーに切り替えて hubot を作成します。

```
su gitbook
cd ~
mkdir hubot
cd hubot
yo hubot
```

Hubot 作成の手続きが始まりますので、すべてデフォルトのままで作成します。
作成したら、まず不要なファイルを削除します。

```
rm scripts/example.coffee
```

hubot の実行スクリプト `run_hubot.sh` を作成し、以下の内容を記述します。

```
export PORT=5000
bin/hubot
```

作成したら実行権限を与えておきます。

```
chmod +x run_hubot.sh
```

次に Hubot スクリプト `scripts/gitlab_gitbook.coffee` を作成します。
内容は次のようになります。

```
# http://<host>:5000/gitlab_hook/?output_pdf=<pdf_name>

url = require 'url'
querystring = require 'querystring'

module.exports = (robot) ->

  push_request = (output_pdf, hook) ->
    git_group = hook.project.namespace
    git_project = hook.project.name
    git_url = hook.project.ssh_url
    console.log("hubot: group=#{git_group} name=#{git_project} output=#{output_pdf}")
    @exec = require('child_process').exec
    command = "sh /home/gitbook/gitbook.sh #{git_url} #{git_project} #{output_pdf}"
    @exec command, (error, stdout, stderr) ->
      robot.logger.error error if error?
      robot.logger.info stdout if stdout?
      robot.logger.info stderr if stderr?

  robot.router.post '/gitlab_hook', (req, res) ->
    hook = req.body
    q = querystring.parse(url.parse(req.url).query)
    kind = hook['object_kind'] || 'push'
    switch kind
      when 'push'
        push_request q.output_pdf, hook
    res.send 200
```

正常に実行できるか確認します。

```
./run_hubot.sh
```

次に hubot から gitbook を実行するスクリプトを作成します。
このスクリプトは gitbook ユーザのホームフォルダのトップに作成します。
ログが欲しいのでスクリプトを２つに分けて、リダイレクトでファイルに書き込むようにしました。
（ここはもっとスマートにやる方法があると思います。このあたりは初心者レベルなのでご容赦を）

```
vi ~/gitbook.sh
```

```
#!/bin/sh
LOGFILE=/tmp/gitbook-script-log
cd ~
./gitbook-exec.sh $1 $2 $3 >>$LOGFILE
```

実際に実行するスクリプトファイル `gitbook-exec.sh` は次のようになります。

```
#!/bin/sh
cd ~

if [ -e $2 ]; then
	cd $2
	git pull $1
	cd ../
else
	git clone $1
fi

gitbook install ./$2
gitbook pdf ./$2 ./$2/$3.pdf
gitbook build ./$2

cp -rf ./$2/_book -T /var/www/html/$2
```

忘れずに実行権限を与えておきます。

```
chmod +x gitbook.sh
chmod +x gitbook-exec.sh
```

### sshキー の登録

この gitbook ユーザは GitLab にアクセスしますので、ssh キーを登録しておきます。

```
ssh-keygen -t rsa
```

生成した id_rsa.pub の内容を GitLab でログインし、Profile Settings の SSH Keys に登録しておきます。

実際に clone 出来るか確認しておきます。
GitLab で適当なプロジェクトを作成します。
ここでは 「root」 ユーザーで 「Test」 というプロジェクトを作成しました。
URL は「 git@192.168.56.101:root/Test.git 」になります。

```
git clone git@192.168.56.101:root/Test.git

> bash: git: コマンドが見つかりません
```

おっと、git が入っていませんでした。インストールします。

```
sudo yum install git -y
```

再度 clone を試します。

```
git clone git@192.168.56.101:root/Test.git

> Cloning into 'Test'...
> The authenticity of host '192.168.56.101 (192.168.56.101)' can't > be established.
> ECDSA key fingerprint is c9:7d:09:34:cc:3a:74:fd:0d:d7:98:bf:31:62:21:2f.
> Are you sure you want to continue connecting (yes/no)?
```

初回だと上記のような確認が出ますが、そのまま yes で問題ありません。
「Test」フォルダに移動して、`gitbook init` コマンドを実行し、gitbook のインストールと初期ファイルを作成します。
生成された `SUMMARY.md` と `README.md` をプッシュしておきます。

まずは git の設定をします。

```
git config --global user.name "<username>"
git config --global user.email "hoge@example.com"
```

上記の名前とメールアドレスは適当なので、適切な名前を設定してください。
以下を実行してプッシュします。

```
git add README.md SUMMARY.md
git commit -m "add README SUMMARY"
git push -u origin master
```


## Apache のインストール

gitbook で作成した電子文書を閲覧するために Web サーバー (apache) を導入します。

```
yum install httpd -y
```

ポートは 8000 を指定します。80 は GitLab(nginx) が使用しています。また 5000　ポートは hubot で使います。

gitbook ユーザで作成した文書を `/var/www/html` フォルダ内にコピーしています。
そのため `var/www/html` の所有者を gitbook に変更しておきます。

```
chown gitbook:gitbook /var/www/html
```

設定が終わったらWebサーバを起動します。

```
systemctl start httpd
systemctl enable httpd
```

例えば先ほどの「Test」プロジェクトは `/var/www/html/Test` となりますので、URL は「 http://192.168.56.101:8000/Test/ 」になります。また、PDF 文書は「 http://192.168.56.101:8000/Test/{output_pdf}.pdf 」でアクセスします。

## GitLab で WebHook を設定

これで一通りの自動生成環境は整いました。
GitLab のテストプロジェクトで動作確認します。
GitLab のプロジェクト設定で「Webhooks」を選択します。

Webhooks の URL に `http://192.168.56.101:5000/gitlab_hook/?output_pdf=Test` と入力します。
Secret Token は空で、Trigger は `Push events` にチェックをつけます。
SSL Verification の「Enable SSL verification」のチェックははずします。
以上の設定が終わったら「Add Webhook」を設定しておきます。

下の方に追加された Webhook があります。
自動生成が動作するか確認します。

まず、CentOS側では gitbook ユーザーにし、clone した Test フォルダを削除しておきます。そして、hubot を起動させます。

```
cd ~
rm -rf Test
cd hubot
./run_hubot.sh
```

次に GitLab の画面から追加した Webhook の右側にある「Test」ボタンを押します。
GitLab 側で `Hook executed successfully: HTTP 200` と表示されれば GitLab からのフックは上手く動作しています。

hubot 側もエラーが発生していないか `/tmp/gitbook-script-log` を確認します

問題なければホストPCからブラウザで見てみます。
URL は `http://192.168.56.101:8000/Test/` です。

あれ、接続がタイムアウトされたと表示されました。
CentOS 側のファイアウォールで 8000 番を開けます。

```
firewall-cmd --add-port=8000/tcp --permanent
firewall-cmd --reload
```

画面に「Introduction」と表示されれば成功です。
PDF も作成されているか確認します。
URL は `http://192.168.56.101:8000/Test/Test.pdf` です.

問題なければこれで基本的な機能は実装できました。

## hubot の永続化

これから細かい調整をしていきます.
まず、hubot の永続化を行います。
それには `forever` を使いますので、インストールします。

```
npm install forever -g
```

次に `bin/hubot` を書き換えます。

```
# exec node_modules/.bin/hubot --name "hubot" "$@"
forever start -c coffee node_modules/.bin/hubot
```

起動方法はこれまで変わらないので `./run_hubot.sh` を実行します。
動作しているか確認する場合は `forever list` です。

## 日本語の対応

ここまでの設定で日本語を含めた文書を入れると HTML の方は問題ありませんが、 PDF では日本語の部分が表示されません。

### HTML
<a href="/img/post/2016-07-15-gitbook-automation-001.png"><img src="/img/post/2016-07-15-gitbook-automation-001.png" width="50%" /></a>

### PDF
<a href="/img/post/2016-07-15-gitbook-automation-002.png"><img src="/img/post/2016-07-15-gitbook-automation-002.png" width="50%" /></a>

### フォントをインストール
これは日本語のフォントが入っていないのが原因ですので、インストールします。

```
yum groupinstall fonts -y
```

インストールしたら再度、生成させてみます。

<a href="/img/post/2016-07-15-gitbook-automation-003.png"><img src="/img/post/2016-07-15-gitbook-automation-003.png" width="50%" /></a>

どうやら問題なさそうです。

※ここでは VL ゴシックのフォントで生成されていますが、場合によっては別のフォントになっているかもしれません。私も別の環境で試したところ別のフォントになってしまい、見た目があまりよろしくなかったことがありました。その場合はフォントを指定します。

`book.json` ファイルをトップフォルダに作成し、内容を以下のようにします。

```
{
	"pdf":{
		"fontFamily":"VL Gothic"
	}
}
```

これで PDF に使われるフォントを変更することが出来ます。


## 数式

gitbook には数式を埋め込むために mathjax のプラグインがあります。
使用するには `book.json` を作成し、内容を以下のようにします。

```
{
	"plugins":["mathjax"]
}
```

PDF でも使うためには `svgexport` が必要ですので、これもインストールする必要があります。
svgexport のインストールには `bzip2` も必要なので先にこちらをインストールします。

```
yum install bzip2 -y
npm install svgexport -g
```

![fig-4](/img/post/2016/2016-07-15-gitbook-automation-004.png)


正常に生成されました。

## 最後に

Git, GitHub, GitLab, GitBook は最近触り始めたばかりですが色々出来て面白いです。今回は Jekyll の影響が大きく Git でプッシュするとコンテンツが出来上がるというのは大変楽ですし、プログラマに優しい感じがします。とはいっても、ここまで来るのに苦労したのでなんとも言えませんが。
Gitbook にはまだ設定できるところもあるようですし、スタイルにはこだわる方なので、もう少し手を付け加えたいところですね。PDF はもっと体裁を整えて社外にも出せるぐらいの完成度を目指したいです。HTML の方は css いじりたいですね。
今回の内容については所々ツッコミたいところもあるかもしれませんが、参考になれば幸いです。
