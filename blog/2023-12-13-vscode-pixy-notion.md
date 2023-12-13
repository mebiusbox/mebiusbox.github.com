---
title: 自分用にVSCodeのアウトライン拡張を作ってみました
description: VSCodeのアウトラインに見つけやすいシンボルを表示する拡張機能を作りました
keywords:
  - VSCode
  - 拡張機能
  - アウトライン
category: note
authors: [mebiusbox]
tags: [vscode]
image: https://og-image-mebiusbox.vercel.app/api/og?title=%E8%87%AA%E5%88%86%E7%94%A8%E3%81%ABVSCode%E3%81%AE%E3%82%A2%E3%82%A6%E3%83%88%E3%83%A9%E3%82%A4%E3%83%B3%E6%8B%A1%E5%BC%B5%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%81%9F&subtitle=VSCode%E3%81%AE%E3%82%A2%E3%82%A6%E3%83%88%E3%83%A9%E3%82%A4%E3%83%B3%E3%81%AB%E8%A6%8B%E3%81%A4%E3%81%91%E3%82%84%E3%81%99%E3%81%84%E3%82%B7%E3%83%B3%E3%83%9C%E3%83%AB%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%82%92%E4%BD%9C%E3%82%8A%E3%81%BE%E3%81%97%E3%81%9F&date=2023%2F12%2F13&tags=vscode
---

標準でアウトラインに表示されるシンボルは多すぎて使いづらいので、自分好みのシンボルをアウトラインに表示させるようにするために拡張機能を作りました．ここでは開発の備忘録としていくつかまとめておきます．

<!-- truncate -->

import Bookmark from '@site/src/components/Markdown/WebBookmark.tsx'

## はじめに

VSCode の標準機能にあるアウトラインにはシンボル情報が表示されます．設定で一部を非表示に出来たり、`Ctrl+F`キーを押すと検索で絞り込むことができます．

![VSCode Outline View](/img/post/2023-12-13-vscode-pixy-notion-231213153911.png)

また、シンボル検索(`Ctrl+Shift+O`)を使うこともできます．これはコマンドパレットで `@` と入力しても同じ結果になります．

![Symbol Search](/img/post/2023-12-13-vscode-pixy-notion-231213165821.png)

ここで `@:` と入力すればカテゴリごとに分けて表示されます．

![Symbol Search with Category](/img/post/2023-12-13-vscode-pixy-notion-231213165920.png)

検索を使えば事足りそうな気がしますが、しばらく触っていなかったりするとそもそも関数名とか何があるのかを記憶していません．
もう少し自分に優しいシンボル検索がとても欲しいと感じました．


## 目印と関数

