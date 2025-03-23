---
title: VS CodeとmdBookとObsidianを使った環境
description: VS CodeとmdBook、Obsidianを使ったドキュメント管理について
keywords:
  - Visual Stuio Code
  - mdBook
  - Obsidian
  - Notion
category: note
authors: [mebiusbox]
tags: [VS Code,mdBook,Obsidian,Notion]
image: https://og-image-mebiusbox.vercel.app/api/og?title=VS+Code%e3%81%a8mdBook%e3%81%a8Obsidian%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%9f%e7%92%b0%e5%a2%83&subtitle=VS+Code%e3%81%a8mdBook%e3%80%81Obsidian%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%9f%e3%83%89%e3%82%ad%e3%83%a5%e3%83%a1%e3%83%b3%e3%83%88%e7%ae%a1%e7%90%86%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2025%2F03%2F23&tags=VSCode,mdBook,Obsidian,Notion
---

ドキュメント管理の方法として VS Code、mdBook そして Obsidian を組み合わせて使う方法について解説します．

<!-- truncate -->

最近、VS Code と mdBook 以外に Obsidian も導入したので、それについてここにまとめておきます．

:::info
まだ、Obsidian を試しに導入したばかりなので、まだわからないことが多いです．
:::

## Notionについて

まず、Notionについて少し触れておこうと思います．Notionは主にInputとして使っていて、いろんな情報をとりあえずまとめておきたいときに使っています．
データベースをうまく使ってまとめていたり、タスクやカレンダーなどの機能も使って重宝しています．

とても便利なのですが、一方で、いくつか不満もあります．

- 編集しづらい
- 表示が遅い
- ページが表示されないことがある

やはり編集する場合はVS Codeなどのエディタに慣れているとどうしても不満があります．これは Notion の問題というより、ブラウザまたはネイティブアプリ全般に共通していることなので仕方ありません．基本的にブラウザで編集していますが、Stylusでカスタマイズすることで何とかマシになっています．

あと、とくにコード編集がイマイチで、これに関しては少しずつ改善されてきていますが、まだまだといった感じです．たとえば、2行目から先頭行にカーソルを移動したいのに、上のブロックにカーソルが移動してしまったり．今は改善されましたが、1行目とシンタックスハイライトの言語がかぶって見えずらかった時期もありました（そのため、意図的に先頭に空行を入れていたり）．

表示が遅い件については、多少環境に依存しているところもあるのですが、ページを開くと数十秒以上かかることがあります．データベースビューの場合は結構待たされることが多い気がします．ページを細かくしてしまうと、ページ遷移だけでも遅く感じるのでなるべくまとめておきたくなるぐらいです．これは、無料版を使っている影響もあるかもしれません．

最後に、一番の問題はページが表示されないことがあることです．いつまでたっても表示されないことがときどきあります．とくにサーバーが落ちている訳でもないのにです．この状況になると1時間近く見られないこともありました．謎ですが、結構致命的な問題です．なので、Notionをメインに扱うことは避けるようになってきました．

これまで、いくつか不満な部分を挙げましたが、それでも便利なのは間違いありません．

## VS Code + mdBook

入力として Notion を使っているのですが、ある程度資料が溜まりだすと情報が細分化されすぎてて管理しづらくなります．
なので、最終的にはある程度まとめて本としてまとめあげることが多いです．Zennで本としていくつも執筆して公開しているようにです．

その場合は、VS Code と mdBook を使って書いています．VS Codeのビルトイン機能であるブラウザ機能を使えば、backendにmdBookを使ったドキュメント管理をVS Code上でできます．もちろん、ビルドしたものを外部ブラウザで表示したり、PDFとして出力することも簡単にできます．

これで本としてドキュメントをいくつも管理しています．

ただ、開発全般の本をまとめているときに不満が出てきました．やはり、木構造で管理するため、分岐が多くなってくると不便に感じます．
とはいえ、編集環境そのものは今のままでいいと思っています．今、問題なのはmdBookで作成したドキュメントの「閲覧」をもっとお手軽かつ素早く行えることです．

## Obsidian

そこで、Obsidianに目を付けました．実は何回かインストールしては消していたりしていました．毎回、Notion や mdBook でいいよね、って感じます．
今回はただの「ビューア」として利用することにしました．

基本的にReaderモードで使います．ただ、デイリーログがとてもやりやすいのでその機能だけ有効にしています．他の不要なものは無効にしています．

