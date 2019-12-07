# PDF

gitbook は `Calibre` というアプリケーションを使って電子文書形式を作成することができます．
そのため，まずは `Calibre` を準備する必要があります．

- [Calibre](https://calibre-ebook.com/)

Windows版のインストーラをダウンロードしてインストールします．ポータブル版でも構いません．
ここでは "C:\Calibre" にインストールしたとします．

gitbook が `Calibre` を使用することができるようにパスを通す必要があります．
環境変数 `PATH` に `C:\Calibre\Calibre` を追加します．

これで各電子文書を作成することができます．PDFを作成する場合は次のコマンドを実行します．

```
gitbook pdf
```

上手く動作しない場合はPCを再起動してみましょう．環境変数が反映されていないかもしれません．


## Anaconda用の設定

個人的にシステム環境変数やユーザー環境変数の`PATH`に追加することはあまり好きではありません．なるべく，`PATH`の設定は最小限にしたいと思っていたりします．

今回は Anaconda を使っていて，gitbook という仮想環境を構築しています．
そこで，gitbook の仮想環境のときに，Calibre のパスが通るようにします．

gitbook が有効の状態にします．

```
$ conda activate gitbook
```

仮想環境のフォルダを取得します．

```
$ (gitbook) set CONDA_PREFIX
CONDA_PREFIX=C:\Miniconda3\envs\gitbook
```

`C:\Miniconda3\envs\gitbook\etc\conda\activate.d` というフォルダを作成し，そのフォルダ内に `env_vars.bat` というファイルを作成します．`env_vars.bat` の中身は次のようにします．

```
set PATH=C:\Calibre\Calibre;%PATH:C:\Calibre\Calibre;=%
```

このバッチファイルは `activate` したときに呼ばれるバッチファイルです．これで `activate` したときに `PATH` に Calibre が追加されます．

また，同様に `C:\Miniconda3\envs\gitbook\etc\conda\deactivate.d` というフォルダを作成し，`env_vars.bat` を作成すれば，`deactivate` されたときに呼ばれます．


## Mathjax

Mathjax で SVG 形式で出力設定をしている場合，PDF出力時に以下のエラーが出ます．

```
Error: Error with command "svgexport"
```

そこで `svgexport` をインストールします．

```
npm install -y svgexport -g
```


## Mermaid

どうやら pdf では図は出力されないようです．
このような場合はあらかじめ画像で出力しておいて表示するといった対応が必要になります．


## 出力設定

`book.json` の `pdf` で設定できます．例えば，本文書では次のような設定になっています．

```json
{
    "pdf": {
        "pageNumbers": true,
        "fontFamily": "VL Gothic",
        "fontSize": 10,
        "paperSize": "a4",
        "margin": {
            "right": 0,
            "left": 0,
            "top": 0,
            "bottom": 0
        },
        "headerTemplate": null,
        "footerTemplate": null
    }
}
```

PDF 出力時のスタイルシートは

```json
{
    "styles": {
        "pdf": "styles/pdf.css"
    }
}
```

とすれば，`pdf.css` で編集できます．

