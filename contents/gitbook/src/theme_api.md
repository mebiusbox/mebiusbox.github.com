# theme-api sample

{% method %}
## 環境構築 {#env}

Miniconda (Anaconda) を使って環境を構築します．
まずは `GitBook` という仮想環境を作成します．

{% sample lang="shell" %}
```
conda create -n gitbook
conda activate gitbook
```

{% endmethod %}

{% method %}
## Node.js のインストール {#nodejs}
GitBook-cli は Nodejs アプリなので，Nodejs をインストールします．

{% sample lang="shell" %}
```
conda install nodejs
```

{% endmethod %}

{% method %}
## gitbook-cli のインストール {#gitbookcli}

npm を使って GitBook-cli をインストールします．

{% sample lang="shell" %}
```
$ npm install gitbook-cli -g
$ gitbook --version
CLI version: 2.3.2
GitBook version: 3.2.3
```

{% endmethod %}
