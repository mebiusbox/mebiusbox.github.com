# コードハイライト

コードのハイライト機能は標準で `hilight` が有効になっています．

```cpp
#include <iostream>
int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

```js
console.log('Hello World!');
```

## prism

ハイライトのプラグインは他に `prism` があります．有効にする時は標準のハイライトプラグインを無効にしておきます．

```json
{
    "plugins": ["prism", "-highlight"]
}
```

![](/images/1575613032.png)

`prism` には以下のテーマが用意されています．

- Okaidia (prismjs/themes/prism-okaidia.css)
- Solarized Light (prismjs/themes/prism-solarizedlight.css)
- Tomorrow (prismjs/themes/prism-tomorrow.css)
- Dark (prismjs/themes/prism-dark.css)
- Coy (prismjs/themes/prism-coy.css)
- Funky (prismjs/themes/prism-funky.css)
- Twilight (prismjs/themes/prism-twilight.css)

テーマを指定するには次のようにします．

```json
{
    "pluginsConfig": {
        "prism": {
            "css": [
                "prismjs/themes/prism-solarizedlight.css"
            ]
        }
    }
}
```


![](/images/1575613495.png)

#### sunlight-highlighter

他のコードハイライトプラグインとして `sunlight-highlighter` がオススメです．これは行番号を表示することができます．

```json
{
    "plugins": ["sunlight-highlighter", "-highlight"],
    "pluginsConfig": {
        "sunlightHighlighter": {
            "theme": "gitbook",
            "lineNumbers": true
        }
    }
}
```

![](/images/1575614908.png)

テーマとして標準の `gitbook` の他に `light`, `dark` が用意されています．

![](/images/1575614955.png)

![](/images/1575614968.png)
