---
title: Eagleで無効なフォルダが存在する問題
description: Eagleで無効なフォルダが存在することがあり、ディスク容量を無駄に消費する場合があります
keywords:
  - Eagle
  - PowerShell
category: note
authors: [mebiusbox]
tags: [eagle, powershell]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Eagle%e3%81%a7%e7%84%a1%e5%8a%b9%e3%81%aa%e3%83%95%e3%82%a9%e3%83%ab%e3%83%80%e3%81%8c%e5%ad%98%e5%9c%a8%e3%81%99%e3%82%8b%e5%95%8f%e9%a1%8c&subtitle=Eagle%e3%81%a7%e7%84%a1%e5%8a%b9%e3%81%aa%e3%83%95%e3%82%a9%e3%83%ab%e3%83%80%e3%81%8c%e5%ad%98%e5%9c%a8%e3%81%99%e3%82%8b%e3%81%93%e3%81%a8%e3%81%8c%e3%81%82%e3%82%8a%e3%80%81%e3%83%87%e3%82%a3%e3%82%b9%e3%82%af%e5%ae%b9%e9%87%8f%e3%82%92%e7%84%a1%e9%a7%84%e3%81%ab%e6%b6%88%e8%b2%bb%e3%81%99%e3%82%8b%e5%a0%b4%e5%90%88%e3%81%8c%e3%81%82%e3%82%8a%e3%81%be%e3%81%99&date=2024%2F10%2F12&tags=eagle, powershell
---

Eagleを使っているとライブラリの中に無効なフォルダが存在することがあります．
ここではこの無効なフォルダに関する内容を残しておきます

<!-- truncate -->

[Eagle](https://jp.eagle.cool/)を使っていると、ライブラリの中に無効なフォルダがあることに気づきました．
この無効なフォルダとはEagleからは認識されていないフォルダのことです．

Eagleでは1つのファイルごとにディレクトリがライブラリの`images`ディレクトリの中に作成され管理されているようです．
その中に`metadata.json`ファイルやサムネイルなどが格納されています．
無効なフォルダはこの`metadata.json`ファイルが入っていません．ですから、Eagleからは認識されていないようです．
ただし、確認したのは検索で見つかるかどうかなので、もしかすると内部では参照している可能性もあります．
記憶が曖昧なので、それが削除したものなのかEagleの不具合によって発生したのか見当がつきません．
少なくともEagleでのごみ箱は空になっている状態で、検索で見つからない以上、無効なフォルダと言っていいでしょう．

無効なフォルダを調べてみると、削除したものや重複したものがありました．それらは不要なので削除しておきたいです．

この無効なフォルダを探す場合はライブラリ内のディレクトリを走査して`metadata.json`ファイルが存在するかどうかを確認すればよさそうです．
そこで、次のようなPowerShellスクリプトを作成してライブラリを走査し、無効なフォルダがあれば出力しています．また、削除する機能も入れました．

```powershell
function Move-ToRecycleBin() {
  [CmdletBinding(SupportsShouldProcess = $True, DefaultParameterSetName = 'Path')]
  Param (
    [SupportsWildCards()]
    [Parameter(
      Mandatory = $True,
      Position = 0,
      ParameterSetName = 'Path',
      ValueFromPipeline = $True,
      ValueFromPipelineByPropertyName = $True
    )]
    [string[]]$Path,

    [Alias('LP')]
    [Alias('PSPath')]
    [Parameter(
      Mandatory = $True,
      Position = 0,
      ParameterSetName = 'LiteralPath',
      ValueFromPipeline = $False,
      ValueFromPipelineByPropertyName = $True
    )]
    [string[]]$LiteralPath
  )
  Begin {
    $shell = New-Object -ComObject Shell.Application
    $trash = $shell.NameSpace(10)
  }
  Process {
    if ($PSBoundParameters.ContainsKey('Path')) {
      $targets = Convert-Path $Path
    } else {
      $targets = Convert-Path -LiteralPath $LiteralPath
    }
    $targets | Foreach-Object {
      if ($PSCmdlet.ShouldProcess($_)) {
        $trash.MoveHere($_)
      }
    }
  }
}

function CheckUnused() {
  [CmdletBinding()]
  param(
    [string]$LibraryPath,
    [switch]$Remove,
    [switch]$Force
  )

  if (Test-Path -LiteralPath $LibraryPath) {
    $ImagePath = Join-Path $LibraryPath "images"
    Get-ChildItem -Directory -LiteralPath $ImagePath | ForEach-Object {
      Write-Progress -Activity "Checking..." -Status $_.Name
      $metaDataJson = Join-Path $_.FullName "metadata.json"
      if (-not(Test-Path -LiteralPath $metaDataJson)) {
        Write-Host "Unused: $($_.FullName)"
        Get-ChildItem -LiteralPath $_.FullName | ForEach-Object {
          "    " + $_.Name
        }
        if ($Remove) {
          if ($Force) {
            Move-ToRecycleBin -LiteralPath $_.FullName
          } else {
            Move-ToRecycleBin -Literalpath $_.FullName -Confirm
          }
        }
      }
    }
  }
}
```

ここで使用している`Move-ToRecycleBin`はゴミ箱への削除機能で「[PowerShell でファイルやフォルダをごみ箱に入れる](https://zenn.dev/zuishin/articles/2019_03_02_1fa77bccd111b55f7bf6)」を参考にして作成したものです．

`CheckUnused`コマンドレットでEagleのライブラリをチェックします．`-LibraryPath`には`xxx.library` (xxxは任意)のパスを指定します．
`-Remove`で削除します．通常は削除確認しますが、`-Force`を有効にすれば確認せずに削除します．

なお、ここに記述しているコードは使用する場合は自己責任でお願いいたします．

以上です．
