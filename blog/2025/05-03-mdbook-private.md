---
title: mdBookで一部を非公開にするプリプロセッサを作る
description: 公開したくない内容をビルド時に除外するプリプロセッサについて
keywords:
  - mdBook
category: note
authors: [mebiusbox]
tags: [mdBook]
image: https://og-image-mebiusbox.vercel.app/api/og?title=mdBook%e3%81%a7%e4%b8%80%e9%83%a8%e3%82%92%e9%9d%9e%e5%85%ac%e9%96%8b%e3%81%ab%e3%81%99%e3%82%8b%e3%83%97%e3%83%aa%e3%83%97%e3%83%ad%e3%82%bb%e3%83%83%e3%82%b5%e3%82%92%e4%bd%9c%e3%82%8b&subtitle=%e5%85%ac%e9%96%8b%e3%81%97%e3%81%9f%e3%81%8f%e3%81%aa%e3%81%84%e5%86%85%e5%ae%b9%e3%82%92%e3%83%93%e3%83%ab%e3%83%89%e6%99%82%e3%81%ab%e9%99%a4%e5%a4%96%e3%81%99%e3%82%8b%e3%83%97%e3%83%aa%e3%83%97%e3%83%ad%e3%82%bb%e3%83%83%e3%82%b5%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2025%2F05%2F03&tags=mdBook
---

mdBookで生成したWebコンテンツを公開する必要があったのですが、一部の内容は公開したくないものがありました．
本記事ではプリプロセッサを作成して実現する方法について解説します．

<!-- truncate -->

mdBookではマークダウン方式で記述した内容を静的Webコンテンツにビルドします．通常は `src` ディレクトリに含まれている `SUMMARY.md` をルートとして木構造で構築します．今回は、除外対象としてファイル単位、またはファイル内の一部を公開用ビルドしたときに除外します．また、非公開でビルドするときは除外しないようにします．

除外するためにプリプロセッサを使います．プリプロセッサは標準入力と標準出力さえ出来れば可能なので、Pythonを使います．

## mdbook-private

除外するプリプロセッサを `mdbook-private` という名前で作成します．ちなみに同名のプリプロセッサがすでに存在しますが、想定した使い方と異なるので自作します．
実装する機能としては以下の3つになります．

- ファイル名の先頭がアンダースコア（`_`）なら除外
- Front Matterで非公開を制御する
- コンテンツ内の一部を非公開にする

### プリプロセッサの利用

mdBookのプロジェクトディレクトリ（`book.toml`がある）に `preprocessor` ディレクトリを作り、そこに `mdbook-private.py` ファイルを作成します．
このプリプロセッサを使うには `book.toml` に以下のセクションを追加します．Windows用なので `py` を使っています．

```toml
[preprocessor.private]
command = "py preprocessor/mdbook_private.py"
```

### ひな形

```py
import json
import sys

if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)

    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

プリプロセッサは標準入力からデータが渡されます．それを加工して標準出力に出力します．`context`には`book.toml`ファイルの設定が渡されます．`book`は `SUMMARY.md` からリンクされているすべてのファイルがまとめらたものです．どちらも`json`形式です．

### ファイル名の先頭がアンダースコア（`_`）なら除外

各章は `book["sections"]` にあります．それを解析して処理します．以下がコードです．

```py
import json
import sys
from pathlib import Path

def check_section(section):
    if "Chapter" in section:
        # check prefix
        if Path(section["Chapter"]["path"]).stem.startswith("_"):
            return False

        items = section["Chapter"]["sub_items"]
        section["Chapter"]["sub_items"] = []
        for item in items:
            if check_section(item):
                section["Chapter"]["sub_items"].append(item)
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    sections = book["sections"]
    book["sections"] = []
    for section in sections:
        if check_section(section):
            book["sections"].append(section)

    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

`check_section`関数は公開対象なら`True`を、そうでないなら`False`を返します．ファイル名は `section["Chapter"]["path"]` や `section["Chapter"]["source_path"]` で取得できるので、その値を使ってファイル名の先頭にアンダースコアがあるか確認します．また、節や項などはさらに`sub_items`に入っています．なので、再帰的に処理する必要があります．`check_section`関数の結果によって、公開する場合は `book["sections"]` に追加します．

