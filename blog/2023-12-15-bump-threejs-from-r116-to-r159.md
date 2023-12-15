---
title: Three.js を r116 から r159 にアップデートしたこと
description: Pixy.js で使用している Three.js のバージョンを r116 から r159 まで上げました
keywords:
  - Three.js
  - Javascript
category: note
authors: [mebiusbox]
tags: [Three.js,JavaScript]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Three.js%20%E3%82%92%20r116%20%E3%81%8B%E3%82%89%20r159%20%E3%81%AB%E3%82%A2%E3%83%83%E3%83%97%E3%83%87%E3%83%BC%E3%83%88%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8&subtitle=Pixy.js%20%E3%81%A7%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%20Three.js%20%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%92%20r116%20%E3%81%8B%E3%82%89%20r159%20%E3%81%BE%E3%81%A7%E4%B8%8A%E3%81%92%E3%81%BE%E3%81%97%E3%81%9F&date=2023%2F12%2F16&tags=Three.js%2CJavaScript
---



最近、[Pixy.js](https://github.com/mebiusbox/pixy.js) で使用している Three.js のバージョンを r116 から最新の r159 までアップデートしたので、それについてまとめておきます．

<!-- truncate -->

[EffectTextureMaker](http://mebiusbox.github.io/contents/EffectTextureMaker/)というエフェクト用のテクスチャを作成するツールを公開しているのですが、ちょくちょく要望が来たり質問されたりしていました．
機能を追加する前に、まずは最新の環境に更新することにしました．EffectTextureMakerでは自作したシェーダライブラリ Pixy.js を使用しているのですが、これは Three.js を使って実装しています．なので、Three.js を最新にアップデートする必要があります．長い間手をつけずにいたのでバージョンが r116 から最新の r159 まで2年間もの期間が空いたことになります．その間に Three.js も色々変わっていました．

## Three.js で気になった変更部分

2020年5月に Three.js の r116 がリリースされ、同時に Pixy.js も更新していました．そこで r116 まで遡ってログを見直しました．以下が気になった変更点です．ほとんどが対応する必要がありました．

- ESM への対応 (three.module.js, three.module.min.js)
- ライブラリが /lib から アドオン /jsm に変わった
- インポートマップを使ってライブラリをインポートし、ESM で実装するようになった
- dat.GUI から lil-gui に変更された
- WebGL2 の対応 (GLSL3)
- WebGPURenderer実装された
- Matrix の getInverse() が廃止され、 invert() に変更された
- PlaneBufferGeometry などがなくなり PlaneGeometry というように単純になった
- BufferGeometryUtils にあった computeTangents が BufferGeometry に実装された
- Geometryの頂点が .vertices ではなく BufferAttribute 経由で取得するようになった
- WebGLMultipleRenderTargets (MRT) が実装された
- UBO (Uniform Buffer Objects)対応
- RGBFormat が無くなった
- CommonJS 形式である three.js, three.min.js が deprecated．r160 で削除される予定（コンソールに警告が出力される）
- カラー管理が colorspace になった

ということで、以下対応した内容です．


## ESModuleの対応

Pixy.js の一部のコードは ESM 形式になっていたので、他の部分も ESM に書き直しました．
また、ES6の class で再実装するようにしました．


## Rollupの更新

Pixy.js は Three.js と同様に rollup でまとめています．こちらも ESModule 形式で出力するようにしました．


## サンプルの修正

インポートマップを使用し、すべてを ESM に変更．また、JavaScriptファイルを外部に出してメンテナンスしやすいようにしました．


## アドオン

アドオンになってインポートするコードは次のようになります．

```javascript
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

使用するときに THREE をつけないので微妙に違和感を感じます．


## Matrix.invert()

具体的には以下のようなコード：

```javascript
projectionCamera.matrixWorldInverse.getInverse(projectionCamera.matrixWorld);
```

これが次のようになります．

```javascript
projectionCamera.matrixWorldInverse.copy( projectionCamera.matrixWorld ).invert();
```

これは `normalize()` などと同じ書き方になりました．


## BufferGeometryUtils.computeTangents()

BufferGeometry に移動したので楽になりました．

```javascript
const sphereGeometry = new THREE.SphereBufferGeometry(2, 64, 64);
THREE.BufferGeometryUtils.computeTangents(sphere.geometry);
```

変更後．

```javascript
const sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
sphereGeometry.computeTangents();
```


## WebGLMultipleRenderTargets (MRT)

MRTがThree.jsにも実装されました．Pixy.js の[ディファードレンダリング](https://mebiusbox.github.io/contents/pixyjs/samples/shader_deferred.html)の部分で使用しています．


## XXXBufferGeometry

単純に Buffer を消せば問題ありませんでした．


## RGBFormat

レンダーターゲットの生成時に指定していたのですが、定数から消えていました．
標準で RGBAFormat であり、alpha パラメータで制御するようになったのかもしれません．詳しく調べていないです．


## カラー空間

r152 で ColorManagement API が ColorSpace ベースになりました．最初は gammaInput, gammaOutput、次に outputEncoding 、そして今は outputColorSpace になったようです．これについては別のエントリで書こうと思います（まだ調査中）．


## lil-gui

GUIメニューの表示に dat.GUI が使われていましたが、lil-gui に変更されました．
ある程度互換がありますが、完全に互換があるわけではありません．lil-gui に dat.GUI からの[マイグレーションガイド](https://lil-gui.georgealways.com/#Migrating)があるので参考になります．


## GLSL3

ShaderMaterial の `glslVersion` で指定することができます．

```javascript
shaderMaterial.glslVersion = THREE.GLSL3;
```

Three.js 側でマクロを使って GLSL3 でコンパイルできるようになっているので、前のバージョンで書かれたシェーダコードでもそのままコンパイルされるようです．
ですが、RawShaderMaterial を使っている場合は自分で対応しなければなりません．
GLSL3 のシェーダコードは先頭に `#version 300 es` を入れるのですが、RawShaderMaterialでも自動で入れてくれます．
ここで、`fwidth` などを使うために以下のコードを入れる必要があって、RawShaderMaterialを使う場合はこちらでシェーダコードに入れてました．

```
#extension GL_OES_standard_derivatives : enable
```

どうもこの辺りの宣言順番が問題となってGLSL3にするとコンパイルエラーとなっていました．
結局 ShaderMaterial の extensions で derivatives を有効にすることで対応できました．

基本的に Three.js と同様に GLSL3 への対応はマクロを使って対応し、シェーダコードは以前のままになっているのですが、MRTを使った部分だけは `layout(location)` を使っています．GLSL3 では `gl_FlagData` は使えないので．


## WebGLRenderer.render()

引数に WebGLRenderTarget を渡すことが出来たのですが、それが出来なくなっていました．なので、`setRenderTarget` で設定するようにしました．


## おわりに

Three.js の対応というよりかは ESModule などの JavaScript 関連や開発環境周りの情報更新の方が大変だった気がします．
以上です．

