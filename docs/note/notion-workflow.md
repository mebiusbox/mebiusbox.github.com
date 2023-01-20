---
title: Notionワークフロー
description: Notionを使って知識を管理するワークフローについて解説します
pagination_next: null
pagination_prev: null
---

import Bookmark from '@site/src/components/Markdown/WebBookmark.tsx'
import Tweet from '@site/src/components/Markdown/TweetBlock.tsx'


## Notionとは

簡単にいうと高性能なWikiに強力なデータベース機能が組み込まれたものです．基本はページを作成して，そのサブページを作っていく感じです．ただ，Notionはかなり直感的にコンテンツを作れます．テキストだけではなく，表や画像などかなり扱いやすいです．例えば，２段や３段といった段組が簡単に行えるし，Markdown 方式でもサクサク書けるのはとてもいい感じです．また，外部サービスとの連携も充実してきていて，様々なコンテンツをページに埋め込むことができます．

単純なプロジェクトのドキュメントなどでは Wiki のような運用で問題ないと思いますが，様々なコンテンツを含むナレッジベースのようなものを構築する場合には，Wiki ベースの管理方法は上手くいかないことはすでに分かっているので，Wikiのように使っていてはダメだと考えます．あくまで，個人的な意見です．それではどうするかということをこれから書いていきますが，その前にNotionについてもう少し知っておきましょう．

:::info
これから使う名称は必ずしも正しくありません．私が勝手に名前を付けているものもありますので注意してください．
:::

### ２種類のページ

基本としてページを作成していきます．ページの作成は **New Page** ボタン，または **Add a page** を押します．

