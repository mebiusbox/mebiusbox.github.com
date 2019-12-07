# 数式

数式を表示するには `mathjax` か `katex` プラグインを使います．
`Mathjax` は数式を表示するための Javascriptライブラリです．`Katex` は Mathjax より高速に処理しますが，表現できる数式に制限があります．まずは `mathjax` プラグインを使う場合は次のようになります．

```json
{
    "plugins": ["mathjax"],
    "pluginsConfig": {
        "mathjax": {
            "forceSVG": true,
            "version":  "2.7.6"
        }
    }
}
```

SVG形式で出力します．また，Mathjaxのバージョンがメジャーアップしているので，一応バージョンを指定しています．
次に `katex` の場合は次のようになります．

```json
{
    "plugins": ["katex"]
}
```

使い方は両方とも同じです．

{% raw %}
```
When {% math %}a \ne 0{% endmath %},
there are two solutions to {% math %}(ax^2 + bx + c = 0){% endmath %}
and they are {% math %}x = {-b \pm \sqrt{b^2-4ac} \over 2a}.{% endmath %}

When $$a \ne 0$$,
there are two solutions to $$(ax^2 + bx + c = 0)$$
and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```
{% endraw %}

When {% math %}a \ne 0{% endmath %}, there are two solutions to {% math %}(ax^2 + bx + c = 0){% endmath %} and they are {% math %}x = {-b \pm \sqrt{b^2-4ac} \over 2a}.{% endmath %}

When $$a \ne 0$$, there are two solutions to $$(ax^2 + bx + c = 0)$$ and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$


mathjax プラグインを使用している場合，次のようなエラーが出る場合があります．

    Error: TypeError: speech.processExpression is not a function

この場合は `node_modules/mathjax_node/mj-single.js` の `GetSpeech` 関数にある `speech.processExpression(result.mml)` を `speech.toSpeech(result.mml)` に書き換えます．