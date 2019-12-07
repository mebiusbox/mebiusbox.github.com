# 注釈

`footnote-string-to-number` を使うと便利です[^test]．文字列を数値に変換してくれます．

```json
{
    "plugins": ["footnote-string-to-number"]
}
```

次のように使います．

```
This is a pen[^pen].

[^pen]: I like it.
```

[^test]: description here
