# テーマ

デフォルトのテーマは `theme-default` です．他には `theme-api`, `theme-official` がいい感じです．テーマはそのテーマのプラグインを有効にすることで反映されます．まずは，デフォルトのテーマは次のようなものです．

![](/images/1575573086442.png)

上部にあるアイコンから，フォントの大きさやフォントのセリフ・サンセリフ，そして，テーマカラーの切り替えが出来ます．

![](/images/1575603981.png)

`Sepia`

![](/images/1575604054.png)

`Night`

![](/images/1575604070.png)

次に `theme-api` です．

```json
{
    "plugins": ["theme-api"]
}
```

![](/images/1575573100647.png)

`theme-api` は上の画像だと違いがわかりづらいですが，特徴的な機能として２列レイアウトがあります．

![](/images/1575573793167.png)

また，赤丸で囲んだアイコンをクリックすると通常表示と２列表示を切り替えることができます．このサンプルは以下のようになっています．

{% raw %}
```
{% method %}
## 環境構築 {#env}
    
Miniconda (Anaconda) を使って環境を構築します．
まずは `GitBook` という仮想環境を作成します．
    
{% sample lang="shell" %}
` ``
conda create -n gitbook
conda activate gitbook
` ``
    
{% endmethod %}
    
{% method %}
## Node.js のインストール {#nodejs}
GitBook-cli は Nodejs アプリなので，Nodejs をインストールします．
    
{% sample lang="shell" %}
` ``
conda install nodejs
` ``
    
{% endmethod %}
    
{% method %}
## gitbook-cli のインストール {#gitbookcli}
    
npm を使って GitBook-cli をインストールします．
    
{% sample lang="shell" %}
` ``
$ npm install gitbook-cli -g
$ gitbook --version
CLI version: 2.3.2
GitBook version: 3.2.3
` ``
    
{% endmethod %}
```
{% endraw %}

この `theme-api` にはダークモードがあります．これはプラグインの設定で指定します．

```json
{
    "plugins": ["theme-api"],
    "pluginsConfig": {
        "theme-api": {
            "theme": "dark"
        }
    }
}
```

![](/images/1575574076702.png)

`theme-default` ではコンテンツの幅が標準で 800px になっていますが，`theme-api` の場合，ウィンドウの幅に合わせて伸縮します．

次のテーマは，`theme-official` です．

```json
{
    "plugins": ["theme-official"]
}
```

![](/images/1575574347823.png)