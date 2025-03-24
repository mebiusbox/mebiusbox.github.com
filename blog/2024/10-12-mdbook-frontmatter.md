---
title: mdBookでFront Matterを処理する
description: mdBookでFront Matterを処理するプログラムの作成
keywords:
  - mdBook
  - frontmatter
  - python
category: note
authors: [mebiusbox]
tags: [mdBook,python]
image: https://og-image-mebiusbox.vercel.app/api/og?title=mdBook%e3%81%a7Front+Matter%e3%82%92%e5%87%a6%e7%90%86%e3%81%99%e3%82%8b&subtitle=mdBook%e3%81%a7Front+Matter%e3%82%92%e5%87%a6%e7%90%86%e3%81%99%e3%82%8b%e3%83%97%e3%83%ad%e3%82%b0%e3%83%a9%e3%83%a0%e3%81%ae%e4%bd%9c%e6%88%90&date=2024%2F10%2F12&tags=mdBook,python
last_update:
  date: 2025-03-23
---

mdBookでMarkdownファイルに含まれているFront Matterを処理するスクリプトの作成について解説します．

<!-- truncate -->

mdBookではMarkdownファイルをレンダリングする前にプリプロセス（事前処理）する仕組みがあります．
これはプリプロセッサが行います．プリプロセッサは標準入力からデータを受け取って加工し、それを標準出力に出力します．
ここで、実行ファイルが`python`などであればスクリプトで処理することもできます．
ここでは、Markdownファイルに含まれるFrontMatterを処理するプリプロセッサをPythonプログラムで作成します．

## Front Matter

Front Matterはファイルの先頭に付加するメタデータです．通常YAML形式が使われます．
たとえば、[Docusaurus](https://docusaurus.io/)ではブログ記事のソースファイルであるMarkdownファイルにFront Matterを入れてさまざまな設定や追加情報を入れることができます．しかし、mdBookでは標準だと処理されずにそのままレンダリングされます．

Markdownファイルにメタデータは残しつつ、レンダリング時には表示してほしくありません．
そこで、プリプロセッサを使います．
mdBookのプラグインを探してみるとFront Matterを処理するものがいくつか見つかりますが、実際に使ってみるとFront Matter以外も削除したりと意図した挙動になってませんでした．なので、自分でプリプロセッサを作ってみることにします．ここでは、Pythonを使ってプログラムを作成します．

## プリプロセッサ

プリプロセッサをPythonで作成する方法と使用方法はmdBookの公式ドキュメントに書かれています：

- [Configuring Preprocessors - Provide Your Own Command](https://rust-lang.github.io/mdBook/format/configuration/preprocessors.html#provide-your-own-command)
- [Preprocessor - Implementing a preprocessor with a different language](https://rust-lang.github.io/mdBook/for_developers/preprocessors.html#implementing-a-preprocessor-with-a-different-language)

前述したとおり、標準入力からデータが入ってきます．データはJSON形式です．データを変更したあとに標準出力に渡します．公式には次の単純なプログラムが紹介されています．

```python
import json
import sys

if __name__ == '__main__':
    if len(sys.argv) > 1: # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    # and now, we can just modify the content of the first chapter
    book['sections'][0]['Chapter']['content'] = '# Hello'
    # we are done with the book's modification, we can just print it to stdout,
    print(json.dumps(book))
```

これをベースに機能を作成します．今回作成するのはFront Matter部分のカットと、Front Matterに含まれている`Title`を見出しとして出力する機能です．
作成したプリプロセッサ `mdbook-frontmatter.py` は次のとおりです．

```python title="mdbook-frontmatter.py"
import json
import re
import sys

def process(content):
    pattern = re.compile(r"^---(?P<frontmatters>.*?)---\r?\n*", re.DOTALL)
    result = pattern.search(content)
    if result:
        frontmatters = result.group("frontmatters")
        title = ""
        result = re.search(r"^title:\s*(?P<title>.*?)$", frontmatters, re.MULTILINE)
        if result:
            title = "# {}\n\n".format(result.group("title").strip('"'))
        content = title + pattern.sub("", content)
    return content

def process_section(section):
    if "Chapter" in section:
        section["Chapter"]["content"] = process(section["Chapter"]["content"])
        for item in section["Chapter"]["sub_items"]:
            process_section(item)

if __name__ == "__main__":
    if len(sys.argv) > 1:  # we check if we received any argument
        if sys.argv[1] == "supports":
            # then we are good to return an exit status code of 0, since the other argument will just be the renderer's name
            sys.exit(0)

    # load both the context and the book representations from stdin
    context, book = json.load(sys.stdin)
    for section in book["sections"]:
        process_section(section)
    print(json.dumps(book))
```

すべてのデータがまとめて1つのJSONデータになって渡されます．
mdBookではチャプター情報を`SUMMARY.md`で記述しますが、そのチャプターごとに `book["sections"]` に格納されているようです．
たとえば、`SUMMARY.md`が次のような内容だった場合：

```markdown
# Summary

- [Chapter 1](./chapter_1.md)
- [Chapter 2](./chapter_2.md)
```

渡されるJSONデータは次のようなデータが渡されていました：

```json
{
  "sections": [
    {
      "Chapter": {
        "name": "Chapter 1",
        "content": "---\\ntitle: Chapter 1\\ndescription: Description Here.\\ntags: []\\n---\\n\\n## Chapter 1\\n",
        "number": [
          1
        ],
        "sub_items": [],
        "path": "chapter_1.md",
        "source_path": "chapter_1.md",
        "parent_names": []
      }
    },
    {
      "Chapter": {
        "name": "Chapter 2",
        "content": "# chapter_2\\n",
        "number": [
          2
        ],
        "sub_items": [],
        "path": "chapter_2.md",
        "source_path": "chapter_2.md",
        "parent_names": []
      }
    }
  ]
}
```

セクションから`Chapter`キーのデータを参照できます．Chapterデータの`content`がMarkdownファイルの中身のようですので、それを`process`関数に渡して処理し、処理した後のデータを返しています．

`process`関数の中では正規表現を使ってFront Matterを抽出しています．また、Front Matterの中に`Title`があれば、取り出して見出し（`H1`）として出力しています．
やっていることはとても単純なものです．

あとは、mdBookにプロセッサを設定します．作成した `mdbook-frontmatter.py` を適当な場所において、`mdbook.toml`ファイルに次のように記述を追加します．

```toml title="mdbook.toml"
[preprocessor.frontmatter]
command = "py mdbook-frontmatter.py"
```

Windowsを使っているので`py`としています．これは`python`などに書き換えてください．また、Pythonプログラムも必要であれば絶対パスで指定します．
これで、`build`や`serve`をすれば自動でプリプロセッサが動作します．

以上です．
