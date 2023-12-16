---
title: NotionでWBSを管理する
description: Notionのサブアイテムを使ってWBSを構築するやり方を解説します
keywords:
  - Notion
  - WBS
category: note
authors: [mebiusbox]
tags: [Notion]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Notion%E3%81%A7WBS%E3%82%92%E7%AE%A1%E7%90%86%E3%81%99%E3%82%8B&subtitle=Notion%E3%81%AE%E3%82%B5%E3%83%96%E3%82%A2%E3%82%A4%E3%83%86%E3%83%A0%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6WBS%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B%E3%82%84%E3%82%8A%E6%96%B9%E3%82%92%E8%A7%A3%E8%AA%AC%E3%81%97%E3%81%BE%E3%81%99&date=2023%2F01%2F17&tags=Notion
---

Notionのサブアイテム機能を使うことで単一のデータベースのみでWBS(Work Breakdown Structure)を構築できます．
ここでは、次のようなWBSの構築方法を解説します．

<!-- truncate -->

import VideoPlayer from '@site/src/components/Markdown/VideoPlayer.tsx'
import HL from '@site/src/components/Markdown/Highlight.tsx'
import Bookmark from '@site/src/components/Markdown/WebBookmark.tsx'

<VideoPlayer url='/img/post/2023-01-17-Notion-WBS.mp4' />

:::caution
ここでは、英語版Notionで解説しています．また、CSSで見た目をカスタマイズしているものをスクショしています．ご了承ください．
:::

## データベースの作成

まず、データベースを作成します．プロパティは次のようにします：

- Task: タイトル(Title)
- 進捗(子): セレクト(Select)
- 進捗(親): 関数(Formula)

<p><HL>進捗(子)</HL>のセレクト項目は次のようにしました． </p>

- `0%` .. `100%` (10%刻み)
- `自動`

<p><HL>進捗(親)</HL>の関数は後で解説します．</p>

この時点で次のようなプロパティ構成になっています．

![](/img/post/2023-01-17-notion-wbs-230117230900.png)


## サブアイテムの設定

データベースの設定(`･･･`ボタン)からサブアイテム(`Sub-items`)の設定を選択します．

![](/img/post/2023-01-17-notion-wbs-230117231000.png)

設定はデフォルトのままで問題ありません．

![](/img/post/2023-01-17-notion-wbs-230117231026.png)

次のようなプロパティの構成になっているはずです．

![](/img/post/2023-01-17-notion-wbs-230117231127.png)


## 進捗率の計算

子の進捗率を計算して親の進捗率として表示します．そのためにプロパティを2つ作成します．
1つは`_進捗N`で関数(Formula)タイプです．先頭の`_`は計算用を表しています．もう1つは`_進捗R`とします．こちらはロールアップ(Rollup)で、リレーション(Relation)に`Sub-item`を設定します．

![](/img/post/2023-01-17-notion-wbs-230117225647.png)

次にプロパティ(Property)に`_進捗N`を設定します．

![](/img/post/2023-01-17-notion-wbs-230117225734.png)

計算(Calculate)は`オリジナルを表示(Show original)`に設定しておきます．

この時点で、プロパティは次のようになっています．

![](/img/post/2023-01-17-notion-wbs-230117231537.png)

適当にタスクを追加して、タスクの親子関係を設定します．ここで重要なのは、子を持つ親タスクの<HL>進捗(子)</HL>は`自動`に設定しておいてください．

![](/img/post/2023-01-17-notion-wbs-230117231646.png)


### 子タスクの進捗率

`_進捗N`は子タスクの<HL>進捗(子)</HL>のセレクト値を数値に変換します．まず、`_進捗N`を数値として扱いたいので、関数(Formula)で`1`と設定します．

![](/img/post/2023-01-17-notion-wbs-230117232045.png)

これで、このプロパティが数値として扱われます．数値として扱われると、関数プロパティのオプションに`数値の形式(Number format)`と`表示形式(Show as)`が追加されます．

![](/img/post/2023-01-17-notion-wbs-230117232215.png)

数値の形式(Number format)を`数値(Number)`にし、表示形式(Show as)を`リング(Ring)`に設定します．

![](/img/post/2023-01-17-notion-wbs-230117232322.png)

