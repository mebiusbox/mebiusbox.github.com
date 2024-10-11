---
title: ForEach-Objectにおけるcontinueとbreakについて
description: 誤解を招きやすいForEach-Objectでのcontinueとbreakについて
keywords:
  - foreach
  - "ForEach-Object"
  - powershell
category: note
authors: [mebiusbox]
tags: [powershell]
image: https://og-image-mebiusbox.vercel.app/api/og?title=ForEach-Object%e3%81%ab%e3%81%8a%e3%81%91%e3%82%8bcontinue%e3%81%a8break%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&subtitle=%e8%aa%a4%e8%a7%a3%e3%82%92%e6%8b%9b%e3%81%8d%e3%82%84%e3%81%99%e3%81%84ForEach-Object%e3%81%a7%e3%81%aecontinue%e3%81%a8break%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2024%2F10%2F11&tags=powershell
---

ForEach-Object内での`continue`や`break`に関する備忘録です．

<!-- truncate -->

PowerShellでパイプライン処理のfor文として `ForEach-Object` をよく使います．これは `foreach` や `%` のエイリアスがあります．
この `foreach` エイリアスと `foreach(in)` は別物です．本文では `foreach(in)` は次のような構文を指しているとします．

```powershell
foreach ($i in $arr) {
}
```

`ForEach-Object` は便利な反面、誤解を招きやすいものだと思います．
実際、AIチャットも見当違いな回答をしていましたし、ネットでも間違った内容が見受けられました．
かくいう私も絶対の確信をもっていっているわけではないので、ご了承ください．動作環境はPowerShell`7.4.5`です．

## ForEach-Object に continue や break は使えない

これがすべてです．使えるのは `return` です．`ForEach-Object`はパイプライン処理であって、`continue`や`break`はパイプラインに直接作用しません．
`continue`や`break`が作用するのは内側のループ処理に対してです．ちなみに、ループがなければプログラム全体に作用しますので、その場合はプログラムが終了します．

たとえば次のプログラムでは、`continue` が実行されたときにプログラムが終了します．

```powershell title="test.ps1"
1..5 | ForEach-Object {
    if ($_ -gt 3) {
        continue
    }
    $_
}
Write-Host "CHECKPOINT"
```

この出力は次のようになります．

```powershell
1
2
3
```

`CHECKPOINT`は出力されません．これは `break` でも同じです．

```powershell
1..5 | ForEach-Object {
    if ($_ -gt 3) {
        break
    }
    $_
}
Write-Host "CHECKPOINT"
```

この場合、次のように`return`を使うと意図した動作になります．

```powershell
1..5 | ForEach-Object {
    if ($_ -gt 3) {
        return
    }
    $_
}
Write-Host "CHECKPOINT"
```

この出力は次のようになります．

```powershell
1
2
3
CHECKPOINT
```

このコードではすべてのパイプラインが実行されていることに注意してください．5回処理されています．
`break`のように中断されるわけではありません．
`continue`や`break`を使いたい場合は、ループ回数が分かっているなら `foreach(in)` を使うか `for`文を使いましょう．

では、パイプライン処理で中断させたいときはどうすればいいでしょうか．1つの方法としてパイプラインの外にループを入れて`break`することです．

```powershell
do {
    1..5 | ForEach-Object {
        if ($_ -gt 3) {
            break
        }
        $_
    }
} while ($false)
Write-Host "CHECKPOINT"
```

この出力は次のようになります．

```powershell
1
2
3
CHECKPOINT
```

`continue`や`break`は`ForEach-Object`に対して使いたくなるし、`foreach`というエイリアスもあって間違えやすいですよね．
以上です．
