---
layout: post
title: Eclipse：C++静的チェック環境
category: note
tags: [eclipse]
---

Eclipse の C++ 開発環境に静的コード解析をいくつか追加します。ここで解説する方法はプロジェクト単位ではなく１ファイル単位での解析となります。
追加するのはスタイルチェックやメトリクス解析などで、次のツールを使います。

* cpplint
* cppcheck
* SourceMonitor

メニューバーから `Run > External Tools > External Tools Configurations...` を選択します。

![001]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-001.png)

ツールバーから選択してもいいです。

![002]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-002.png)


## cpplint

まずは cpplint を登録します。
cpplint は以下の場所からダウンロードできます。

<i class="fa fa-external-link"></i>
[cpplint](https://github.com/google/styleguide/tree/gh-pages/cpplint)

cpplint を実行するには python が必要です。
インストールしていなければ適当な場所にインストールしてください。
ここでは cpplint.py を `E:\cpplint.py`、python は `E:\python27` にインストールしてあります。

左下にある `Program` を選択するとその上にある `New` アイコンがクリック出来るようになるのでクリックします。

![003]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-003.png)

`Name` に `cpplint` と入力し、`Location` と `Arguments` に以下のように入力します。

Location：`E:\python27\python.exe`  
Arguments：`E:\cpplint.py ${resource_loc}`

![004]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-004.png)

次に `Common` タブを選択して、Display in favorites menu の `Externals Tools` にチェックを入れます。
また、Launch in background はチェックをはずします。設定が終わったら `Apply` を押します。

![005]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-005.png)

これで設定終了です。

## cppcheck

同じような手順で、cppcheck を登録します。
cppcheck は以下の場所からダウンロードできます。

<i class="fa fa-external-link"></i>
[cppcheck](http://cppcheck.sourceforge.net/)

ここでは 1.74 (64bit) をデフォルト設定のままインストールしました。

cpplint と同じように New ボタンを押して新規に作成し、Name を `cppcheck`、Location, Arguments を以下のように設定します。

Location：`C:\Program Files\Cppcheck\cppcheck.exe`  
Arguments：`--enable=all --force ${resource_loc}`

cppcheck はインクルードしたファイルが検索できないとエラーとなりますが、`--force` で強制的に解析します。

## SourceMonitor

SourceMonitor はメトリクス解析をやってくれます。以下の場所からダウンロードできます。

<i class="fa fa-external-link"></i>
[SourceMonitor](http://www.campwoodsw.com/sourcemonitor.html)

ここではデフォルト設定のままインストールしました。こちらは次のように設定します。

Name：`SourceMonitor`  
Location：`C:\Program Files (x86)\SourceMonitor\SourceMonitor.exe`  
Arguments：`/DC++ ${resource_loc}`

## 実行してみる

計測したいファイルを開いた状態で `Run > External Tools...` から実行したいツールを起動します。
cpplint と cppcheck はコンソール画面に、SourceMonitor はダイアログが表示されます。

## CPPLINT.cfg

cpplint の設定は `CPPLINT.cfg` ファイルを作成し、その中で記述します。CPPLINT.cfg ファイルは対象のソースコードと同じところに入れておくか親のフォルダに入れても構いません。プロジェクトのトップフォルダに入れておくと楽です。

例えば以下のような設定になります。

	set noparent
	linelength=100
	filter=-whitespace/tab,-whitespace/indent,-whitespace/comment

linelength で行数を、filter でフィルターの細かい設定を行えます。
詳細はマニュアルを参照してください。

## SourceMonitorが起動しない場合

対象のソースファイルが UTF-8 の場合、SourceMonitor が起動しないことがあります。
一度 SourceMonitor を直接起動し、`File > Options > Allow parsing of UTF-8 files` にチェックをつけて再度試してみてください。

![006]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-006.png)

## メトリクス計測について

詳しくは検索してもらえれば沢山見つかると思います。
複雑度の数値については 10 以下が理想とありますが、個人的には 50 以下、出来れば 30 以下をキープすればいいかと思っています。
ただし、場合によっては複雑な条件だらけになることもあるので例外はあると思っています。

## metriculator

Eclipse のプラグインに metriculator というメトリクス計測があります。
Eclipse Marketplace からインストールするこｔが出来ます。

![007]({{ site.url }}/assets/img/post/2016-06-26-eclipse-cpp-code-analyze-007.png)

使い方は Project Explorer 上でフォルダまたはファイルを右クリックして `Run C/C++ Code Analysis` を選択します。
しばらくすると結果が表示されます。

項目 | 名前 | 説明 |
---|---|---
McCabe | cyclomatic complex | サイクロマチック数（複雑度）
NbMembers | Number of Members per type | クラスのメンバー数
LSLOC | Logical source lines of code | 行数
EfferentCoupling | Number of Efferent Couplings per type | クラスが参照している数
NbParams | Number of parameters per function | メソッドのパラメータ数