次に、`_進捗N`を数値に設定すると、そのプロパティをロールアップしている`_進捗R`の計算(Calculate)に項目が追加されますので、`合計(Sum)`を設定します．そうすると、`表示形式(Show as)`が選べるようになりますが`数値(Number)`のままにしておきます．

![](/img/post/2023-01-17-notion-wbs-230117232735.png)

これで、`_進捗N`と`_進捗R`がともに数値となりました．次に`_進捗N`の関数を設定します．関数は次の通りです．

```js
if(prop("進捗(子)") == "自動", floor(prop("_進捗R") / max(1, length(replaceAll(prop("Sub-item") + ",", "[^,]", "")))), toNumber(slice(prop("進捗(子)"), 0, -1)))
```

何をやっているかを説明すると、そのタスクが親タスク(<HL>進捗(子)</HL>で`自動`を設定しているタスク)であれば、`_進捗R`（そのタスクの子タスクすべての進捗率の合計）から子タスクの数で割って進捗率を計算しています．また、子タスクであれば、<HL>進捗(子)</HL>のセレクト値を数値に変換しています．


### 親タスクの進捗率

あとは、<HL>進捗(親)</HL>の計算で進捗率を計算します．<HL>進捗(親)</HL>の関数に以下を設定します．

```js
if(length(prop("Sub-item")) > 0, floor(prop("_進捗R") / max(1, length(replaceAll(prop("Sub-item") + ",", "[^,]", "")))), prop("_進捗N")) / 100
```

![](/img/post/2023-01-17-notion-wbs-230117234022.png)

数値の形式は`パーセント(Percent)`、表示形式は`リング(Ring)`に設定します．

![](/img/post/2023-01-17-notion-wbs-230117234120.png)

これで親タスクや子タスクを追加すると自動で計算されるようになります．

![](/img/post/2023-01-17-notion-wbs-230117234223.png)

最後に不要なプロパティを非表示にすることで完成です．

![](/img/post/2023-01-17-notion-wbs-230117234330.png)


## ステータスプロパティを使った方法

これまでの方法では子タスクの進捗率を計算して親タスクの進捗率を算出しました．
もし、そこまで正確な値を求める必要はなく、全体のタスクの進捗が終わったかどうかだけ調べて進捗率に反映させたい場合、ステータスプロパティを使って数式を使わずとも計算できます．

まず、データベースを作成します．

- Task: タイトル(Title)
- 進捗(子): ステータス(Status)
- 進捗(親): ロールアップ(Rollup)

次に、サブアイテムの設定をします．設定はデフォルトのままで問題ありません．

![](/img/post/2023-01-17-notion-wbs-230117235400.png)

適当にタスクを追加して、タスクの親子関係を設定します．

![](/img/post/2023-01-17-notion-wbs-230117235544.png)

次に、<HL>進捗(親)</HL>のロールアップでリレーション(Relation)を `Sub-item` 、プロパティ(Property)を<HL>進捗(子)</HL>、計算(Calculate)を`グループごとの割合(Percent per group) → Complete`に設定します．

![](/img/post/2023-01-17-notion-wbs-230117235803.png)

そうすると、表示形式(Show as)を設定できるようになりますので、`リング(Ring)`を設定します．

![](/img/post/2023-01-17-notion-wbs-230117235912.png)

これで完成です．

![](/img/post/2023-01-17-notion-wbs-230118000036.png)

ただし、この方法では子タスクがすべて終わっても、その親タスクは自動で `Done` にならないので手動で行う必要があります．それを自動化することも可能かもしれませんが、ご自身で調べてみてください．

:::caution
今回のようにロールアップを使って親、または子のプロパティを参照する場合、それがさらにその親、または子のプロパティを参照するといった循環参照をしてしまうとパフォーマンスに大きな影響があるため、制限されているとサポートから聞きました．階層が深くなってしまうとロールアップした値が異常な値になるため、階層レベルは3～4以下にしておくのが無難です．
:::

今回作成したWBSのテンプレートを公開しています．詳しくはテンプレートにある「はじめにお読みください」を参照してください．

<Bookmark name="WBS | mebiusbox.notion.site" url="https://mebiusbox.notion.site/WBS-c33e10534921465d93f6604948302c81" description="Notion用 WBS (Work Breakdown Structure)のテンプレートです" />

