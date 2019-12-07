# ソースコードの挿入

ソースコードのファイルを挿入してシンタックスハイライトを適用する `include-codeblock` プラグインがあります．

```json
{
    "plugins": ["include-codeblock"]
}
```

例えば次のような `src/main.cpp` ファイルがあります．

```cpp
#include <iostream>
int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

これをドキュメントに挿入する場合は次のようになります．

```
[include](main.cpp)
```

または

```
[import](main.cpp)
```

[include](main.cpp)

c++のソースコードを挿入すると言語は `c_cpp` となりますが，`prism` にはその言語に対応していません．
そこで，エイリアスを設定することで対応することができます．

```json
{
    "pluginsConfig": {
        "prism": {
            "lang": {
                "c_cpp": "cpp"
            }
        }
    }
}
```

`include-codeblock` ではテンプレートに `ace` を設定することができます．`ace` はエディタープラグインです．これを使って `monokai` テーマを適用すると

```json
{
    "plugins": ["include-codeblock", "ace"],
    "pluginsConfig": {
        "include-codeblock": {
            "template": "ace",
            "theme": "monokai"
        }
    }
}
```

![](/images/1575619890.png)

ただし，テンプレートを `ace` にした場合は `copy-code-button` プラグインの対象にならないようです．

`include-codeblock` には様々な機能があります．興味のある人は以下を参照してください．

- [gitbook-plugin-include-codeblock](https://github.com/azu/gitbook-plugin-include-codeblock)