ある程度セットアップが終わったら、思った以上に悪くなかったのでしばらく様子見することにします．以下は、Obsidianを導入する際にインストールしたプラグインや気になったところをまとめます．

### コアプラグイン

| Plugin              | Enable/Disable |
| ------------------- | -------------- |
| Audio recorder      | Disable        |
| Backlinks           | ✅Enable       |
| Bookmarks           | ✅Enable       |
| Canvas              | Disable        |
| Command palette     | ✅Enable       |
| Daily notes         | ✅Enable       |
| File recovery       | Disable        |
| Files               | ✅Enable       |
| Format converter    | Disable        |
| Graph view          | Disable        |
| Note composer       | Disable        |
| Outgoing links      | ✅Enable       |
| Outline             | ✅Enable       |
| Page preview        | Disable        |
| Properties view     | Disable        |
| Publish             | Disable        |
| Quick switcher      | ✅Enable       |
| Random note         | Disable        |
| Search              | ✅Enable       |
| Slash commands      | Disable        |
| Slides              | Disable        |
| Sync                | Disable        |
| Tags view           | ✅Enable       |
| Templates           | ✅Enable       |
| Unique note creator | Disable        |
| Web viewer          | Disable        |
| Word count          | Disable        |
| Workspaces          | Disable        |

### コミュニティプラグイン

| Plugin         | Description                |
| -------------- | -------------------------- |
| Calender       | カレンダー機能             |
| Dataview       | データ抽出                 |
| Incremental ID | 固有ID                     |
| Meta bind      | カスタムボタン             |
| Templater      | テンプレート               |
| Thino          | デイリーログ               |
| Tray           | システムトレイ、ホットキー |

以下は、試したけど不採用だったもの．

| Plugin                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| Admonition             | mdBookと互換がない                                 |
| Another Quick Switcher | 標準のもので十分だった．高性能だけど表示がみづらい |
| Show Whitespace        | なぜかコードブロックの表示がおかしくなる           |

### Frontmatter

ObsidianではFrontmatterに色々な情報を設定することでタグなどプロパティを設定できるが、mdBookは標準でFrontmatterをそのまま表示するので、対応が必要．
これに関しては、以前にmdBookのFrontmatterを処理するものを書いていたので問題にならなかった．

### mdBookと共存

mdBookの `src` フォルダを Obsidian の Vault に設定しているけど、とくに問題はなかった．

### タブサイズ

Obsidian ではハードタブを使うとプラグインが動作しないものがあったので、スペース一択．そして、スペースの幅を2にしたいけど、強制で4スペースになる．

### ホットキー

コミュニティプラグインの `Tray` を使うことで表示・非表示を簡単に切り替えられる．

### 見た目のカスタマイズ

CSSで問題なくできた．プレビューだけでなくそれ以外の部分もフォントはもちろん大きさも変えられる．ある程度文字のサイズを大きくしないときつい．

### カラーコードがタグとして認識される

色の管理をしていて、 `#123456` などと書いているものがあるけど、これがタグとして認識されてしまう．
インラインコードにしているものは無視してくれるけど、VS Codeではインラインコードにしないでおくと画面にその色が表示されるので便利だからそのまま記述しています．また、`#000000` というように数字だけだとタグにならない．そうなると、次のように表示が一貫しない．

![ColorAsTag - Obsidian](/img/post/2025/03-23-vscode-mdbook-obsidian.jpg)

ちなみに、VS Codeだと次のように表示されます．

![ColorAsTag(VS Code) - Obsidian](/img/post/2025/03-23-vscode-mdbook-obsidian-colorastag-vscode.jpg)

## 終わりに

以上が ObisidanをVS CodeとmdBookの環境にビューアとして使った環境になります．
Obsidianのプラグインや設定が Vault ごとなのはメリットでもありデメリットなので、今回のように複数のドキュメントリポジトリがある場合はあまり向いていない気もします．まだ、Obsidianを導入したばかりなのでまだまだわからないことが多いです．ちなみに、mdBookでは `SUMMARY.md` がルートとなりますが、今回のObsidianでは`src/daily/` にデイリーログを、`src/templates/` にテンプレートを、`src/OBSIDIAN.md` をダッシュボードとして配置しています．設定は `src/.obsidian` で、gitの管理外としています．

参考になれば幸いです．
