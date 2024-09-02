---
title: Gpg4winのgpg-agent.confの場所
description: Gpg4winのgpg-agent.confを置く正しい場所について
keywords:
  - Gpg4win
  - gpg
  - gpg-agent
category: note
authors: [mebiusbox]
tags: [gpg4win,gpg]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Gpg4win%e3%81%aegpg-agent.conf%e3%81%ae%e5%a0%b4%e6%89%80&subtitle=Gpg4win%e3%81%aegpg-agent.conf%e3%82%92%e7%bd%ae%e3%81%8f%e6%ad%a3%e3%81%97%e3%81%84%e5%a0%b4%e6%89%80%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2024%2F09%2F02&tags=gpg4win,gpg
---

Gpg4winのgpg-agent.confを置く場所について書いておきます．

<!-- truncate -->

Gitで署名付きコミットをするためにGPGキーが必要なので、Gpg4winをインストールしました．
WinGetでインストールできます．

```powershell
PS > winget install GnuPG.Gpg4win
```

現在のバージョンは `4.3.1` です．
キーを生成して、GitとGitHubに登録．
Gitの設定で常に署名付きコミットをするために以下の設定をしました．

```powershell
PS > git config --global commit.gpgsign true
```

また、gpg.exe のパスをgitに設定しておく必要があります．

```powershell
PS > git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

あとは、普通にコミットすればパスフレーズの入力が求められるので、正しく入力できればコミットできます．
署名付きコミットをGitHubにプッシュすれば、`Verified`がつきます．

:::info
グローバルで署名付きコミットを有効にしない場合、コミット時に `-S` オプションをつけると署名付きになります．
:::

:::info
署名付きでコミットされているかはGitのlogコマンドで `--show-signature` オプションを指定すると確認できます．
:::

で、パスフレーズの入力は gpg-agent がある程度キャッシュしてくれるのですが、その期間は標準だと10分しかありません．
最大で2時間です．現在の設定は `gpgconf` で確認できます．

```powershell
PS > gpgconf --list-options gpg-agent
```

標準のキャッシュ期間はちょっと短すぎるので、もっと長くしたいです．
そのためには `gpg-agent.conf` ファイルを生成して、そこに設定を書きます．
このファイルは `$env:appdata\gnupg\` に置きます．

ちなみに、このファイルの置き場所として `~\.gnupg\` に置くとネットでは書かれているものが多いのですが、
Gpg4win 4.3.1 では認識されませんでした．確認はしてませんが、Git for Windowsに同梱されている gpg はこちらを参照するようです．

設定ファイルを作成できたら、反映されたか確認します．

```powershell
PS > gpgconf --reload gpg-agent
PS > gpgconf --list-options gpg-agent
...
default-cache-ttl:24:0:expire cached PINs after N seconds:3:3:N:600::31536000
max-cache-ttl:24:2:set maximum PIN cache lifetime to N seconds:3:3:N:7200::31536000
...
```

以下のコマンドでも設定ファイルをリロードできるようですが、ちゃんと反映されているかどうかわからないので上記のコマンドをオススメします．

```powershell
PS > gpg-agent reloadagent /bye
```

以上です．
