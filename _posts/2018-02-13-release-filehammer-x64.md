---
layout: post
title: FileHammer  1.20.1 (64bit版) リリース
category: note
tags: [diary]
---

## 1.20.1
- 重複ルールとファイル一致ルールに xxHash を追加

## 64bit版について

一部機能が削除されていたりします．これは開発版です．動作が以前より不安定になっている可能性があります．

## 32bit版と違うところ
- susie プラグインが動作しなくなっています
- ID3 ルールを使うために dll を用意してもらう必要がなくなりました
- サポートしている画像フォーマットが変わっています．
- 動作させるために「Visual Studio 2015 の Visual C++ 再頒布可能パッケージ」のインストールが必要です． [
https://www.microsoft.com/ja-jp/download/details.aspx?id=48145](https://www.microsoft.com/ja-jp/download/details.aspx?id=48145)
- 動作環境は　Windows10 64bit のみです．（サポート対象外ですが Windows7 でも動作確認済み）

## ダウンロード

- [インストーラ](http://mebiusbox.sakura.ne.jp/bin/dl.php?dl=FileHammerSetupX64)
- [zip](http://mebiusbox.sakura.ne.jp/bin/dl.php?dl=FileHammerX64)
