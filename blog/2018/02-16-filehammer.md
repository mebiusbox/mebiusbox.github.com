---
layout: post
title: FileHammer  について
category: note
tags: [diary]
authors: [mebiusbox]
---

これまで32bit 版から以下の対応をしました．

<!-- truncate -->

- 64bit 版
- susie プラグインは 64bit 版（sph）ファイルに対応しました．
- 動画ルールを追加しました
- 重複ルールに xxHash を追加しました
- ID3 ルールを使うために dll を用意してもらう必要がなくなりました
- サポートしている画像形式：jpg, jpeg, jpe, jp2, pbm, ppm, pgm, png, tga, bmp, psd, gif, hdr, pic, pnm, tiff, tif, exr
- サポートしている動画形式：mp4, avi, wmv, mov
- 動作させるために「Visual Studio 2015 の Visual C++ 再頒布可能パッケージ」のインストールが必要です． [
https://www.microsoft.com/ja-jp/download/details.aspx?id=48145](https://www.microsoft.com/ja-jp/download/details.aspx?id=48145)
- 動作環境は　Windows10 64bit のみです．（サポート対象外ですが Windows7 でも動作確認済み）

※サポートしている画像形式や動画形式は仕様しているライブラリのドキュメントから抜粋しており，全ての形式で動作確認しているわけではありません．動画形式についてはコーデックによってサポートしていないものも存在します．

一通りやりたいことはやったので，あとは保守と何かあれば機能を追加するかもしれません．

---
[FileHammer](http://mebiusbox.github.io/software_file_hammer.html)
