---
title: cargo-makeを少し使いやすくする
description: cargo-makeをより使いやすくするためのPowerShellスクリプト
keywords:
  - cargo-make
  - PowerShell
category: note
authors: [mebiusbox]
tags: [make,cargo,powershell]
image: https://og-image-mebiusbox.vercel.app/api/og?title=cargo-make%e3%82%92%e5%b0%91%e3%81%97%e4%bd%bf%e3%81%84%e3%82%84%e3%81%99%e3%81%8f%e3%81%99%e3%82%8b&subtitle=cargo-make%e3%82%92%e3%82%88%e3%82%8a%e4%bd%bf%e3%81%84%e3%82%84%e3%81%99%e3%81%8f%e3%81%99%e3%82%8b%e3%81%9f%e3%82%81%e3%81%aePowerShell%e3%82%b9%e3%82%af%e3%83%aa%e3%83%97%e3%83%88&date=2024%2F09%2F15&tags=make,cargo,powershell
---

タスクランナーとしてcargo-makeを使用しています．
ここでは、より使いやすくするためのPowerShellスクリプトを作成したのでここに残しておきます．

<!-- truncate -->

[cargo-make](https://github.com/sagiegurari/cargo-make)はタスクランナーです．
汎用的に使えるタスクランナーを探していて、他にも [Just](https://github.com/casey/just) がありました．
cargo-makeは基本的にRust言語の開発用ツールですが、Rust言語以外でも汎用的に使うことができます．
また、Makefile形式よりかはTOML形式の記述に統一していきたいとも思っていて、cargo-makeを利用しています．
ちなみに、機能的にはどちらでも問題なさそうな感じでした．

cargo-makeを日常的に使っていて、ちょっとこういう機能が欲しいなとかここを改善してほしいなと思うところがありました．
そこで、PowerShellでWrapper関数（コマンドレット）を作成してみました．

## タスク一覧

まずは、タスクの一覧表示の改善です．cargo-makeは`--list-all-steps`オプションを指定することでタスクの一覧を表示できます．

```powershell
PS > cargo make --list-all-steps
[cargo-make] INFO - cargo make 0.37.16
[cargo-make] INFO - Build File: Makefile.toml
[cargo-make] INFO - Task: default
[cargo-make] INFO - Profile: development
Hooks
----------
end - By default this task is invoked at the end of every cargo-make run.
init - By default this task is invoked at the start of every cargo-make run.

No Category
----------
dev - Run gradio with watch mode [aliases: default]
resize - Resize image
serve - Serve app

Tools
----------
empty - Empty Task
```

正直なところ見やすいとは言いづらいですね．
これは数が少ないからいいですが、多くなってくるとわかりづらくなります．
カテゴリを指定するオプションもありますが、まずはどんなカテゴリがあるかの確認もしたいです．

これを整形して見やすくしましょう．
具体的には出力内容から必要な文字を読み取って、カスタムオブジェクトに変換して表示します．
こうすることで PowerShell上で色々操作ができるようになります．
ここではさらに[csview](https://github.com/wfxr/csview)を使って見やすく表示します．
そのためにカスタムオブジェクトからCSV形式に変換(`ConvertTo-Csv`)を使います．

これを使うと（コードは後述）さきほどのタスク一覧が次のように表示されます:

```powershell
PS > psmake -List
┌────────┬───────────────────────────────────────────────┬─────────────┐
│  Name  │                  Description                  │  Category   │
├────────┼───────────────────────────────────────────────┼─────────────┤
│ dev    │ Run gradio with watch mode [aliases: default] │ No Category │
│ resize │ Resize image                                  │ No Category │
│ serve  │ Serve app                                     │ No Category │
│ empty  │ Empty Task                                    │ Tools       │
└────────┴───────────────────────────────────────────────┴─────────────┘
```

## タスク選択

タスク一覧を表示する以外にも、インタラクティブなタスク選択機能も追加しました．
fzfを使ってタスクを選択します．

```powershell
PS > psmake -Sel
>
 6/6 (0)
> end - By default this task is invoked at the end of every cargo-make run
  init - By default this task is invoked at the start of every cargo-make run
  dev - Run gradio with watch mode [aliases: default]
  resize - Resize image
  serve - Serve app
  empty - Empty Task
```

## 複数のmakefile

あまり使うことはありませんが、`makefile.toml`とは別にローカル用のmakefileが欲しいことがありました．
そのため、fzfを使って手軽に切り替えられる機能を追加しました．

## コマンド実行

Windows環境なのでなるべくPowerShellで実行させたいですが、標準だと通常のコマンドプロンプトで実行されます．
プラグインだったり、スクリプトランナーにPowerShellを指定することで実行できます．
しかし、一時ファイルが生成されたり新しくプロセスが生成されるのでプロファイルの読み込みに時間がかかったりします．
`-nop`オプションを指定して、標準のプロファイル読み込みをさせないこともできますが、せっかく自作した便利な関数やコマンドレットを利用できないのはもったいないです．
そこで、設定ファイル（標準で`makefile.toml`）を読み込んで、開いているPowerShellプロンプトで実行する機能も追加しました．
ただし、機能は限定的でコマンドのみ、変数展開も`${@}`のみ対応しています．

これを実装するために、TOML形式からJSON形式に変換するのですが、これは[dasel](https://github.com/TomWright/dasel)を使用しました．
私は json や yaml などの解析は [yq](https://github.com/mikefarah/yq) を使っています．
yqは一応TOML形式も対応しているらしいのですが、基本的にまともに読み込めたことはないです．なのでTOML形式はdaselからJSON形式に変換して解析しています．
また、daselもデータ操作機能がありますが、jq/yq と互換はなく、ちょっと使いづらいです．

標準でdefaultタスクを参照します．また、defaultタスクの場合、aliasも参照するようにしています．

## psmake

これらをまとめて `psmake` という関数にまとめました．

```powershell title="psmake.psm1"
function psmake() {
  [CmdletBinding()]
  param(
    [string]$Name = "default",
    [string]$File = "makefile.toml",
    [switch]$List,
    [switch]$Sel,
    [string[]]$Arguments
  )

  $file = $File
  if ($file) {
    if (-not(Test-Path $file -PathType Leaf)) {
      Write-Error "Not found file [${File}]"
      return
    }
  } else {
    $file = Get-ChildItem "*.toml" | Where-Object {
      $_.Name -like "*makefile*.toml"
    } | ForEach-Object {
      $_.Name
    } | fzf
    if (-not($file)) { return }
  }

  if ($List) {
    $prevLine = ""
    $category = ""
    cargo make --makefile $file --list-all-steps | ForEach-Object {
      if ($_ -match "^(?<name>\w+?)\s-\s(?<desc>.*)$") {
        [PSCustomObject]@{
          Name = $Matches.name
          Description = $Matches.desc
          Category = $category
        }
      } elseif ($_ -match "^-+$") {
        $category = $prevLine
        $prevLine = ""
      } else {
        $category = ""
      }
      $prevLine = $_
    } | Where-Object { $_.Category -ne "Hooks" } | ConvertTo-Csv | csview
  } elseif ($Sel) {
    $tasks = cargo make --makefile $file --list-all-steps | ForEach-Object {
      if ($_ -match "^(?<name>\w+?)\s-\s(?<desc>.*)$") {
        [PSCustomObject]@{
          Name = $Matches.name
          Description = $Matches.desc
          Category = $category
          FullName = $_
        }
      }
    } | Where-Object { $_.Category -ne "Hooks" }
    $tasks | ForEach-Object {
      $_.FullName
    } | fzf | ForEach-Object {
      foreach ($task in $tasks) {
        if ($_ -eq $task.FullName) {
          Write-Host "Command: $($task.Name) ${Arguments}"
          cargo make --makefile $file $task.Name @Arguments
        }
      }
    }
  } else {
    $json = dasel -f $file -r toml -w json | ConvertFrom-Json
    $tasks = $json.tasks | Get-Member -MemberType Properties | Select-Object -ExpandProperty Name | ForEach-Object {
      $task = $json.tasks.($_)
      [PSCustomObject]@{
        Name = $_
        Category = $task.category
        Command = $task.command
        Args = $task.args
        Description = $task.description
        Alias = $task.alias
      }
    }
    $task = $tasks | Where-Object { $_.Name -eq $Name }
    if ($task) {
      if ($task.Alias) {
        $task = $tasks | Where-Object { $_.Name -eq $task.Alias }
      }
      $newArguments = $task.Args | ForEach-Object {
        if ($_ -eq "`${@}") {
          $Arguments
        } else {
          $_
        }
      }
      Write-Host "Command: $($task.Command) ${newArguments}"
      & "$($task.Command)" $newArguments
    } else {
      Write-Error "Not found Task [${Name}]"
    }
  }
}
```

syntaxは次のようになっています：

```powershell
NAME
    psmake

SYNTAX
    psmake [[-Name] <string>] [[-File] <string>] [[-Arguments] <string[]>] [-List] [-Sel] [<CommonParameters>]
```

## まとめ

とくに欲しかったのはタスク一覧とタスク選択機能です．
これで makefile.toml にどんどんタスクを追加していってもよさそうです．

以上です．
