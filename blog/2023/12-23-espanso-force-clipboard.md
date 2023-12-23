---
title: Espanso の force_clipboard について
description: Espanso で置換文字に改行が含まれる時の問題
keywords:
  - Espanso
category: note
authors: [mebiusbox]
tags: [Espanso]
---

[Espanso](https://espanso.org/) というテキスト入力支援ソフトで置換文字が改行を含んでいる場合に起こる問題とその対応方法についてまとめました．

<!-- truncate -->

## Espanso とは

[Espanso](https://espanso.org/) はテキスト入力支援ソフトです．WindowsやMacOSでも使えます．あらかじめトリガー文字と置換文字を指定しておくと、トリガー文字が入力されると同時に置換文字に置き換わります．Espanso では置換文字にクリップボードの内容やスクリプトの実行結果など様々な機能があります．テキスト入力支援ソフトは他にも様々なものがあります．例えば、[aText](https://www.trankynam.com/atext/) があります．また、[keyhac](https://sites.google.com/site/craftware/keyhac-ja) を使って同様のことも出来るでしょう．


## 改行を含んでいる場合の問題となるケース

Espanso には文字を置換するときに2つのバックエンドを使い分けて処理します．`Inject`と`Clipboard`です．

`Inject`はキー入力をシミュレートし、`Clipboard`はクリップボードを経由して置換します．このバックエンドは設定で切り替えることが出来ます．標準で `Auto` となっており、トリガー時に自動で切り替わります．

問題となるのは `Enterキー` が改行ではなくショートカットなどに割り当てられている場合です．その場合 `Inject` だと適切に処理されません．
ではどうするかというとバックエンドに`Clipboard`を指定すればいいことになります．

## バックエンドに Clipboard を使う方法

3つの方法があります．

### すべてに Clipboard バックエンドを使う

設定ファイルで次のように設定します．

```yml title="default.yml"
backend: clipboard
```


### clipboard_threshold を設定する

Clipboard バックエンドを使用する閾値を設定します．標準で `100` に設定されています．この閾値を超えると Clipboard バックエンドが利用されます．
これは `backend` が `Auto` のとき（標準）に機能します．

```yml title="default.yml"
clipboard_threshold: 20
```


### force_clipboard を設定する

上記2つの方法はすべてのトリガーに適用されるのですが、 `force_clipboard` を使ってトリガーごとに Clipboardバックエンドを使うかどうか設定することができます．
次のように指定します．

```yml
- trigger: "Hello"
  replace: "Hello, World"
  force_clipboard: true
```


この `force_clipboard` は公式ドキュメントには見当たらず、ソースコードを見るか、Issues で見つけることができます．
もしかすると将来的に無くなるかもしれません．


## さいごに

結局、Clipboard バックエンドを常に使うようにしておくのもありですし、環境によって適切な設定をすればいいと思います．
以上です．

