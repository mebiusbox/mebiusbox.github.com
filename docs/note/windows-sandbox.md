---
title: Windowsサンドボックス
description: Windowsサンドボックスで基本的な環境を構築する方法を解説します
keywords:
  - Windowsサンドボックス
pagination_next: null
pagination_prev: null
image: https://og-image-mebiusbox.vercel.app/api/og?title=Windows%E3%82%B5%E3%83%B3%E3%83%89%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9&subtitle=Windows%E3%82%B5%E3%83%B3%E3%83%89%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A7%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E7%92%B0%E5%A2%83%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95%E3%82%92%E8%A7%A3%E8%AA%AC%E3%81%97%E3%81%BE%E3%81%99&date=2023%2F02%2F08&tags=Windows%E3%82%B5%E3%83%B3%E3%83%89%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9
last_update:
  date: 2023-02-08
  author: mebiusbox
---

Windowsサンドボックスは手軽にクリーンなWindows環境を作成して、アプリケーションのテストが行える機能です．別途ライセンスを購入する必要はなく、既存のライセンスで使用できます．Windows 10 や Windows 11 から使用できます．しかし、Homeエディションでは正式にサポートされていません．今回は、Windowsサンドボックスを使う機会があったので、ここにまとめておきます．環境は次の通りです．

```shell
Windows 11 Pro 22H2
```

また、本文の中で `<user>` と表記しているものは、お使いのPCのユーザー名に置き換えてください．


## Windowsサンドボックスを有効にする

詳しい手順は下記を参考にしてください．

https://learn.microsoft.com/ja-jp/windows/security/threat-protection/windows-sandbox/windows-sandbox-overview

## 基本的な環境

構築する環境は `WinGet`, `PowerShell`, `WindowsTerminal` の3つ(最新版)をインストールした状態にすることです．この3つがあれば、その後の環境構築が快適です．ただし、簡単には行きません．また、Windowsサンドボックスは言語が英語ですが、日本語に対応する方法も紹介します．では、手順を追って説明します．

## Microsoft Store

`WinGet` があれば `PowerShell` も `WindowsTerminal` もインストールできるはずです．しかし、WindowsサンドボックスにはMicrosoft Storeがありません．Microsoft Store経由でなく、直接 `WinGet` をインストールする必要があります．また、`WinGet`を使って`PowerShell` はインストールできますが、`WindowsTerminal` はインストールに失敗します．なので、別の方法でインストールする必要があります．

Windowsサンドボックスは毎回クリーンな環境となるので、その度にダウンロードするのは時間のムダです．ですから、3つともあらかじめダウンロードしておいて、インストールします．

それぞれのバージョンは次の通りです．

```shell
Windows Package Manager 1.4.10173
PowerShell 7.3.2
Windows Terminal 1.16.10262.0
```

## バイナリのダウンロード

### WinGet

まず、`WinGet` は以下からダウンロードできます．

