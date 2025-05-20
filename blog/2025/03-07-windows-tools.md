---
title: 最近導入したWindows用のツール
description: 最近導入して便利だと感じたツールの紹介
keywords:
  - windows
  - yazi
  - window-switcher
  - manictime
category: note
authors: [mebiusbox]
tags: [windows]
image: https://og-image-mebiusbox.vercel.app/api/og?title=%e6%9c%80%e8%bf%91%e5%b0%8e%e5%85%a5%e3%81%97%e3%81%9fWindows%e7%94%a8%e3%81%ae%e3%83%84%e3%83%bc%e3%83%ab&subtitle=%e6%9c%80%e8%bf%91%e5%b0%8e%e5%85%a5%e3%81%97%e3%81%a6%e4%be%bf%e5%88%a9%e3%81%a0%e3%81%a8%e6%84%9f%e3%81%98%e3%81%9f%e3%83%84%e3%83%bc%e3%83%ab%e3%81%ae%e7%b4%b9%e4%bb%8b&date=2025%2F03%2F07&tags=windows
---

最近、Windows用のツールを見直してインストールし直していました．
比較的ターミナルベースで操作することが多くなってきました．というのも、GUIのあるツールが減った感じがします．
ここでは、環境について少しお話します．その後に、導入してよく使っているツールを3つ紹介します．

<!-- truncate -->

## 環境

基本的に WinGet を使います．それ以外だと、cargo（Rust）や go を使います．一部のツールでは python モジュールだったり、node で実装されているものもありますが、かなり少なくしています．winget や [cargo-update](https://github.com/nabijaczleweli/cargo-update), [gup](https://github.com/nao1215/gup) を使うことで最新バージョンへのアップデートがとても楽になっています．以前はポータブル版をダウンロードして管理していましたが、普通にインストールするようにしました．ただ、すべてというわけではなく、やはり一部のツールは従来通りの方法で管理しているものもあります．

## yazi

[yazi](https://github.com/sxyazi/yazi) は Terminal File Manager です．以前は [lf](https://github.com/gokcehan/lf) を使っていました．
yaziはRust言語、lfはGo言語で開発されています．yaziは速いということですが、結構バックグラウンドタスクが多いので、そんなに快適さは感じられません．ファイル処理も100ファイル程度を操作すると固まることもあります．

正直 lf でも良さそうな感じは否めないですが、カスタマイズや拡張に関して yazi の方がとてもやりやすく感じました．yazi は plugin によって機能を拡張できます．プラグインはlua言語です．使っているツールでlua言語によるカスタマイズがいくつかあるので、やりやすいです．ただ、また情報は少ないといった印象を受けます．また、カスタマイズも結構しないと使い勝手はよくありませんが、ちゃんと設定すれば快適です．最近のWindowsTerminalでは画像プレビューもできるようになっています．

ちなみにファイル操作はターミナルだとyazi、それ以外だと [FreeCommander](https://freecommander.com/en/summary/) をまだ使っています．最近 [File Pilot](https://filepilot.tech/) というのが無料で使えるようになったようで、実際に使ってみたのですが、確かに爆速でした．が、残念ながらUnicode対応されておらず、日本語がまともに表示されません．一応、対応予定に入っているようです．設定も十分だったし良さそうなので、期待しています．

## window-swicher

[window-switcher](https://github.com/sigoden/window-switcher)は同じアプリケーションのウィンドウをすぐに切り替えることができるツールです．タスクの切り替えは [Alt-Tab Terminator](https://www.ntwind.com/software/alttabter.html) を使っていますが、同じアプリケーションを切り替える場合は window-swicher の方が便利です．複数のプロジェクトをワークスペースで管理する方法も試していたのですが、メリット・デメリットがあって、結局ワークスペースはあまり使わないようにしています．そうすると VS Code のウィンドウが多くなりがちですが、これでサクっと切り替えられます．ただ、注意点はあって、ショートカットキーが `Alt`+`` ` `` なのですが、ときどき悪さをします．不具合だと思いますが、`` ` `` が入力できなくなることがあるんですよね．適当に操作していると直ります．不満なところはこれですね．

:::info[2025/03/20 追記]
Visual Studio Code には `Switch Window` というコマンドがあるので、Visual Studio Codeだけならこれで十分でした．
:::

:::info[2025/05/21 追記]
ショートカットキーの暴発が結構ストレスで、結局使うのをやめました．
:::

## ManicTime

[ManicTime](https://www.manictime.com/) はトラッキングツールです．自分が何のアプリケーションを、どれくらい使っていたかを確認できます．
とくに設定が不要で、標準のままで使えます．GUIもよくできているので、わかりやすいです．あまり進捗がよくないときや、時間が取れてないなと感じたら ManicTime で確認してみると、何に時間を取られているのかがわかります．個人でかつローカルで使うだけなら無料版で十分です．

以上です．
