---
title: PowerShell+fzfでコマンド入力支援
description: PowerShellとfzfを組み合わせてコマンド入力支援環境を構築します
pagination_next: null
pagination_prev: null
---

import Bookmark from '@site/src/components/Markdown/WebBookmark.tsx'

最近はターミナルベースで作業することが多く、ターミナル環境を良くするために調整を繰り返している日々です．

正直なところ、コマンドを覚えるのが大変で結構しんどいなと思っています．基本としてなるべくタイプ量を減らしたいのでエイリアスやスニペットツールを合わせて利用しているのですが、それらもコマンドを覚える必要があります．今、作業している環境で使っているコマンド群と、別の作業で使うコマンド群が異なっていると、切り替えがなかなか追いつきません．少し時間が空くとなおさらです．そこでチートシートやメモツールなどを参照したりもするのですが、もう少しなんとかしたいところです．

本記事では、WindowsにおいてPowerShellとfzf(fuzzy finder)を使って、ターミナル上でコマンド入力支援環境を構築する方法についてまとめておきます．ちなみに、これは正月のお休み中に構築したもので、私でもまだ検証段階中であることをご了承ください．次の環境で試しています．

```
Windows11 Pro       22H2
Windows Terminal    1.15.3466.0
fzf                 0.33.0 (e03ac31)
```

また PowerShell のバージョンは次のようになっています．

```powershell title=powershell
> $PSVersionTable

Name                           Value
----                           -----
PSVersion                      7.3.1
PSEdition                      Core
GitCommitId                    7.3.1
OS                             Microsoft Windows 10.0.22621
Platform                       Win32NT
PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0…}
PSRemotingProtocolVersion      2.3
SerializationVersion           1.1.0.1
WSManStackVersion              3.0
```

`PSReadLine`を使います．PowerShellのバージョンが`7.3`以上であれば標準でインストールされています．また、fzf のインストールについては触れませんので各自インストールしてパスを通してください．あと、Rust製のツールを使いますので、`cargo` が使える環境を前提としています．


## はじめに

実はすでに先人がコマンド入力支援ツールを開発しています．

<Bookmark name="denisidoro / navi - GitHub" url="https://github.com/denisidoro/navi" description="An interactive cheatsheet tool for the command-line" />

`navi`はRust製のコマンドライン入力支援ツールです．これを使いたかったのですが、Windows環境への対応はよろしくありません．実行は出来ますが、コマンドが bash だったりするのでそのままでは使えません．一応、カスタマイズでシェルを指定することが出来ますが、例えばPowerShellを指定すると毎回プロフィール読み込みが入ってレスポンスが悪いですし、そもそもカスタマイズがまだ実験的機能になっています．あとは、チートシートをダウンロードしても内部的にCドライブでしか反応しないというちょっとよくわからんことになっています．カスタマイズでパスを指定できるんですが、試した感じ上手くいきませんでした．まだまだWindowsでは使いづらいようです．公式のIssueでも進捗は無い感じです．

<Bookmark name="Issues | denisidoro / navi - GitHub" url="https://github.com/denisidoro/navi/issues/40" description="Support Windows (cmd/Powershell) #40" />

ただ、このツールにはとてもインスパイアされました．

## それなら自分で作ろう

ということで、自分で navi を作ります．ただ、Rustで作るとかそういうことはせず、PowerShell(+PSReadLine)とfzf、さらに他のツールと連携して構築します．

次のようなものを作ります．

