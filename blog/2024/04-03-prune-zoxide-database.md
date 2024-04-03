---
title: zoxideのデータベースを整理する
description: zoxideのデータベースからスコアを参照して整理するPowerShellスクリプト
keywords:
  - powershell
  - zoxide
category: note
authors: [mebiusbox]
tags: [zoxide,powershell]
image: https://og-image-mebiusbox.vercel.app/api/og?title=zoxide%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%82%92%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B&subtitle=zoxide%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%8B%E3%82%89%E3%82%B9%E3%82%B3%E3%82%A2%E3%82%92%E5%8F%82%E7%85%A7%E3%81%97%E3%81%A6%E6%95%B4%E7%90%86%E3%81%99%E3%82%8BPowerShell%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88&date=2024%2F04%2F03&tags=zoxide%2Cpowershell
---

zoxideのデータベースを参照してスコアの低いエントリを削除するpowershellスクリプトの紹介です．

<!-- truncate -->

[zoxide](https://github.com/ajeetdsouza/zoxide)はターミナルで使うcdコマンドの改良版です．cdコマンドで移動したディレクトリを履歴としてデータベースに保存し、あとは履歴を参照して移動したことがある場所に行き来するときに便利です．その際に、短い名前で履歴から一致した場所に移動できるので、よくディレクトリを切り替えたりするときに便利です．

履歴はzoxideのデータベースに格納されます．私の環境(Windows11)では以下の場所にありました．

```shell
C:\Users\<username>\AppData\Local\zoxide\db.zo
```

このファイルを削除すれば、データベースは初期化されます．
しかし、データベースの初期化ではなく、低いスコアのエントリを削除するためにpowershellスクリプトを作成しました．
これは、スコアが特定の値以下であるものを削除します．また、ついでに存在しないディレクトリであれば、それも削除します．
一応、zoxideは[一定期間(90日)](https://github.com/ajeetdsouza/zoxide/wiki/Algorithm#pruning)で似たようなことをしてくれるようです．

## エントリの閲覧

データベースの内容を確認するには`zoxide query`コマンドを使います．

```powershell
zoxide query [OPTIONS] [KEYWORDS]...
```

現在、有効なエントリを見るには `--list` または `-l` を指定します．

```powershell
zoxide query --list
```

無効なディレクトリも確認したい場合は、`--all` または `-a` を合わせて使います．

```powershell
zoxide query --list --all
```

また、スコアも表示したい場合は `--score` または `-s` を指定します．

```powershell
zoxide query --list --score
zoxide query --list --all --score
zoxide query -las
```

## powershellスクリプト

本題のスクリプトです．やっていることはエントリをスコア付きでリストアップし、各エントリごとにディレクトリの存在チェック、そしてスコアをチェックして、削除対象であれば、エントリをデータベースから削除します．削除するには`zoxide remove`コマンドを使います．

```powershell
function Prune-ZoxideDB([double]$threshold=1.0) {
    [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
    Write-Host ("Score threshold = {0}" -f $threshold)
    $total = 0
    $count = 0
    zoxide query --list --all --score | ForEach-Object {
        $total++
        if ($_ -match '([0-9]+\.[0-9]+)\s+(.+)') {
            $score = [double]$Matches.1
            $path = $Matches.2
            if (-Not(Test-Path -LiteralPath $path)) {
                zoxide remove $path
                Write-Host ("Not Exist (removed). [{0}]" -f $path)
                $count++
            }
            elseif ($score -lt $threshold) {
                zoxide remove $path
                Write-Host ("{0}, {1} (removed)" -f $score, $path)
                $count++
            }
        }
    }
    Write-Host ("total={0} removed={1}" -f $total, $count)
}
```

- 標準でスコアは 1.0 未満を削除するようにしています．
- コンソールに詳細（日本語含む）を出力するためにUTF8エンコーディングに変更しています．

次のように使います．

```powershell
Prune-ZoxideDB
Prune-ZoxideDB 0.8
```

以上です．

:::note
PowerShellのcdコマンド(Set-Location)では名前の先頭に`[]`があると、ディレクトリ名として正しく認識できません．その場合、`-LiteralPath` を指定する必要があります．

- [https://github.com/PowerShell/PowerShell/issues/16476](https://github.com/PowerShell/PowerShell/issues/16476)
- [https://github.com/ajeetdsouza/zoxide/issues/312](https://github.com/ajeetdsouza/zoxide/issues/312)

例えば、次のように標準の cd エイリアスを無効にして、新しいcd関数を定義することができます．

```powershell
if (Test-Path alias:cd) {
    Remove-Alias cd
}
function cd ([string]$Path) {
    Set-Location -LiteralPath $Path
}
```

powershellのエイリアスはパラメータを指定することが出来ないため、関数として定義します．この方法でも zoxide は有効になります．
:::
