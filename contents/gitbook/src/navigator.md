
# 目次の追加

いくつかプラグインがあります．

## navigator

右上に目次（折りたたみ可能），右下にトップに戻るボタンが追加されます．

```json
{
    "plugins": ["navigator"]
}
```

![](/images/1575622762.png)

![](/images/1575622801.png)


## page-treeview

ページの上部に目次をツリー形式で追加されます．

```json
{
    "plugins": ["page-treeview"]
}
```

![](/images/1575622941.png)

右下にコピーライト表記が追加されます．これは設定で消すことができます．また，目次に追加する見出しの調整も出来ます．

```json
{
    "pluginsConfig": {
        "page-treeview": {
            "copyright": "",
            "minHeaderCount": "2",
            "minHeaderDeep": "2"
        }
    }
}
```

## atoc

`page-treeview` で著作権表記を消すと上部に隙間が空いてしまいます．代わりに `atoc` プラグインを使えば，この隙間がなくなりスッキリします．

```json
{
    "plugins": ["atoc"]
}
```

ただし，`atoc` の場合は各ページに `<!-- toc -->` を追加しなければなりません．


## intopic-toc

右上に目次を表示します．標準では見出しレベル２のものが表示されます．

```json
{
    "plugins": ["intopic-toc"]
}
```

![](/images/1575626294.png)

後述する `back-to-top-button` プラグインと組み合わせるといい感じです．