![zenn_notion_newpage_framed](https://storage.googleapis.com/zenn-user-upload/a0db10bcb0e8-20220714.png)

Notionには２種類のページがあります．**通常ページ**と**データベースページ**です．新規ページを作成すると次の画面になります．

![zenn_notion_page_type_framed](https://storage.googleapis.com/zenn-user-upload/888453fdf71f-20220714.png)

データベースページは表，タスク，リスト，カレンダー，ギャラリーがあり，データベースにドキュメントの追加や削除をします．これが良く出来ていて，表やタスク，リストなどすべてが相互に切り替えることが出来ます．ビューを切り替える感じですね．実際，データベースにビューをいくつも設定できて，各ビューが表だったり，タスクだったりするわけです．

### ブロック

Notion の特徴にこのブロックがあります．簡単にいうと１文が１ブロックです．ブロックはテキスト，数式，画像，水平線，見出しといった様々な要素です．Notionではストレージの単位がブロック単位です．このブロックの入力が洗練されていて，通常はMarkdownで書くけど，スラッシュ（`/`）コマンドで選べたり，ショートカットを使ったりと，慣れるとかなり速く入力することができます．

### テンプレート

Notionはページを作成して，ブロックを作成していってコンテンツを作成します．２種類のページ，それにブロックを作成してある程度定形にまとめたものを**テンプレート**といいます．テンプレートは標準で様々なものが用意されていますし，自分で作ることもできるようです．

## ワークフロー

それでは一通り説明が終わったので，私なりのやり方を説明してみます．キーとなるのはデータベースページです．これを使って構築していきます．まずは空の通常ページを作成して，`DB` という名前をつけます．

![zenn_notion_db_framed](https://storage.googleapis.com/zenn-user-upload/256938358e1d-20220714.png)

その下に文書（メモ）用のドキュメントデータベースを作成します．サイドバーのDBページの右にある `+` アイコンをクリックすると，DBの子ページを作成することができます．

![](https://storage.googleapis.com/zenn-user-upload/200fe9655c06-20220714.png)

小ページを作成して名前を `Documents` とし，DATABASEの `Table` ページを作成します．

![](https://storage.googleapis.com/zenn-user-upload/78ff28c13337-20220714.png)

テーブルページを作成すると最初にビューの設定画面になります．まずはデータソースとなるデータベースを選択します．既存のデータベースを選ぶことも出来ますが，ここでは新規にデータベースを作成します．下の方にある `New database` を選択します．

![](https://storage.googleapis.com/zenn-user-upload/bbc6890996c0-20220714.png)

その後はオプション(View Option)を設定する画面になりますがそのまま作成します．すると次のようにテーブルビューが出来ます．

![](https://storage.googleapis.com/zenn-user-upload/8c0fbabe370f-20220714.png)

ドキュメントデータベース用にプロパティを作成します．カラム横にある `+` を選択して新規のプロパティを作成します．

![](https://storage.googleapis.com/zenn-user-upload/8d4eef17123f-20220714.png)

まずは `SubTags` を作成します． `Type` は `Multi-select` にします．

![](https://storage.googleapis.com/zenn-user-upload/d6c440b10345-20220714.png)

他にも以下のプロパティを作成します．

| Name | Type |
| ---- | ---- |
| Keywords | Text |
| Link | URL |
| Description | Text |
| Files | Files & media |
| Time | Created time |
| LastUpdated | Last edited time |

![](https://storage.googleapis.com/zenn-user-upload/ab7859a6c427-20220714.png)

プロパティが多いのでページに表示されるプロパティの設定をします．まずは Documents データベースにある適当なページを開きます．

![](https://storage.googleapis.com/zenn-user-upload/5a93cfa4afbd-20220714.png)

ページを開いたら右上にある `…` から `Customize page` を選択します．

![](https://storage.googleapis.com/zenn-user-upload/0391f123c17e-20220714.png)

ここではページに表示されるコンテンツのカスタマイズが出来ます．ページに表示されるプロパティの順番と，プロパティの表示条件を設定します．以下は私の設定です．ご自身でお好きなようにカスタマイズしてください．

![](https://storage.googleapis.com/zenn-user-upload/f28202826b73-20220714.png)

これでドキュメントデータベースの設定は終わりです．

$$
\tiny\bullet
$$

ドキュメントデータベース以外のデータベースページを `DB` ページに追加していきます．例えば，Movies とか，Design の資料とか．アイコンは適当です．

![](https://storage.googleapis.com/zenn-user-upload/c8c96b4b30a4-20220714.png)

次に，メインページを作成します．ダッシュボードみたいなものです．ダッシュボードページもドキュメントデータベースに入れていきます．名前は `Main` とし， `Tags` には `Dashboard` に設定します．

![](https://storage.googleapis.com/zenn-user-upload/4f06a19daa63-20220714.png)

作成した Main ページを開き，右上ににある `★` を押すとお気に入りページに指定されます．

![](https://storage.googleapis.com/zenn-user-upload/0ab11a3c8ecc-20220714.png)

お気に入りページにするとサイドバーのお気に入りのところに追加されて便利です．

![](https://storage.googleapis.com/zenn-user-upload/58b750cabd59-20220714.png)

Main ページにブロックを追加していきますが，ここで追加するブロックはデータベースの各ビューになります．

![](https://storage.googleapis.com/zenn-user-upload/49706497194a-20220714.png)

データベースブロックはページ全部を使う `FullPage` と通常ページに入れる `Inline` があります．データベースは DB ページに集約し， `Inline` データベースは通常通り各ページに埋め込む形にすると管理しやすくなります．ビューを作成することで，どのビューからも編集しているデータベースはそのビューでデータソースに選択されているデータベースになります．

![](https://storage.googleapis.com/zenn-user-upload/e2c278f78347-20220714.png)

これで Wiki のような階層構造ではなく，データベースによる管理方法になりました．

## ビューの活用

データベースによる管理になったわけですが，ドキュメントが 100, 1000 と増えていくと閲覧性が悪くなります．そこでビューを活用します．ビューはデータベースとは関係なく作れますが，元のデータベースにビューを作成しておくと，別のページでそのデータベースのビューを作成するときにコピーすることができます．

基本的にドキュメントは編集中のもの，編集が終わって後から検索して参照する２つに分けることができます．Mainビューでは編集中のもの，新規にページを作成することが主になりますので，これに合わせたビューを作成します．編集中のものには `draft` というタグをつけることにします．
Documentsデータベースの `Tags` に `draft` というタグを作成しておきます．

![](https://storage.googleapis.com/zenn-user-upload/91912293df72-20220714.png)

次にリストビューを作成します．

![](https://storage.googleapis.com/zenn-user-upload/2a86c5b5cace-20220714.png)

データソースには作成した Documentsデータベースを設定します．

![](https://storage.googleapis.com/zenn-user-upload/1607fa406b3a-20220714.png)

データソースを設定したら次はビューの名前とビュータイプの指定です．ここでは `Draft` という名前，ページタイプは `List` になっていることを確認してください．

![](https://storage.googleapis.com/zenn-user-upload/78b8daaa3dcd-20220714.png)

ビューの設定画面にある `Show database title` というのは左上のデータベース名を表示するかしないかを設定することができます．これは後からでも変更できます．

![](https://storage.googleapis.com/zenn-user-upload/fd87ca61477b-20220714.png)

次にビューオプションの設定画面になります．プロパティの設定で次のように表示するプロパティを選択します．

![](https://storage.googleapis.com/zenn-user-upload/33e56caca166-20220714.png)

後は標準のままでビューを作成します．

![](https://storage.googleapis.com/zenn-user-upload/eefd48118ee9-20220714.png)

Main ページに追加した Documents データベースのリストビューでフィルター設定を行います．
ビューの右上にある `Filter` を押して `Tags` を選択します．

![](https://storage.googleapis.com/zenn-user-upload/a9f35801e071-20220714.png)

そして `draft` のみ選択します．

![](https://storage.googleapis.com/zenn-user-upload/6e02d9b78878-20220714.png)

これでタグに `draft` が含まれているものだけが表示されます．フィルター設定のとき，既に存在するタグしか設定出来ないため，適当にドキュメントを作ってタグを作成しておきます．

![](https://storage.googleapis.com/zenn-user-upload/54ecc900b3e1-20220714.png)

このように，フィルタリングされた状態になり，編集中のページを開きやすくなっています．

## 検索

どうやら Notion の検索機能は貧弱のようです．そこで，少し工夫しておきます．基本的に検索するのは `Tags` と `Keywords` とします．検索はビューの右上にある虫眼鏡のアイコンをクリックすることで検索文字を入力することができます．

![](https://storage.googleapis.com/zenn-user-upload/8c40181e6c80-20220714.png)

## タスク

タスクを管理します．まずはDBページに `Board` のデータベースページを追加します．名前は `Task` とします．

![](https://storage.googleapis.com/zenn-user-upload/ef28f468de34-20220714.png)

データベースは `New database` を選択して新規に作成します．次のようなボードビューが作成されます．

![](https://storage.googleapis.com/zenn-user-upload/c2edc2b0e00c-20220714.png)

ステータスは最近追加されたステータスプロパティというものになっています．ボードビューでドラッグ＆ドロップすることでステータスを簡単に変更することができます．

![](https://storage.googleapis.com/zenn-user-upload/f521a54f92b4-20220714.png)

Main ページに Task データベースのカレンダービューを設置したいのですが，そのまえにカレンダービューに対応するために `Date` 属性を追加します．

![](https://storage.googleapis.com/zenn-user-upload/4a1cb2ea302f-20220714.png)

これで準備できました．早速 Main ページにまずはカレンダービューを作成します．データソースは作成した Task データベースを選択します．

![](https://storage.googleapis.com/zenn-user-upload/6e2b9b9c3e7c-20220714.png)

カレンダービューの日付に対応するための設定 `Show calender by` の項目が作成した `Date` プロパティであることを確認します．

![](https://storage.googleapis.com/zenn-user-upload/d61c9c0914f2-20220714.png)

適当にビューの名前をつけてビューを作成します．

![](https://storage.googleapis.com/zenn-user-upload/9775ea248bf4-20220714.png)

タスクの `Date` プロパティに日付を設定していればカレンダービューにも反映されます．

![](https://storage.googleapis.com/zenn-user-upload/f73657b1a801-20220714.png)

次にタスクのリストビューを作成します．

![](https://storage.googleapis.com/zenn-user-upload/ec52fe49a1a4-20220714.png)

フィルターの設定をします．

![](https://storage.googleapis.com/zenn-user-upload/204fe7397af3-20220714.png)

日付順でソートするように設定します．

![](https://storage.googleapis.com/zenn-user-upload/44a48f065bbc-20220714.png)

使いやすいように他のビューを作成してフィルターやソートの設定をしてみてください．

## ここまでのまとめ

新しく管理するデータベースをDBページに追加します．Main ページおよびそのサブページなどでビューブロックを使って参照します．ドキュメントは Documentsデータベースに作成していきます．ダッシュボードページも Documents データベースに入れていきます．基本はこの流れです．

## Inbox データベース

Web Clipper や Twitter などのSNSからの共有にも Notion は使えます．そういったサービスからの入力は `Inbox` データベースに突っ込んでいきましょう．新規のデータベースページを作成して，Inbox と名前をつけます．

![](https://storage.googleapis.com/zenn-user-upload/f58e49e82ef2-20220714.png)

現在のデータベースの構成は次のようになっています．

![](https://storage.googleapis.com/zenn-user-upload/7b4a6c747286-20220714.png)

ブラウザの拡張機能 `Notion Web Clipper` から `Save To Notion` を使うときに保存先のデータベースに作成した `Inbox` を指定します．

![](https://storage.googleapis.com/zenn-user-upload/21883e683380-20220714.png)

:::info
`Save To Notion` を使って保存するときにタグなどの情報を同時に設定できません．その場合は保存してから Notion でページを開いて設定します．
:::


## 最終的なページ構成

ということで，DB ページ以下に各データベースがあるだけの構成になります．各ページはいずれかのデータベースに含まれています．大分スッキリしていると思います．

![](https://storage.googleapis.com/zenn-user-upload/fe6aa26c1a28-20220714.png)

:::info
Inbox や Documents，Design など何もかも１つのデータベースにまとめてもいいのではと思った方もいるかもしれません．それに関して率直な意見として，「あまりデータベースをまとめないほうがいい」ということです．１つのデータベースにまとめるとどうなるかというとプロパティの数がどんどん増えていくという問題があります．プロパティの数が多くなりすぎると管理が大変になるので，１つの目安としてプロパティの数が一定の数を超えるような場合には分けたり，または合体させないことを検討した方がいいと思います．例えば，新しいビューを作るとすべてのプロパティが全表示状態になるので，設定するのが面倒だったり，選択するときに多すぎてわかりづらいという懸念があります．あとは，今は改善されているのですが，一時期 Notion のデータベースの Tableビューのプロパティ表示でひどい時期がありました (`注1`)．プロパティを非表示にしていると，各項目のプロパティ値は表示はされないんですが，プロパティのカラム領域は表示されてしまうということがあって，これのせいでプロパティが多いほど横長の表となってしまい非常に使いづらいということがありました．そのときは，なるべく余計なプロパティは作らない，つまりデータベースはなるべくまとめないようにしなければなりませんでした．結局，データベースの運用をどのようにするかによって変わってくるので，各個人または組織で良い度合いを探っていくしかないと思います．ちなみに，個人で使う分にはテーマごとに分けるのが丁度良い感じになるかと．
:::

:::info
データベースの分割度合いに関してはテーマごとに分けるのと，もう１つの基準として Documents データベースに入れられるかどうかがあります．Documents データベースに追加のプロパティが必要であれば新規にデータベースを作成するというやり方もありかと思います．
:::

`注1` テーブルビューのプロパティ表示バグ（現在は修正済み）
<Tweet url="https://twitter.com/morenomorenado/status/1426199897313796097" />

## 便利な機能

ここでは，Notion にある便利な機能をいくつか紹介します．

### 絵文字

Notion では絵文字をサポートしています． `/emoji` と入力したり，Windows なら `Win+.` で簡単に入力することができます．あまり使いすぎると逆に見づらくなるかもしれませんが，上手く使うことで文書がとても見やすくなります．例：

![](https://storage.googleapis.com/zenn-user-upload/adf639b9b1d3-20220301.png)

また，ページについては

- 📘まとめページ．体裁の整ったもの，公開ページ．
- 📝編集中

あと，データベースの新規ドキュメントでアイコンを指定しない場合は断片的なメモ

![](https://storage.googleapis.com/zenn-user-upload/fbf2d226b59a-20220301.png)

という感じで，使っています．

$$
\tiny\bullet
$$

### Toggle list, Callout, Gallery(DB), Board(DB)

Notion では，これらを使いこなすことでレイアウトやデザインを良くすることができます．ユーザーが公開しているテンプレートを見てみるとこれらをうまく使っているケースが多いかなと思います．

まず，Toggle list は折り畳み可能なブロックです．

![](https://storage.googleapis.com/zenn-user-upload/1435b993ee47-20220301.png)

Toggle list を並べる場合は，色をつけると視認性が少し良くなります．

![](https://storage.googleapis.com/zenn-user-upload/14927869e5a6-20220304.png)

次に Callout はアノテーションなどに使います．

![](https://storage.googleapis.com/zenn-user-upload/63d05c3873da-20220301.png)

この Toggle list と callout を組み合わせることでレイアウトを整えていきます．

![](https://storage.googleapis.com/zenn-user-upload/7ee8cc812a8e-20220301.png)

このように Callout の背景色を設定して，中に Toggle list を入れていくといった感じで作成します．もちろん，さらに入れ子にも出来るし，インラインデータベースだって入れることができます．

これ以外に Database の Gallery ビューを使ってレイアウトする方法があります．

![](https://storage.googleapis.com/zenn-user-upload/a991e9d830c5-20220301.png)

この場合は，データベースのオプションから `Properties` を選択， `Card preview` を `None` ， `Card size` を `Small` に設定します．

また，データベースの Board ビューもページナビとして使いやすいです．

![](https://storage.googleapis.com/zenn-user-upload/438a485c8036-20220304.png)

:::info
データベースの背景色は直接設定することはできませんが，Toggle list や Callout の中にデータベースを含めることで，擬似的に背景色を設定することができます．この場合，背景色は Toggle list や Callout 側で指定します．
:::

### Synced Block

同期ブロックというもので，異なるページ間でもブロックコンテンツを共有することができます．これを利用して，各ページのサイドページ部分を作るといったことができます．適当なダミーページを作成して，そこに段組した状態のサイドページ部分を Synced Block で作成します．あとは各ページにそれを埋め込んでいくような形になります．

$$
\tiny\bullet
$$

### Table

データベースページとは異なるもっと単純な表を作成することができます．以前はデータベースを作らなければいけなかったのですが，こちらを使いましょう．

![](https://storage.googleapis.com/zenn-user-upload/30a995cb2402-20220304.png)

テーブルは本当に単純に出来ているので，実際に使ってみると機能が足りないと感じることがあります．例えば，一括で行を削除できなかったり，セルの操作が微妙にやりづらかったりします．その場合は，一度データベースに変換してから編集してみてください．テーブルからデータベースに変換するコマンドが用意されています．

![](https://storage.googleapis.com/zenn-user-upload/16c735fd08ef-20220306.png)

データベースに変換すると次のようになります：

![](https://storage.googleapis.com/zenn-user-upload/e4ed4e37c2b1-20220306.png)

あとはデータベースの状態で編集してから，テーブルに戻します．

![](https://storage.googleapis.com/zenn-user-upload/e7b0dc0dcc8e-20220306.png)

:::caution
この方法の注意として，テーブルに行ヘッダーがなければ勝手に追加されてしまうことです．また，データベースの状態でフィルターやソートなどの指定をしても，テーブルに戻すとリセットされます．
:::

$$
\tiny\bullet
$$

### リマインド機能

データベースのプロパティに `Date` タイプを追加すればリマインド機能を利用することができます．

![](https://storage.googleapis.com/zenn-user-upload/595f3795f34e-20220716.png)

指定した日付からどれくらい前に通知するかを選択することができます．ブラウザやデスクトップでは `All Updates` のところで知らせてくれます．スマホアプリの場合だとプッシュ通知されます．

![](https://storage.googleapis.com/zenn-user-upload/74f6bb2af22e-20220716.png)

$$
\tiny\bullet
$$

### 数式

今では，ブロックおよびインラインでの数式がサポートされています．実は数式は `TeX` で入力するのですが，これを使ってレイアウトに生かすことができます．

$$
\LARGE\textbf{\textsf{Header}} \\ \large\textsf{Sub Heading}
$$

```latex
\LARGE\textbf{\textsf{Header}} \\ \large\textsf{Sub Heading}
```

また，このページの先頭にある `CONTENTS` の部分にも使っています．

背景色を設定するにはコツがあって，まず空のブロックを作成して先に背景色を設定します．そしてコンテンツには数式を入力しておいて，最後に `Turn into` で数式ブロックに変換します．

$$
\tiny\bullet
$$

今度はインライン数式を使ったちょっとしたテクニックを紹介します．これを使うと文書内にマーカーっぽい表現を行うことができます．ただし，本来のインライン数式の使い方ではないので，多用は禁物ですし，将来的に使えなくなる可能性も否定できません．

本来，Notion 上でのテキストの色や背景色は特定の種類しか設定することができません．ですが，インライン数式を使うことで $\color{#FFF}\colorbox{#DD4A48}{\textsf{こんにちは！}}$ というようにユーザーが指定した色の背景色を設定することができます．Notion の標準の赤背景ですと こんにちは！  (この部分は Notion だと背景色が変わっています）というようになります．これを使うことで， $\color{#191919}\colorbox{#FFE162}{\textsf{黄色}}$ ， $\color{#191919}\colorbox{#86C6F4}{\textsf{青色}}$ といったことが可能です．これは次のような数式になっています：

```latex
\color{#FFF}\colorbox{#DD4A48}{\textsf{こんにちは！}}
```

また，インライン数式なので，データベースのプロパティに設定することができます．

![](https://storage.googleapis.com/zenn-user-upload/fb822d86e296-20220301.png)

インライン数式やブロック数式は汎用性が高いです．他にも，本文で使われている次の区切りも数式ブロックです：

$$
\tiny\bullet
$$

### データベースでの進捗ゲージ

データベースには `Formula` という数式プロパティを利用することができます．これを使って進捗ゲージを自動で示すことができます．表現方法は様々なので色々探してみてください．例えば

![](https://storage.googleapis.com/zenn-user-upload/d2726adc9f37-20220301.png)

上記の Formula は下記の通りです：

```jsx
if(not empty(prop("Completed")) and not empty(prop("Tasks")), slice("■■■■■■■■■■", 0, floor(10 * prop("Completed") / prop("Tasks"))) + slice("❒❒❒❒❒❒❒❒❒❒", 0, 10 - floor(10 * prop("Completed") / prop("Tasks"))) + " " + format(floor(100 * prop("Completed") / prop("Tasks"))) + "%", "")
```

興味があれば以下のサイトも見てみてください．いろんな進捗ゲージを表す数式がまとまっています．

https://www.redgregory.com/notion/2021/6/4/17-progress-bar-designs-in-notion

$$
\tiny\bullet
$$

### データベースで特定のデータをピン留め

データベースのデータ数が増えてくると，最初に表示される数が制限されることがあります．最初に表示される最大数はデータベースのプロパティで選択することができます．データベースで一括管理しているデータ数が多くなってくるので最初に制限された状態で表示されることも多くなってくることがあります．その場合はフィルターなどで調整するのですが，それとは別に常に特定の項は先頭に表示することができると便利です．ここではその方法を紹介します．例えば次のようなデータベースを作成します．このデータベースにはデータ数が 10 個以上あり，プロパティで最大 10 個表示に設定しています．

![](https://storage.googleapis.com/zenn-user-upload/823c7a047342-20220301.png)

初期状態だと最大 10 個しか表示されておらず， `Load 50 more` をクリックすると表示されるデータ数が増えていきます．このデータベースがすべて表示された状態は次のとおりです．

![](https://storage.googleapis.com/zenn-user-upload/971f28f1fcd3-20220301.png)

ここで `Game` は初期だと非表示状態ですが，これを常に先頭の方に位置するようにしてみます．

まず，新規に `Pin` という項目を `Checkbox` で作成します．

![](https://storage.googleapis.com/zenn-user-upload/22147e9e47c8-20220301.png)

作成したら `Game` の `Pin` にチェックをつけます．

![](https://storage.googleapis.com/zenn-user-upload/23db119d66ed-20220301.png)

次にソートを追加します． 対象を `Pin` ，順番を `Descending` に設定します．

![](https://storage.googleapis.com/zenn-user-upload/eab1f40c1570-20220301.png)

これで， `Game` が先頭に来ます．

![](https://storage.googleapis.com/zenn-user-upload/74e309e71d15-20220301.png)

あとは， プロパティから `Pin` を非表示にして完了です．

![](https://storage.googleapis.com/zenn-user-upload/5926d6aaf263-20220301.png)

もし，ソート条件を追加する場合は `Pin` の条件が一番上になるようにしてください．

![](https://storage.googleapis.com/zenn-user-upload/2afa9f69a71b-20220301.png)

ピン留めしていることをわかりやすくするために絵文字を入れるのもありだと思います．

![](https://storage.googleapis.com/zenn-user-upload/ce5ac380bbc1-20220301.png)

$$
\tiny\bullet
$$

### データベースの項目を一気に全画面表示で開く

Notion のデータベースはページの集まりです．各データはページとして開くことができます．普通はデータの `Name` プロパティにカーソルを合わせて `OPEN` (開く) をクリックします．

![](https://storage.googleapis.com/zenn-user-upload/72e68ea00be3-20220723.png)

:::info
2022年７月のアップデートで「開く」にサイドピークおよびフルページで開くオプションが追加されました．詳しくは[こちら](https://www.notion.so/help/views-filters-and-sorts#open-pages-as)．
:::

デフォルトではサイドピークになっています．これは画面の右側にプレビューが表示されます．全画面表示するには，プレビューモードから左上にある `Open as full page` をクリックする必要があります．

![](https://storage.googleapis.com/zenn-user-upload/cef921afb315-20220723.png)

`Open` ボタンをサイドピークではなくフルページで開くように設定することができます．

![](https://storage.googleapis.com/zenn-user-upload/75ceda872758-20220723.png)

サイドピークも便利なため場合によって使い分けられると便利です．残念ながら現在はどちらかしか選べません．ちなみに `Ctrl` キーを押しながら開くと新しいウィンドウで開きます．

サイドピークをデフォルトとすると，一度プレビューを開いてから，全画面表示と２回遷移する必要があるため，とても無駄に感じることがあります．そこで，ビューから直接全画面表示する方法を紹介します．

まず `URL` プロパティを使ってページのリンクを設定する方法が考えられます．これはページのリンクをコピーして貼り付けるだけなのでとても簡単です．ただし，ブラウザ上で作業している人ならこれで十分なのですが，Desktop版を使用している場合はこれではできません．プロパティにはブロックを含めることはできませんが，インラインなら使えるものがあります．まずはテキスト形式のプロパティを作成します．ここでは `Full Mode` としました．そこに `@` や `[[` を使って対応する項目へのリンクを作成します．

![](https://storage.googleapis.com/zenn-user-upload/f8b959ae00ae-20220301.png)

あとはリンクをクリックすれば一気に全画面表示で開くことができます．ただし，この方法は Table ビューでしか使えないので注意してください．とはいえ，開くページのコンテンツが大きいほど，プレビューモードを経由して全画面表示すると無駄な処理が増えるので，あらかじめ全画面表示するつもりなら，こちらのほうが手っ取り早いとは思います．

:::info
上記以外でも，テキストや絵文字にページへのリンクを設定することも可能です．さらにトリッキーなことをすると，一度リンクを設定したテキストや絵文字を Name プロパティにコピペすることも可能です．絵文字に設定すれば見た目的にスッキリするので悪くない方法ですが，ちょっと手間になります．
:::

:::info
この後で紹介する notion-enhancer にある `bypass preview` という拡張機能を使うと， `OPEN` で開けば，常にプレビューモードを経由せずに全画面表示するように変更することは可能です．ただ，場合によってはプレビューモードの方がいいこともあるため，状況に合わせて使い分けてみてください．
:::

:::info
プレビューを開いた状態でショートカットキー `Ctrl+Enter` でも `Open as full page` と同様にページを開くことが出来ます．
:::

$$
\tiny\bullet
$$

### データベースの最近更新された項目を表示する

新規にデータベースを作成したときの標準ビューにおけるソートは厳密な項目の作成順になっているようです．データベースの最近更新された項目を表示するには，データベースのプロパティから `Last edited time` を追加してソートするように設定すれば出来ます．

:::info
データベースのプロパティで `Created time` を追加してソートするようにした場合，標準ビューとは異なる順番になる場合があります．`Created time` でソートするほうは年月日は良いのですが，時間は無視しているように見えます．
:::

$$
\tiny\bullet
$$

### データベース内の特定のタグ（マルチセレクト）が設定されたページをカウントする

ステータスプロパティを使うことで簡単にカウントできるようになったのですが，既にマルチセレクトで構築してあるデータベースをステータスプロパティに切り替えるのが難しい場合があります．ステータスプロパティは３種類（`To do`, `In Progress`, `Complete`) のグループのみとなっているので，すべてのマルチセレクトがステータスプロパティに置き換えられるわけではありません．

個人的に思いついた方法として２種類紹介します．

### フィルターを使ってカウント

例えば Table ビューなどの下部には集計値といった値を表示する機能があります．フィルターでカウントしたいタグを設定して，ここの集計値で確認します．

![](https://storage.googleapis.com/zenn-user-upload/210d8e0cb9e5-20220719.png)

これがお手軽ですが，一度に１つのカウントしか確認出来ないため，ビューを作成したり，毎回フィルターを設定したりする必要があります．なにより一度に複数のカウントを確認することができません．（ビューブロックそのものを複数配置というのもありえなくはないですが…）

### Relation, Rollup, Formula を使ってカウント

そこで，少しトリッキーな方法です．

1. 集計対象のデータベース（`SampleDB`）があるとします．
2. 集計用のデータベース（`SampleDBCount`）を作成します．
3. この２つを Relation で接続します（`※1`)．
4.  `SampleDBCount` で適当な項目（ここではとりあえず `ALL` とします）を作成します．
5. `SampleDB`でかつ集計対象としたいページに Relation で設定した項目の値を `ALL` に設定します．
6. `SampleDBCount` で，Rollup プロパティを作成し，`SampleDB` のタグ（マルチセレクト）を選択します．計算は「オリジナルを表示する (Show Original)」 を選択します．
7. `SampleDBCount` にカウント用のプロパティを Formula タイプで作成します．例えば，`ToDo` というタグのカウントをしたい場合は次のような数式を設定します： `(length(prop("Tags")) - length(replaceAll(prop("Tags"), "ToDo", ""))) / length("ToDo")`

`※1`: `SampleDB` と `SampleDBCount` のリレーション

![](https://storage.googleapis.com/zenn-user-upload/adce0275cb96-20220719.png)

結果は次のようになります：

![](https://storage.googleapis.com/zenn-user-upload/04bdb4207e94-20220719.png)

何をしているかというと，ロールアップによって対象のページの全てのタグが１つにまとめられます．重要なのは，ロールアップの計算を「オリジナルを表示」に設定することで，設定されているタグが重複関係なくすべて１つにまとめられます．それは Formula から１つの文字列として参照できます．そこで，数式では文字列からカウントしたいタグの文字列を置換して削除し，削除前と削除後の文字数の差分を使ってカウントを求めています．これでカウントしたいタグ（マルチセレクト）ごとにプロパティを作成して数式を設定すれば一度に複数のカウントを確認することができます．ただし，この方法の欠点として次のようなものがあります：

- カウントしたいタグ（マルチセレクト）の文字が他のタグに含まれているような場合には上手くいきません．具体的には例えば，`notion` というタグをカウントするときに `notiontwt` というタグがある場合には上手くいかない
- 複数タグでカウントすることは出来なくもないですが数式が複雑になる
- 集計対象のデータベースにリレーションする必要がある

あらかじめ集計するということがわかっていればマルチセレクトではなく別にデータベースを作成してリレーションし，ロールアップしておけば苦労せずに済みます．ただ，セレクト側の数が多くなるとリレーションプロパティを設定するときに項目の表示に時間がかかるようになったり，見た目的にもマルチセレクトの方が好みだったりします．

$$
\tiny\bullet
$$

### トグルヘディング

トグルヘディングとは，見出しがトグルリストになったものです．通常の見出しではなくトグルヘディングを使うと画面がスッキリして整理しやすくなります．個人的にオススメなブロックです．

$$
\tiny\bullet
$$

### マルチカラム作成

マルチカラムブロックの作成が一気にできるようになったみたいです．

![](https://storage.googleapis.com/zenn-user-upload/3a6451f510ae-20220714.png)

$$
\tiny\bullet
$$

### テンプレートボタン

例えば，あるタスクのToDoをまとめて作成してタスクの消化をしたい場合があるかもしれません．そのタスクがデイリーだったり，慣習的に行われるものならば，毎回ToDoのチェックボックスを作成するのは面倒です．Todoが沢山あるなら尚更です．そこで，Notion にはテンプレートボタンという機能があります．あらかじめ指定したテンプレート（ブロック群）を用意しておき，ボタンを押すと一発で作成してくれるものです．使用するには `/button` または `Template Button` ブロックを作成します．

テンプレートボタンで作成するブロックは単一ブロックでも問題ないので，例えば単純な ToDo リストやそれ以外のリストでよく追加・削除をする場合にはテンプレートボタンを配置したほうが楽な場合があるかもしれません．テンプレートボタンで作成したブロックはボタンの直下に作成されますので，水平線を置いておくと，どこまでがボタンで作成されたものなのかわかりやすくなります．

$$
\tiny\bullet
$$

### カラーサンプル

![](https://storage.googleapis.com/zenn-user-upload/c8cf90d21dc1-20220301.png)

![](https://storage.googleapis.com/zenn-user-upload/77312c092af2-20220301.png)

![](https://storage.googleapis.com/zenn-user-upload/ca875c543972-20220301.png)
    
![](https://storage.googleapis.com/zenn-user-upload/66b5db0060ce-20220301.png)

$$
\tiny\bullet
$$

### カバー

ページの先頭にはアイコンやカバーを設定することができます．自分で画像を用意することになりますが，例えば以下のようなサイトでおしゃれなカバーを作成することができます．

https://covercons.vercel.app/


$$
\tiny\bullet
$$

### アイコン

Notion には絵文字がありますが，アイコンも文書の見栄えを良くするために利用できます．また，Notion 用に使いやすいアイコンが多く公開されています．

https://pablom.io/resources/icons

https://www.notion.vip/icons/

https://super.so/icons

https://notionv5.vyshnav.xyz/


これらを使うとこんな感じで調整できます：

![](https://storage.googleapis.com/zenn-user-upload/b867794e703c-20220301.png)

:::caution
このようなアイコンは，ライトテーマ用とダークテーマ用にそれぞれ用意されている事も多いです．個人用途だったら特に問題はないと思いますが，多人数で共有している場合は，人によって使用しているテーマが違うことがあるので注意が必要です．
:::

:::info
テンプレートなどを見てみると絵文字にはない小さなアイコンが設定されているものを見かけることがあります．これはページに設定されているカバーアイコンが小さく表示されています．ページへのリンクを作成するときにテキストと絵文字を組み合わせるのもいいですが，独自のアイコンを使いたい場合はインラインのページリンクを作成して，そのページのカバーアイコンで独自の画像を設定することができます．
:::

$$
\tiny\bullet
$$

### ダークテーマ

Notion にはダークテーマが用意されています．設定から全体に対して適用できたり，ページを開いている状態で `Ctrl/Cmd+Shift+L` で切り替えることができます．ただ，最近のダークテーマは変更が頻繁で人によっては見やすくなったり見づらくなったりと全く安定していません．なので，色を設定するときは気をつけたほうがいいです（例えば，Brown, Orange, Yellow を混ぜて使わない，Pink と  Red も同様といった感じです）．

$$
\tiny\bullet
$$

### Stylus

Notion のデザインはライトテーマだと問題ないのですが、ダークテーマはどうも視認が悪いです．泥色っぽくイマイチです．また、フォントも日本語は見やすいとは言えません．そこで、ブラウザの拡張機能を使ってカスタマイズします．いくつか方法がありますが、ここでは Stylus の方法を解説します．Stylus は Chrome の拡張機能で指定のURLごとおスタイルシートをカスタマイズすることができます．

:::caution
この方法はWeb版Notionを利用している場合に有効です
:::

まず、新規スタイルを作成して「ドメイン上のURL」を`notion.so`に設定します．
以下に各設定を記述します．ダークテーマでの設定です．`!important`を忘れずに．

```css
/* サイドバーの設定 */
div.notion-dark-theme .notion-sidebar-container {
  ...
}
/* 背景 */
div.notion-dark-theme .notion-frame {
  ...
}
/* フォント */
div.notion-dark-theme div {
  ...
}
/* コードブロック */
div.notion-dark-theme .notion-code-block * {
  ...
}
/* 引用 */
.notion-dark-theme .notion-quote-block {
  ...
}
/* スクロールバー */
div.notion-darkt-theme .notion-scorll::-webkit-scrollbar {
  ...
]
```

$$
\tiny\bullet
$$

### 日付ウィジット

個人的に欲しかったので作成しました．すでにサードパーティ製であるのですが、登録が必要だったので．また、お手軽に作れることもわかったので試してみました．
下記の４種類があるので、お好みのものをコピペして埋め込みブロックを作成してください．
ただし、Windowsでしか確認していないので、MacOSでは見た目が大きく違うと思います．

![](https://storage.googleapis.com/zenn-user-upload/c088bf74e443-20221001.png)

```
https://mebiusbox.github.io/notion_widget/
```

![](https://storage.googleapis.com/zenn-user-upload/929eb78f5bd3-20221001.png)

```
https://mebiusbox.github.io/notion_widget/mmdd.html
```

![](https://storage.googleapis.com/zenn-user-upload/668542c62d97-20221001.png)

```
https://mebiusbox.github.io/notion_widget/ja.html
```

![](https://storage.googleapis.com/zenn-user-upload/f69cbe7db533-20221001.png)

```
https://mebiusbox.github.io/notion_widget/mmdd_ja.html
```

:::caution
将来的にこのURLは無効になる可能性があります．
:::

$$
\tiny\bullet
$$

### 入力支援

定型文などの入力に入力支援ソフトを使用しているのですが，それを Notion で使用する場合，特に数式ブロックなどの場合はどうすればよいでしょうか．それは `/turnblock` を使います．例えば，次のように使います．

```
\small\bullet/turnblock
```

$$
\tiny\bullet
$$

### 検索キーワード

ページをお気に入りに設定してサイドバーからページにアクセスする方法も悪くはないのですが， `Ctrl+P` の検索を使ってキーボード操作で特定のページにアクセスできると結構楽です．とはいえ，ページ名だけでなくコンテンツ内の文字も検索対象になってしまうので，少し工夫が必要です．個人的に使っているのは該当ページに `..{key}` というようにつけています．例えば Main ページには `Main..ma` とすることで `..ma` で検索のトップに表示されやすいです．`@` とかも考えたのですが，これはメンションになるので不採用としました．

$$
\tiny\bullet
$$

## Tips

<Tweet url="https://twitter.com/NotionHQ/status/1201643288215711746" />
<Tweet url="https://twitter.com/NotionHQ/status/1187803533975969792" />
<Tweet url="https://twitter.com/NotionHQ/status/1191491580282228737" />
<Tweet url="https://twitter.com/NotionHQ/status/1188941028205744134" />
<Tweet url="https://twitter.com/NotionHQ/status/1204524791706902528" />
<Tweet url="https://twitter.com/NotionHQ/status/1471887587950272515" />
<Tweet url="https://twitter.com/shogocat/status/1504201337960996864" />
<Tweet url="https://twitter.com/TomFrankly/status/1509556530294804486" />

## Shortcuts

https://www.notion.so/help/keyboard-shortcuts

https://www.notion.so/Learn-the-shortcuts-66e28cec810548c3a4061513126766b0

https://cheatsheets.namaraii.com/notion.html

https://imdave.notion.site/imdave/Notion-Shortcuts-dcb67fede8b24d6bb5fe2c0cae775d9a


## Integrations

https://notionintegrations.com/

https://apption.co/

https://notionlytics.com/

https://indify.co/


## Notionの活用

私は次のような感じで Notion を使っています．

![](https://storage.googleapis.com/zenn-user-upload/0ac95d93cbd3-20220714.png)

また，スマホやタブレットでは外部記憶装置として Notion を使っています．

## 最後に

例えば，１つのプロジェクトのドキュメント管理，または攻略サイトのように１つのテーマに絞って情報をまとめあげる場合には Wiki で十分な場合もあります．ただし，個人・団体における集合知のようなナレッジベースを構築する場合には Wiki のような階層型による管理方法では必ず破綻します．なので，それぞれの扱うテーマごとにダッシュボードページを作成し，DB以外のすべてのページが必ずDB以下のデータベースのどこかに含まれているように管理を徹底することをオススメします．そのため，Linked Page や View を多用しましょう．ただし，あるページのサブページもすべてDBに含めなければいけない，という訳ではありませんので注意してください．

Notion を使ってもう２年ぐらい経ちました．かなり重宝していますが，最近ちょっと動作が重いかなと感じるようになったのが懸念です．参考になれば幸いです．

<Bookmark name="Notion - One workspace. Every team." url="https://www.notion.so/?r=9dd2164b43634715ab450cdf6b3e7dce" description="招待ページです" />