![](https://storage.googleapis.com/zenn-user-upload/912131671973-20230103.gif)

### チートシートデータ (YAML)

まず、チートシートのデータを作成します．今回はYAMLを採用しました．JSONでもいいのですが、今回のように数個のキーを持つハッシュとそれらの配列という単純な階層ではYAMLの方が見やすいかなと思いました．ただ、最終的にPowerShell上でハッシュテーブルとしてデータが持てればいいので、JSONでも構いませんし、JSONならPowerShell標準でサポートされています．

それでは、YAMLファイルを適当に作成します．場所はユーザーフォルダで、名前は `navi.yaml` とします

```powershell
$env:userprofile\navi.yaml
```

中身は次のような感じになります．

```yaml title=navi.yaml
items:
# general
  - echo_hello:
      description: Echo 'Hellom, World'
      command: echo Hello, World!
# git
  - git_init:
      description: Initialize a git repository
      command: git init
  - git_clone:
      description: Clone a git repository
      command: git clone <branch_name> <repository> <clone_directory>
...
```

`items`配列の中にコマンドを1つずつ定義していきます．コマンドはキー名と`description`、`command`を持ちます．区切り文字としてタブを使いますので、タブは含めないようにします．あと、日本語など英語以外は考慮していません．

次に、このファイルを読み込みます．PowerShellでのYAML読み込みは `powershell-yaml` を使います．以下を参考にしました．

<Bookmark name="PowerShellでYAMLを扱う - Qiita" url="https://qiita.com/tsukamoto/items/a3be3570bbc98f7f58ac" description="PowerShellでYAMLを扱う" />

最初に `powershell-yaml` をインストールします．

```powershell
Install-Module powershell-yaml
```

そして `navi.yaml` を読み込んでハッシュテーブルに変換します．

```powershell title=powershell
$data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
```

これでチートシートデータをPowerShellで扱えます．例えば次のように参照します．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
}
```

```powershell
> navi

echo_hello      Echo 'Hellom, World'    echo Hello, World!
git_init        Initialize a git repository     git init
git_clone       Clone a git repository  git clone <branch_name> <repository> <clone_directory>
git_fetch       Fetch a git repository  git fetch
...
```

:::tip
Visual Studio Codeのスニペットを使うと登録が楽になります．例えば次のようになります．

```json title=yaml.json
{
    "navi": {
        "prefix": "navi",
        "body": [
            "- $1:",
            "    description: $2",
            "    command: $3"
        ],
        "description": "Create an item for navi"
    }
}
```
:::

### fzf

次に、チートシートデータを fzf に渡します．

まずは、普通に処理すると次のようになります．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse
}
```

`--reverse`は入力のすぐ下に表示するオプションです．デフォルトではターミナルの一番下に表示されます．これを実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/703950884fa7-20230103.png)

これでは流石に使いづらいので調整します．fzfのプレビュー機能を使って選択中の説明やコマンドを見やすくします．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --preview 'echo {}'
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/5dc603d959e6-20230103.png)

どんどん調整していきましょう．fzf のpreviewオプションについては以下を参考にしました．

<Bookmark name="fzfのpreview関連のオプション調べてみた - Zenn" url="https://zenn.dev/eetann/articles/2022-08-27-fzf-preview" description="fzfのpreview関連のオプション調べてみた" />


まず、プレビューは右側ではなく上側に表示します．`--preview-window` で指定します．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0},{1},{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --preview 'echo {}' --preview-window=up:40% --reverse
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/a47d40276ae1-20230103.png)

ここでは、`up:40%` としましたが、環境に合わせて調整してください．プレビューが2行以上表示されればOKです．次に、プレビュー部分を調整します．まずは、表示される文字列を編集します．そのために、`sd`を使います．

<Bookmark name="chmin / sd - GitHub" url="https://github.com/chmln/sd" description="Intuitive find & replace CLI (sed alternative)" />

インストールはcargoコマンドで出来ます．他にも方法はありますので詳しくはドキュメントを参照してください．

```
cargo install sd
```

sdを使っていい感じに調整します．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --preview 'echo {} | sd "\"(\w+)\t+(.+)\t+(.+)\"" "$2 [$1]\n$3"' --preview-window=up:40%
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/536d4aa00fe9-20230103.png)

fzfのプレビューオプションで `--ansi`を指定すると色コードを含めることができます．次のように調整します．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --ansi --preview 'echo {} | sd "\"(\w+)\t+(.+)\t+(.+)\"" "\033[0;36m$2 \033[0;32m[$1]\n\033[1;93m> $3\033[0m"' --preview-window=up:40%
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/c83e96053aae-20230103.png)

