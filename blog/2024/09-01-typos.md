---
title: Typosでスペルミスを減らす
description: Typosを使ってスペルチェックするときの設定についてのメモ
keywords:
  - Typos
category: note
authors: [mebiusbox]
tags: [typos]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Typos%e3%81%a7%e3%82%b9%e3%83%9a%e3%83%ab%e3%83%9f%e3%82%b9%e3%82%92%e6%b8%9b%e3%82%89%e3%81%99&subtitle=Typos%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%a6%e3%82%b9%e3%83%9a%e3%83%ab%e3%83%81%e3%82%a7%e3%83%83%e3%82%af%e3%81%99%e3%82%8b%e3%81%a8%e3%81%8d%e3%81%ae%e8%a8%ad%e5%ae%9a%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6%e3%81%ae%e3%83%a1%e3%83%a2&date=2024%2F09%2F01&tags=typos
---

スペルミス（typo）を減らすために、スペルチェッカー「Typos」を導入してみました．
ここでは、設定について調べたことを残しておきます．

<!-- truncate -->

スペルチェッカーは Visual Studio Codeの拡張機能である「[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)」を利用していました．ただ、誤検出や、過剰検出などのノイズが多いとも感じていました．
スペルチェックの範囲を限定したり、単語を登録しておくことによってノイズを減らすことはもちろんできますが、もう少し手抜きがしたいところです．

そこで、別のスペルチェッカーを試してみようと、調べたら [Typos](https://github.com/crate-ci/typos) が目立ったので、試しに導入してみました．
よくCIで回して運用する方法が解説されていましたが、普通に個人の開発で利用するようにしました．
主に、Visual Studio Codeの拡張機能「[Typos spell checker](https://marketplace.visualstudio.com/items?itemName=tekumara.typos-vscode)」と、コマンドラインツールによるチェックで使用しています．

## インストール

私は `cargo` でインストールしました．

```shell
cargo install typos-cli
```

後は `typos`コマンドで実行できます．標準で現在のディレクトリ以下のファイルをチェックします．

```shell
typos
```

- 実際にチェックされるファイルは `--files`オプションで確認できます．
- スペルミスを修正する機能もあります．その場合は `-w` または `--write-changes` オプションを付けます．
- 出力フォーマットは `--format` で指定できます．標準は `long` ですが、`brief` で短く、`json`でJSON形式で出力できます．

## 設定ファイル

`.typos.toml`, `typos.toml`, `_typos.toml`、また `Cargo.toml`, `pyproject.toml` にも含めることができるようです．

詳しくは[ドキュメント](https://github.com/crate-ci/typos/blob/master/docs/reference.md)に書かれています．

### ignore

個人的にちょっとわかりづらかった部分なので、調べた限りの情報を整理しておきます．
まず、標準で ignore 関連は有効になっています．オプションに `--dump-config -` を指定して実行すると、設定情報が出力されます．
何も指定していない状態だと次のような設定になります（一部のみ抜粋）：

```toml
[files]
extend-exclude = []
ignore-hidden = true
ignore-files = true
ignore-dot = true
ignore-vcs = true
ignore-global = true
ignore-parent = true

[default]
binary = false
check-filename = true
check-file = true
unicode = true
ignore-hex = true
identifier-leading-digits = false
locale = "en"
extend-ignore-identifiers-re = []
extend-ignore-words-re = []
extend-ignore-re = []
...
```

たとえば、`ignore-files` はドキュメントを確認すると `Respect ignore files.` とあってちょっと曖昧だと感じました．
なので、実際にソースコードを直接見てどうなっているのか調べてみました．

- `ignore-files` が有効になっていると `ignore-dot`, `ignore-vcs`, `ignore-global`, `ignore-parent` が有効になります．
- `ignore-vcs` が有効になると `.gitignore` を参照します．ですから、標準で `.gitignore` に指定されているディレクトリやファイルは除外されます．また、`$GIT_DIR/info/exclude`も参照されます．
- `ignore-dot` はすべてのドットファイルが無視されるわけではなく `.ignore` ファイルという `.gitignore` と同じ記法のファイルが参照されます．
- `ignore-global` はgitのグローバル設定を参照します．これは `core.excludesfile` の値です．
- `ignore-parent`は親ディレクトリにある `.gitignore` を参照します．

全部をしっかりと動作確認したわけではないので、誤りがあったら指摘してもらえると助かります．

## enable/disable

Typosは標準でソースコード内でチェッカーの挙動を制御するものは用意されていないので、必要であれば追加する必要があります．
よくある `enable/disable` や `disable-line` はドキュメントに書かれているのでそれを使います．
あと `disable-next-line` も欲しかったのでこれも追加してみます．`extend-ignore-re`で設定します．

```toml
extend-ignore-re = [
# spellchecker: disable-line, disable-next-line, disable, enable
  "(?Rm)^.*(#|//|/\\*)\\s*spellchecker:\\s*disable-line$",
  "(?m)^\\s*(?:#|//|/\\*)\\s*spellchecker:\\s*disable-next-line.*$\\r?\\n.*$",
  "(?s)(#|//|/\\*|<!--)\\s*spellchecker:\\s*disable.*?\\n\\s*(#|//|/\\*|<!--)\\s*spellchecker:\\s*enable"
]
```

ドキュメントに書かれているものを少し改善して、4種類のコメントに対応しています：

```markdown
# spellchecker: disable
// spellchecker: disable
/* spellchecker: disable */
<!-- spellchecker: disable -->
```

また、この記法は Code Spell Checker（内部でcspellを使用）にも準拠しています．

## ハッシュ値

実際に使用していて気になったのがハッシュ値に対する誤検出です．issueでもいくつか報告（[#484](https://github.com/crate-ci/typos/issues/484)）されていますが根本的な解決はまだされていないようです．対応としては、正規表現を使ってある一定以上の文字数を無視するぐらいしかできず、この方法もその文字数以上はすべてチェックされなくなるのでよろしくありません．いまのところどうしようもないので無視しています．

## 実際の運用について

なかなか私の中でも確立した方法が見つかっていません．
Typosでもやはり誤検知はするので、該当箇所はスペルチェッカーを無効にしたりしないとノイズとして残り続けます．
とはいえ、スペルチェッカー関連でコードを汚染するのもよろしくないですし、難しい問題です．
まあ、ほどほどにしてスペルチェックの結果に対してチェック済みかどうか記録できる仕組みとかあると管理しやすいかもしれません．

以上です．
