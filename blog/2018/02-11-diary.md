---
layout: post
title: FileHammer：画像サイズと動画コーデック
category: note
tags: [diary]
authors: [mebiusbox]
---

開発日誌をつけて，開発を進める方法はありな気がします．日誌駆動開発．

<!-- truncate -->

動画コーデックとか，個人的にどうでもよくなったし，主流は H.264 や  H.265 かなと．これから AV1 というのも出て来るみたいですけど．
動画はサイズと長さがルールとして指定できればいいかなと思っています．とりあえず，sinku.dll が 32bit なので，64bit 版ではサポートしません．

画像サイズやサムネイル表示には，cximage と susie プラグインを使っていたのですが，cximage をやめて，opencv と stb_image を採用しました．
susie プラグインの 64bit 版にも対応しないとプラグインが使えないですね．とりあえず，opencv と stb_image で主流な形式は対応できると思います．

開発版として，今日か明日にでも 64bit 版が公開できるといいなーと考えています．