:::info
色指定については以下を参考にしました．

<Bookmark name="How to change the output color of echo in Linux - stack overflow" url="https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux" description="How to change the output color of echo in Linux" />
:::

:::info
Windows Terminalでは色コードに対応したテーマの色が反映されます．
:::

キー名の部分が長くなるとfzfの候補が見づらくなるので調整します．タブで区切っていますので、`--tabstop`オプションで調整できます．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --ansi --preview 'echo {} | sd "\"(\w+)\t+(.+)\t+(.+)\"" "\033[0;36m$2 \033[0;32m[$1]\n\033[1;93m> $3\033[0m"' --preview-window=up:40% --tabstop=50
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/148ee53474eb-20230103.png)

コマンド部分は見切れてしまいますが、それはプレビューで確認するってことで．とりあえず、fzfのプレビュー調整はこんな感じです．

:::info
(追記)

PowerShellのエイリアス（または関数）、gitのエイリアスなどの情報も確認できるように追加してみました．`description` の末尾に `[<alias>]` という形でエイリアス名を記述し、それをプレビューに表示します．

```yaml title=navi.yaml
# Docker
  - docker:
      description: Docker command [dk]
      command: docker
  - docker_logs:
      description: Displays log of a container [dkl]
      command: docker logs <container>
  - docker_logs_follow:
      description: Displays log of a container (follow) [dklf]
      command: docker logs -f <container>
  - docker_images:
      description: Displays docker images [dki]
      command: docker images
...
```

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $command = $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    } | fzf --ansi --preview 'echo {} | sd "\"(\w+)\t+([^^\[]+)(\[.+\])?\t+(.+)\"" "\033[0;36m$2\033[0;91m$3 \033[0;32m[$1]\n\033[1;93m> $4\033[0m"' --preview-window=up:40% --tabstop=50
    if ($command -ne "") {
        if ($command -match '(\w+)\t+(.+)\t+(.+)') {
            if ($args.Length -gt 0 -and $args[0] -eq "-r") {
                Write-Host ("> {0}" -f $Matches.3)
                $Matches.3 | Invoke-Expression
            } else {
                Write-Output $Matches.3
                [Microsoft.PowerShell.PSConsoleReadLine]::AddToHistory($Matches.3)
            }
        }
    }
}
```

実行すると、次のようになります．エイリアス名が赤色で表示されます．

![](https://storage.googleapis.com/zenn-user-upload/c50be3cf7abd-20230104.png)
:::


### 選択したコマンドを使う

fzfで選択したコマンドを2種類の方法で使います．まず、PSReadLineの履歴に登録する方法です．これでコマンド履歴からコマンドを使用することができます．次のようになります．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $command = $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --ansi --preview 'echo {} | sd "\"(\w+)\t+(.+)\t+(.+)\"" "\033[0;36m$2 \033[0;32m[$1]\n\033[1;93m> $3\033[0m"' --preview-window=up:40% --tabstop=50
    if ($command -ne "") {
        if ($command -match '(\w+)\t+(.+)\t+(.+)') {
            Write-Host ("> {0}" -f $Matches.3)
            [Microsoft.PowerShell.PSConsoleReadLine]::AddToHistory($Matches.3)
        }
    }
}
```

実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/c4532899bdcc-20230103.png)

:::info
PowerShellのコマンド履歴がリスト形式ではない場合は次の設定をしてください．

```powershell
Set-PSReadLineOption -PredictionViewStyle ListView
```

または `F2` キーでリスト形式と標準形式とを切り替えることもできます．
:::

コマンド履歴は標準だとキーボードの`↑`キーで最後のコマンドをすぐに入力できますから、`navi`を実行した直後に`↑`キーでコマンド入力できます．

もう1つの方法は`navi`から直接実行する方法です．ここでは `navi` 関数の引数にオプションを指定して切り替えるようにし、`nav`という別の関数でオプション指定版を作成します．`nav` という名前は適当で末尾の`i`を除いただけです．