章や節などには番号が割り振られていて、`book["sections"]["Chapter"]["number"]` にあります．章などを除外するとこの番号がずれてしまいますので番号を再割り当てする必要があります．この処理は今回は省略するので必要であれば処理を実装してください．

## Front Matterで非公開を制御する

ファイル名以外に、Front Matterを使って非公開を制御する仕組みを導入します．方法は簡単で、コンテンツにあるFront Matterを調べて `private` フィールドに `true` が設定されていれば非公開とします．

```py
import json
import sys
import re

def check_private_with_frontmatter(content):
    pattern = re.compile(r"^---(?P<frontmatters>.*?)---\r?\n*", re.DOTALL)
    result = pattern.search(content)
    if result:
        frontmatters = result.group("frontmatters")
        result = re.search(r"^private:\s*(?P<private>.*?)$", frontmatters, re.MULTILINE)
        if result:
            return result.group("private").strip().startswith("true")

    return False

def check_section(section):
    if "Chapter" in section:
        # check frontmatter
        if check_private_with_frontmatter(section["Chapter"]["content"]):
            return False

        items = section["Chapter"]["sub_items"]
        section["Chapter"]["sub_items"] = []
        for item in items:
            if check_section(item):
                section["Chapter"]["sub_items"].append(item)
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    sections = book["sections"]
    book["sections"] = []
    for section in sections:
        if check_section(section):
            book["sections"].append(section)
    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

`check_private_with_frontmatter`関数でFront Matterを調べます．ここでは、正規表現を使って調べています．

### コンテンツ内の一部を非公開にする

コンテンツ内の一部を非公開にするため、コメントを使います．コメントで `<!-- begin private -->` と `<!-- end private -->` で囲まれた部分を非公開とします．
これも正規表現を使って処理します．

```py
import json
import sys
import re

def remove_private_block(section):
    if "Chapter" in section:
        section["Chapter"]["content"] = re.sub(
            r"<!--\s*begin\s+private\s*-->[\r?\n]*(?P<content>.*?)[\r?\n]*<!--\s*end\s+private\s*-->[\r?\n]*",
            "",
            section["Chapter"]["content"],
        )
        for item in section["Chapter"]["sub_items"]:
            remove_private_block(item)

if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    sections = book["sections"]
    book["sections"] = []
    for section in sections:
        if check_section(section):
            remove_private_block(section)
            book["sections"].append(section)
    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

### オプション機能

プリプロセッサに対してオプション機能を実装します．たとえば、それぞれの機能の有効・無効の切替を制御できると便利です．
プリプロセッサのオプションは `book.toml` ファイルの各プリプロセッサセクションで設定できます．このオプションは `context` に含まれています．
`mdbook-private.py` プリプロセッサのオプションは `context["config"]["preprocessor"]["private"]` に入っています．
ここでは、プリプロセッサの有効・無効を切り替える `enabled` と、コンテンツ内の一部を非公開にする機能を切り替える `hidden-block` オプションに対応します．

このオプションに対応したコードは次のようになります：

