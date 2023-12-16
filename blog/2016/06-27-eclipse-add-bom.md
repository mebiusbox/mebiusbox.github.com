---
layout: post
title: Eclipse：新規ファイルにBOM(UTF-8)をつける
category: note
tags: [eclipse]
authors: [mebiusbox]
---

Eclipse で新規にファイルを作成すると Workspace に設定されたエンコードで保存されます。
文字エンコーディングを UTF-8 に設定した場合、新規にファイルを作成しても BOM は付きません。
そこで、BOM を付加するスクリプトを書きました。Ruby 版と Python 版があります。

## AddBom.rb

```ruby
#! /usr/bin/env ruby

path = ARGV[0]
puts "Add BOM to #{path}"
src = File.read(path)
bom = "\xEF\xBB\xBF"
if src.index(bom) == 0
	raise "BOM already exists"
end

File.open(path, "w") do |io|
	io << bom
	io << src
end
```

## AddBom.py

```python
# -*- coding:utf-8
import os
import sys

def main(path):
    f = open(path, mode='rb')
    data = f.read()
    f.close()

    utf8bom = "\xef\xbb\xbf"
    if len(data) >= 3:
        if data[0:3] == utf8bom:
            print "BOM already exists " + path
            return 0

    f = open(path, mode="wb")
    f.write(utf8bom)
    f.write(data)
    f.close()
    print "Add BOM to " + path
    return 0

if __name__ == '__main__':
    if len(sys.argv) < 2:
         print sys.argv
         print "addbom <path>"
         sys.exit(0)
    else:
        sys.exit(main(sys.argv[1]))
```

## eclipse に外部ツールとして登録する

メニューバーから `Run > External Tools > External Tools Configurations...` を選択します。
新規作成し、AddBom.rb もしくは AddBom.py を登録します。

### AddBom.rb の場合

 項目 | 設定
---|---
Name | AddBom
Location | ruby.exe のパス
Arguments | `<AddBom.rbのパス\> ${resource_loc}`

### AddBom.py の場合

 項目 | 設定
---|---
Name | AddBom
Location | python.exe のパス
Arguments | `<AddBom.pyのパス\> ${resource_loc}`

## 使い方

新規ファイルを作成し、そのファイルを開いた状態で AddBom を実行します。
BOM がなければ追加され、すでに追加されていれば何もしません。
また、空ファイルでなくても問題なく動作します。