[WinGet](https://github.com/microsoft/winget-cli)

`Releases` から `Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle` をダウンロードします．また、`VC++ v14 Desktop Framework Package` も必要ですので、こちらもダウンロードしておきます(`Microsoft.VCLibs.x64.14.00.Desktop.appx`)． リンクは上記のページにあります．

:::info
`Microsoft.VCLibs.x64.14.00.Desktop.appx`は同名でもビルド番号が違ったりするので、そのときの最新版を合わせておく必要があります．
:::

### PowerShell

PowerShellのバイナリは以下からダウンロードできます．

[PowerShell](https://github.com/PowerShell/PowerShell)

stable版を使います． `PowerShell-7.3.2-win-x64.msi`ファイルをダウンロードします．

### Windows Terminal

Windows Terminalのバイナリは以下からダウンロードできます．

[Windows Terminal](https://github.com/microsoft/terminal)

`Releases`から`Microsoft.WindowsTerminal_Win11_1.16.10262.0_8wekyb3d8bbwe.msixbundle`をダウンロードします．

また、他にも `Microsoft.UI.Xaml.x64.2.7` バンドルが必要です．これもバージョンを合わせる必要があり、`2.7.3`を使用します．下記サイトにある`Download package`リンクからダウンロードできます．

[Microsoft.UI.Xaml 2.7.3](https://www.nuget.org/packages/Microsoft.UI.Xaml/2.7.3)

ダウンロードした`microsoft.ui.xaml.2.7.3.nupkg`はNuGetパッケージですが、必要なのは中に含まれている `Microsoft.UI.Xaml.2.7.appx` です．nupkgはzipなので、展開して `./Tools/AppX/x64/Release/Microsoft.UI.Xaml.2.7.appx` を取り出します．取り出したら、`x64`アーキテクチャとわかるように `Microsoft.UI.Xaml.x64.2.7.appx` に名前を変えておきます．

### Sandboxフォルダ

これまでダウンロードした以下のファイルを、 `C:\Users\<user>\Sandbox`フォルダに入れておきます．フォルダがなければ任意のフォルダ名を作成して入れてください．

- `Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle`
- `Microsoft.WindowsTerminal_Win11_1.16.10262.0_8wekyb3d8bbwe.msixbundle`
- `Microsoft.VCLibs.x64.14.00.Desktop.appx`
- `Microsoft.UI.Xaml.x64.2.7.appx`
- `PowerShell-7.3.2-win-x64.msi`

## Windowsサンドボックス構成ファイル

Windowsサンドボックスのカスタマイズパラメータを記述する構成ファイルを用意します．拡張子は `.wsb` です．ファイルはXML形式です．

まず、Windowsサンドボックスでのユーザー名は `WDAGUtilityAccount` 固定です．ここでは、ダウンロードしたフォルダをマウントする設定を追加します．マウント先はホームフォルダ内の `Mount` とします．`Sandbox.wsb` ファイルを作成し、内容を次のようにします．

```xml title=Sandbox.wsb
<Configuration>
    <MappedFolders>
        <MappedFolder>
            <SandboxFolder>C:\users\WDAGUtilityAccount\Mount</SandboxFolder>
            <HostFolder>C:\users\<user>\Sandbox</HostFolder>
            <ReadOnly>true</ReadOnly>
        </MappedFolder>
    </MappedFolders>
</Configuration>
```

このファイルはどこに置いても構いません．私は`Sandbox`フォルダ内に入れています．このファイルを実行すれば、Windowsサンドボックスが起動します．起動しない場合、Windowsサンドボックスに関連付けておくと便利です．

## スクリプトファイル

Windowsサンドボックスを実行する前に、いくつかスクリプトファイルを作成しておきます．これらは`Sandbox`フォルダに入れておきます．スクリプトファイルは PowerShell です．個別に作成していますが、1つのまとまったスクリプトファイルにすることもできます

### ポリシー

まず、PowerShellスクリプトファイルを実行するためにポリシーを設定する必要があります．

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

コピペでもいいのですが、それも面倒なので `policy` というテキストファイルを用意して上記の内容にします．

### WinGetインストールスクリプト

WinGetのインストールスクリプト `install-winget.ps1` を作成します．内容は次のようになっています．

```powershell title=install-winget.ps1
Add-AppPackage -Path C:\users\WDAGUtilityAccount\Mount\Microsoft.VCLibs.x64.14.00.Desktop.appx
Add-AppPackage -Path C:\users\WDAGUtilityAccount\Mount\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
```

`Add-AppPackage`はPowerShellのコマンドレットで、パッケージのインストールを行います．

### PowerShellインストールスクリプト

PowerShell 7.3.2 のインストールスクリプト `install-powershell.ps1` を作成します．内容は次のようになっています．

```powershell title=install-winget.ps1
Start-Process msiexec -ArgumentList "/i PowerShell-7.3.2-win-x64.msi /passive" -Wait
```

もし、WinGet経由でインストールする場合、次のようにします．

```powershell title=install-winget.ps1
winget install -e --id Microsoft.PowerShell --source winget
```

### WindowsTerminalインストールスクリプト

WindowsTerminalのインストールスクリプト `install-terminal.ps1` を作成します．内容は次のようになっています．

```powershell title=install-terminal.ps1
Add-AppPackage -Path C:\users\WDAGUtilityAccount\Mount\Microsoft.UI.Xaml.x64.2.7.appx
Add-AppPackage -Path C:\users\WDAGUtilityAccount\Mount\Microsoft.WindowsTerminal_Win11_1.16.10262.0_8wekyb3d8bbwe.msixbundle
```

### 環境構築スクリプト

`WinGet`, `PowerShell`, `WindowsTerminal`の環境を構築するスクリプト `setup-en.ps1` を作成します．内容は次の通りです．

```powershell title=setup-en.ps1
./install-winget.ps1
./install-powershell.ps1
./install-terminal.ps1
```

これとは別に日本語版に対応した環境構築スクリプト `setup-ja.ps1` も用意します．内容は次の通りです．

```powershell title=setup-ja.ps1
Set-WinUserLanguageList -Force ja-JP
Set-Culture -CultureInfo ja-JP
./install-winget.ps1
./install-powershell.ps1
./install-terminal.ps1
```

`Set-WinUserLanguageList` と `Set-Culture` で日本語を指定しています．これは一番最初に設定しなければなりません．

### Sandboxフォルダの中身

この時点で、Sandboxフォルダの中身は次のようになっています．

```shell
📁Sandbox/
  ├──📄install-powershell.ps1
  ├──📄install-terminal.ps1
  ├──📄install-winget.ps1
  ├──📄Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
  ├──📄Microsoft.UI.Xaml.x64.2.7.appx
  ├──📄Microsoft.VCLibs.x64.14.00.Desktop.appx
  ├──📄Microsoft.WindowsTerminal_Win11_1.16.10262.0_8wekyb3d8bbwe.msixbundle
  ├──📄policy
  ├──📄PowerShell-7.3.2-win-x64.msi
  ├──📄Sandbox.wsb
  ├──📄setup-en.ps1
  └──📄setup-ja.ps1
```

## Windowsサンドボックス

準備が整ったので、Windowsサンドボックスを使います．
`Sandbox.wsb`を使用してWindowsサンドボックスを起動します．

![Windows Sandbox](/img/post/windows-sandbox-230208133744.png)

次に `PowerShell` を起動します．

![PowerShell](/img/post/windows-sandbox-230208133919.png)

カレントディレクトリが `C:\Users\WDAGUtilityAccount` になっています．マウント先のフォルダは `C:\Users\WDAGUtilityAccount\Mount` ですので、そこに移動します．

```powershell
PS > cd Mount
```

まず、ポリシーを適用します．

```powershell
PS > gc policy | iex
```

`gc` は `Get-Content`コマンドレットのエイリアスで、`policy`ファイルの中身を取り出します．それをパイプで `iex` に渡しています．`iex` は `Invoke-Expression`コマンドレットのエイリアスで、渡された文字列をコマンドとして実行します．これでPowerShellスクリプトファイルを実行できますので、`setup-en.ps1` (日本語なら `setup-ja.ps1`)を実行して構築します．

```powershell
PS > ./setup-en.ps1
```

または

```powershell
PS > ./setup-ja.ps1
```

スクリプトが正常終了してセットアップが完了したら、PowerShell画面を閉じて、ターミナルを起動します．

![Windows Terminal](/img/post/windows-sandbox-230208134605.png)

これで完了です．WinGetを使って他のアプリケーションをインストールできます．

以上です．参考になれば幸いです．
