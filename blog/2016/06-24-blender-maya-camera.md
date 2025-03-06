---
layout: post
title: Blender：カメラの操作をMayaと同じにする
category: note
tags: [Blender]
authors: [mebiusbox]
---

Blender のカメラ操作を Maya と同じに変更する方法を解説します。

<!-- truncate -->

Blender には操作方法を Maya に一括変更する設定がありますが、今回はカメラのみ Maya に合わせます。
`User Preference > Input` を開いて、`3D View(Global)` から `Rotate View`, `Move View`, `Zoom View` のキーを変更します。

項目 | キー
---|---
Rotate View | Alt Left Mouse
Move View | Alt Middle Mouse
Zoom View | Alt Right Mouse

![screen](/img/post/2016/2016-06-24-blender-maya-camera.png)

これでマウス操作が Maya と同じになりますが、`Edit Mode` にすると一部の操作が上手く動作しないことがあります（Blenderのバージョンによって挙動が変わる）。どうやら `Loop Select` と競合しているようなので無効にします。

![loopselect](/img/post/2016/2016-06-24-blender-maya-camera-loopselect.png)

これで Edit Mode でもカメラ操作が Maya と同じやり方で問題なく出来ました。