```py
import json
import re
import sys
from pathlib import Path

def check_private_with_frontmatter(content):
    pattern = re.compile(r"^---(?P<frontmatters>.*?)---\r?\n*", re.DOTALL)
    result = pattern.search(content)
    if result:
        frontmatters = result.group("frontmatters")
        result = re.search(r"^private:\s*(?P<private>.*?)$", frontmatters, re.MULTILINE)
        if result:
            return result.group("private").strip().startswith("true")

    return False


def check_section(section):
    if "Chapter" in section:
        # check prefix
        if Path(section["Chapter"]["path"]).stem.startswith("_"):
            return False
        # check frontmatter
        if check_private_with_frontmatter(section["Chapter"]["content"]):
            return False

        items = section["Chapter"]["sub_items"]
        section["Chapter"]["sub_items"] = []
        for item in items:
            if check_section(item):
                section["Chapter"]["sub_items"].append(item)
    return True


def remove_private_block(section):
    if "Chapter" in section:
        section["Chapter"]["content"] = re.sub(
            r"<!--\s*begin\s+private\s*-->[\r?\n]*(?P<content>.*?)[\r?\n]*<!--\s*end\s+private\s*-->[\r?\n]*",
            "",
            section["Chapter"]["content"],
        )
        for item in section["Chapter"]["sub_items"]:
            remove_private_block(item)


if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    config = context["config"]["preprocessor"]["private"]
    if "enabled" not in config or config["enabled"]:
        sections = book["sections"]
        book["sections"] = []
        for section in sections:
            if check_section(section):
                if "hidden-block" in config and config["hidden-block"]:
                    remove_private_block(section)
                book["sections"].append(section)
    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

あとは`book.toml`でこれらのオプションを設定します．

```toml
[preprocessor.private]
command = "py preprocessor/mdbook_private.py"
enabled = true
hidden-block = true
```

### プリプロセッサの実行順番

このプリプロセッサはFront Matterを使っていますが、mdBookでは標準だと普通にレンダリングされてしまいます．たとえば、以前に書いた記事 [mdBookでFront Matterを処理する](/blog/2024/10/12/mdbook-frontmatter) で作成したプリプロセッサ（`mdbook-frontmatter.py`）などで取り除くことができます．それと組合せて使うと次のようになります．

```toml
[preprocessor.frontmatter]
command = "py preprocessor/mdbook_frontmatter.py"

[preprocessor.private]
command = "py preprocessor/mdbook_private.py"
enabled = true
hidden-block = true
```

このとき、処理される順番は定義順ではなく、何かしらでソートされた順番で処理されているようです．frontmatterプリプロセッサでFront Matter部分が取り除かれるとprivateプリプロセッサが正常に処理できません．そのため、privateプリプロセッサがfrontmatterプリプロセッサの前に処理するようにしなければなりません．そこで、`after` や `before` を使います．ここでは `before` を使って次のようにします．

```toml
[preprocessor.frontmatter]
command = "py preprocessor/mdbook_frontmatter.py"

[preprocessor.private]
before = ["frontmatter"]
command = "py preprocessor/mdbook_private.py"
hidden-block = true
enabled = true
```

これで、privateプリプロセッサがfrontmatterプリプロセッサの前に処理されます．

### 実行時にプリプロセッサのオプションを変更する

公開用と非公開用をコマンドラインから切り替えられると便利です．`book.toml` の設定は環境変数を使って実行時に書き換えることができます．通常は非公開用にすべてレンダリングするようにします．設定は次のようになります．

```toml
[preprocessor.frontmatter]
command = "py preprocessor/mdbook_frontmatter.py"

[preprocessor.private]
before = ["frontmatter"]
command = "py preprocessor/mdbook_private.py"
hidden-block = true
enabled = false
```

公開用にビルドするときは、privateプリプロセッサを有効にし、出力先のディレクトリも変更します．各オプションは環境変数で `MDBOOK` を接頭辞にして指定します．セクションは `__` で区切り、`-` は `_` に置き換えます．以下は公開用の環境変数設定例です．

```shell
MDBOOK_BUILD__BUILD_DIR = "book_public"
MDBOOK_PREPROCESSOR__PRIVATE__ENABLED = "true"
```

公開用は "book_public" ディレクトリに出力するように指定しています．たとえば、`cargo-make` を使った設定は次のようになります．

```toml
[tasks.build]
description = "Build book"
command = "mdbook"
args = [
  "build",
  "${@}"
]

[tasks.build-public]
description = "Build book"
script_runner = "pwsh"
script_extension = "ps1"
script = '''
$BuildDir = ".\book_public"
$env:MDBOOK_BUILD__BUILD_DIR = $BuildDir
$env:MDBOOK_PREPROCESSOR__PRIVATE__ENABLED = "true"
mdbook clean
mdbook build
'''
```

次のように使います．

```powershell
makers build        # for private
makers build-public # for public
```

以上です．