アウトラインとして欲しいものに「目印（マーク）」と「関数（メソッド）」の2種類があります．
関数は標準の機能でありますが、目印は拡張機能を導入する必要があります．
今回は、アウトラインに目印を表示してくれる拡張機能「[Marks To Outline](https://marketplace.visualstudio.com/items?itemName=roabramov.marks-to-outline)」のソースコードを調整して自分好みのアウトライン機能を作りました．

<Bookmark name="Marks to outline" url="https://marketplace.visualstudio.com/items?itemName=roabramov.marks-to-outline" description="Adds MARKS symbols to outline view" />

次のようなアウトライン表示になります．

![Pixy Outline View](/img/post/2023-12-13-vscode-pixy-notion-231213170838.png)

目印は `MARK: ***` と記述するようになっています．
また、シンボル名にはそれぞれ `M: `、 `F: ` を付けています．これによってシンボル検索で、目印は `@M: `、関数は `@F: ` で絞り込むことができます．

![Search Function Symbols](/img/post/2023-12-13-vscode-pixy-notion-231213172106.png)

![Search Mark Symbols](/img/post/2023-12-13-vscode-pixy-notion-231213172155.png)


## VSCode拡張機能の作成

Node.jsの環境で作成します．以下を参考にしました．

<Bookmark name="VSCode Extensions(拡張機能) 自作入門 〜VSCodeにおみくじ機能を追加する〜" url="https://qiita.com/HelloRusk/items/073b58c1605de224e67e" description="VSCode Extensions(拡張機能) 自作入門 〜VSCodeにおみくじ機能を追加する〜" />

まず、`yo`, `generator-code` パッケージが必要なのでインストールします．

```
npm i yo generator-code -g
```

Node.jsのバージョンも条件を満たすようにアップデートしました．

```
$ node -v
v18.17.1

$ npm -v
10.2.5
```

ひな形を作成します．

```
$ yo code
```

次に Marks to Outline を参考に実装していきます．
別に Marks to Outline をクローンして編集しても問題ありません．コードが比較的少ない場合は、どのような処理をやっているかを確認するためにもよく書き写しています．


### 機能の追加

Marks to Outline には目印をアウトラインに表示する機能がすでに入っています．そこに関数を追加します．
関数は目印と同様に正規表現で抽出します．ただし、1行でしか判定していないので正確な関数抽出は出来ません．これは妥協しました．

関数は無視パターンと一致パターンを使って、先に無視パターンで弾いてから一致パターンでチェックするようにしています．

```javascript
const funcIgnorePatterns = [
    "^\\s*[a-zA-Z_][a-zA-Z0-9_]+\\([^;]*\\)[^;\\{]*$",
    "^\\s*[a-zA-Z_][a-zA-Z0-9_]+\\([^(=>);]*\\{.*$"
];
const funcSearchPatterns = [
    "^\\s*([a-zA-Z_][a-zA-Z0-9_]+)\\([^;]*$",
    "^\\s*([a-zA-Z_][a-zA-Z0-9_]+)<[^\\(]+>\\([^;]*$",
    "^\\s*function\\s*([a-zA-Z_][a-zA-Z0-9_]+)\\([^;]*$",
    "^\\s*function\\s*([a-zA-Z_][a-zA-Z0-9_]+)<[^\\(]+>\\([^;]*$",
    "^\\s*(?:const|let|var)\\s*([a-zA-Z_][a-zA-Z0-9_]+)[^;]*=\\s*async\\s*\\([^;]*$",
];
```

一応、`async` やアロー関数も対応していますが、まだまだ調整は必要だと思います．随時更新していけばいいかなと．


### DocumentSymbol

Marks to Outline では `vscode.SymbolInformation` をシンボルプロバイダの生成物として返しているのですが、これだとアウトラインの階層表示に対応できません．
階層表示させるには `vscode.DocumentSymbol` を使います．詳しくは、以下を参考にしました．

<Bookmark name="VS Code拡張API - DocumentSymbolProvider" url="https://qiita.com/PrsPrsBK/items/d71b13e733f3bbacf8b5" description="" />

具体的には `vscode.DocumentSymbol` で親子関係を構築していけばよいみたいです． `vscode.DocumentSymbol.children` に `vscode.DocumentSymbol` を追加していく感じです．

```typescript
const vscodeSymbols: vscode.DocumentSymbol[] = [];
const markGroup: vscode.DocumentSymbol = new vscode.DocumentSymbol(
    "MARKS",
    "",
    vscode.SymbolKind.Key,
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10)),
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10))
);
resultMarks.map((result: MarkTokens) => {
    markGroup.children.push(
    finder.makeDocumentSymbol(
        { ...result, document },
        vscode.SymbolKind.Key,
        "M: "
    )
    );
});
vscodeSymbols.push(markGroup);

const funcGroup: vscode.DocumentSymbol = new vscode.DocumentSymbol(
// (...)
);

// (...)

vscodeSymbols.push(funcGroup);
```

この `vscodeSymbols` を `provideDocumentSymbols` メソッドで返すようにしています．


### パッケージの生成とインストール

デバッグをしていい感じになったら、パッケージングします．
この時 `README.md` を編集しないと怒られるので適当に編集します．以下のコマンドでパッケージが作成できます．

```
npx vsce package
```

拡張子が `.vsix` ファイルが生成されます．VSCode上ならこのファイルを右クリックからインストールできます．


### 役に立ったサイト

拡張機能のアクティベートの部分に関しては次のサイトを参考にしました．

<Bookmark name="Visual Studio Code 拡張機能のアクティベート activationEvents" url="https://clickan.click/activation-events/" description="" />


## 合わせて使いたい拡張機能

おまけで、`TODO Highlight` という拡張機能を使うと、目印のコードをハイライトすることができます．

<Bookmark name="TODO Highlight" url="https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight" description="highlight TODOs, FIXMEs, and any keywords, annotations..." />

インストールしただけではダメで、カスタマイズする必要があります．

設定で `todohighlight.keywords` を追加します．以下は私の設定です．

```json
"todohighlight.keywords": [
    {
        "text": "NOTE:",
        "color": "#242424",
        "border": "1px solid #66D9EF",
        "borderRadius": "2px",
        "backgroundColor": "#66D9EF",
        "overviewRulerColor": "transparent"
    },
    {
        "text": "//!",
        "color": "#242424",
        "border": "1px solid #A6E22E",
        "borderRadius": "2px",
        "backgroundColor": "#A6E22E",
        "overviewRulerColor": "transparent"
    },
    {
        "text": "MARK:",
        "color": "#242424",
        "border": "1px solid #A6E22E",
        "borderRadius": "2px",
        "backgroundColor": "#A6E22E",
        "fontWeight": "600",
        "isWholeLine": true,
    }
],
```

次のように表示されます：

![TODO Highlight](/img/post/2023-12-13-vscode-pixy-notion-231213180211.png)


これで少しは快適になった感じがします．もしかすると便利な拡張機能や標準で出来るかもしれません．
ちなみに、今のところ作成した拡張機能は公開する予定はありません．
以上です．