```powershell title=powershell
function navi() {
    $data = ConvertFrom-Yaml (Get-Content -raw $env:USERPROFILE\navi.yaml)
    $command = $data.items.keys | ForEach-Object {
        Write-Output ("{0}`t{1}`t{2}" -f $_, $data.items.($_).description, $data.items.($_).command)
    }
    | fzf --reverse --ansi --preview 'echo {} | sd "\"(\w+)\t+(.+)\t+(.+)\"" "\033[0;36m$2 \033[0;32m[$1]\n\033[1;93m> $3\033[0m"' --preview-window=up:40% --tabstop=50
    if ($command -ne "") {
        if ($command -match '(\w+)\t+(.+)\t+(.+)') {
            if ($args.Length -gt 0 -and $args[0] -eq "-r") {
                Write-Host ("> {0}" -f $Matches.3)
                $Matches.3 | Invoke-Expression
            } else {
                Write-Output $Matches.3
                [Microsoft.PowerShell.PSConsoleReadLine]::AddToHistory($Matches.3)
            }
        }
    }
}
function nav() {
    navi("-r")
}
```

`nav`を実行すると次のようになります．

![](https://storage.googleapis.com/zenn-user-upload/371b4fef4ffe-20230103.png)

`navi` と `nav` の使いわけですが、チートシートのコマンドにはわかりやすくプレースホルダーを入れたいです．例えば、次のようなコマンドです．

```
git clone <repository>
```

これを `nav` で直接実行してしまうと、もちろんエラーになります．その場合 `navi` でコマンド履歴に登録して、上記のコマンドを入力します．

![](https://storage.googleapis.com/zenn-user-upload/26c8000bc789-20230103.png)

(次図はnaviを実行してコマンド履歴からコマンドを入力した状態)

![](https://storage.googleapis.com/zenn-user-upload/60c8049e3e4a-20230103.png)

この状態で、`Ctrl+w`を押すと最後の引数を削除した状態になります．

![](https://storage.googleapis.com/zenn-user-upload/faa3baaf397c-20230103.png)

プレースホルダーが含まれているものは `navi` 、直接実行したい場合は `nav` という感じで使います．また、`nav` では実行するコマンドを `Write-Host` で出力しているのに対して、`navi`はコマンド履歴に登録すると同時に `Write-Output` で標準出力に出力しています．例えば、コマンドをクリップボードに設定したい場合は次のようにできます．

```powershell
navi | scb
```


### fzfのオプション

fzfの検索は標準であいまい検索です．入力した文字列がどこかに含まれていれば一致します．入力した文字の順番で一致（完全一致）したい場合は先頭にシングルクォーテーション(`'`)を入力します．例えば `'hoge` という感じです．常に完全一致にしたい場合、オプションで `-e` を指定するとシングルクォーテーションをつけずに完全一致で検索できます．この他に、先頭に `^` をつけると文字列が先頭に一致、`$` を末尾につけると文字列が終わりに一致するようになります．

次に、`--inline-info` をつけると一致数/総数が入力プロンプトのところと同じ行に表示されコンパクトになります．

![](https://storage.googleapis.com/zenn-user-upload/75dd66cf76ee-20230104.png)

さらに、選択中の項目をハイライト表示したい場合、例えば `--color=fg+:11` を指定します．

詳しくは以下が参考になります．

<Bookmark name="fzf（fuzzy finder）の便利な使い方をREADME, Wikiを読んで学ぶ - もた日記" url="https://wonderwall.hatenablog.com/entry/2017/10/06/063000#--ansi---nth---with-nth%E3%81%A8%E6%80%A7%E8%83%BD" description="fzf（fuzzy finder）の便利な使い方をREADME, Wikiを読んで学ぶ" />


## おわり

以上です．私もこの環境を構築したばかりなので、使ってみてメリット・デメリット、またはもっとよくできたら追記しようかなと思います．それでは．


