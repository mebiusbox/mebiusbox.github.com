---
title: Three.jsのカラー管理
description: Three.jsの最新のカラー管理について
keywords:
  - Three.js
  - JavaScript
category: note
authors: [mebiusbox]
tags: [Three.js, JavaScript]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Three.js%E3%81%AE%E3%82%AB%E3%83%A9%E3%83%BC%E7%AE%A1%E7%90%86&subtitle=Three.js%E3%81%AE%E6%9C%80%E6%96%B0%E3%81%AE%E3%82%AB%E3%83%A9%E3%83%BC%E7%AE%A1%E7%90%86%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6&date=2023%2F12%2F16&tags=Three.js%2CJavaScript
---

Three.js のカラー管理は r152 から ColorSpace に変わりました．レンダリングにおいて結構大事なところなので調べてみました．

<!-- truncate -->

この記事は、前回 [Three.js を r116 から r159 にアップデートしたこと](/2023-12-15-bump-threejs-from-r116-to-r159.md) の続きです．
Three.js のバージョンを上げたときに `WebGLRenderer` の `.gammaInput`, `.gammaOutput` が無くなっていました．これはガンマ変換を制御するパラメータなのですが、最新版では `.outputColorSpace` となっており、 カラー空間を指定するように変更されています．ちなみに、その前は `.outputEncoding` という名前でカラーエンコーディングを指定するようになっていました．Three.js のカラー管理については公式のドキュメント[^1]にもあります（今のところ日本語訳はありません）．この記事はそのドキュメントに基づいて書いています．また、three.js のソースコードは r159 のものを参考にしています．

:::info
    Three.js のドキュメントでは、前提知識として原色、白色点、伝達関数、カラーモデル、色域について説明があります．興味がある方は読んでみてください．
    ここでは詳しく触れません．
:::


## リニアワークフロー

カラー管理はリニアワークフローのためにあります．リニアワークフローについては以下のサイトが参考になるでしょう：

- [分かる！リニアワークフローのコンポジット](http://compojigoku.blog.fc2.com/blog-entry-26.html)
- [物理ベースレンダリング -リニアワークフロー編](https://tech.cygames.co.jp/archives/2296/)

Three.jsでは主に sRGB 空間と Linear-sRGB 空間を扱います（他には [Display-P3](https://k-tai.watch.impress.co.jp/docs/column/keyword/1288035.html) があります）．基本として内部では Linear-sRGB 空間で処理し、Canvas に描画するときに sRGB 空間に変換して描画します．（Working color space と Output color space 参照[^1]）．重要なのは色を扱うときにカラー空間が影響してくるということです．特に THREE.Color（マテリアルやライト、シェーダ、頂点カラー）やテクスチャを扱っている場合に問題になってくることがあります．


## Three.js のカラー管理

Three.js のカラー管理は標準で有効になっています．

```javascript title="three/src/math/ColorManagement.js"
export const ColorManagement = {
    enabled: true,
    (...)
}
```

実際、以下のようにログを出力して確認すると `true` になっています．

```javascript
console.log( THREE.ColorManagement.enabled ); // true
```

先ほど述べたように Three.js の内部では Linear-sRGB で処理しています．また、レンダリングの出力では標準で sRGB となっています．

```javascript
const renderer = new THREE.WebGLRenderer();
console.log( this.renderer.outputColorSpace ); // srgb
```

次に、カラースペースの定義は次のようになっています．

```javascript title="three/src/constants.js"
// Color space string identifiers, matching CSS Color Module Level 4 and WebGPU names where available.
export const NoColorSpace = '';
export const SRGBColorSpace = 'srgb';
export const LinearSRGBColorSpace = 'srgb-linear';
export const DisplayP3ColorSpace = 'display-p3';
export const LinearDisplayP3ColorSpace = 'display-p3-linear';
```

## THREE.Color

カラー管理が何を行っているのか、THREE.Color を例に見てみましょう．
以下は `setHex` メソッドの実装です．

```javascript title="three/src/math/color.js
setHex( hex, colorSpace = SRGBColorSpace ) {

    hex = Math.floor( hex );

    this.r = ( hex >> 16 & 255 ) / 255;
    this.g = ( hex >> 8 & 255 ) / 255;
    this.b = ( hex & 255 ) / 255;

    ColorManagement.toWorkingColorSpace( this, colorSpace );

    return this;

}
```

`ColorManagement.toWorkingColorSpace` でカラー空間を調整しています．Working color space とは Three.js 内部でのカラー空間のことを指しています．
Three.js 内部のカラー空間は標準で Linear-sRGB 空間でした．

```javascript title="three/src/math/ColorManagemnt.js"
export const ColorManagement = {
    (...)

    _workingColorSpace: LinearSRGBColorSpace,

    get workingColorSpace() {
        return this._workingColorSpace;
    },

    (...)
}
```

`sexHex` では、入力カラー空間 `colorSpace` から Three.js 内部でのカラー空間への変換が行われていることがわかります．
実際の相互変換処理は Linear-sRGB 空間を経由して行われています．sRGB も Display P3 も Linear-sRGB 空間に変換してから、別のカラー空間に変換しています．
もちろん、カラー管理が無効になっていたり、入力と出力が同じカラー空間であれば何もしません．

`setHex` や `setStyle`, `setColorName` は入力カラー空間が `sRGB` になっているのに対して、`setRGB` や `setScalar`, `setHSL` は Working color space になっていることに注意が必要です．

```javascript title="three/src/math/Color.js"
setRGB( r, g, b, colorSpace = ColorManagement.workingColorSpace ) {

    this.r = r;
    this.g = g;
    this.b = b;

    ColorManagement.toWorkingColorSpace( this, colorSpace );

    return this;

}
```

THREE.Color には sRGB 空間と Linear-sRGB 空間への変換メソッドが用意されています．

```javascript title="three/src/math/Color.js"
copySRGBToLinear( color ) {

    this.r = SRGBToLinear( color.r );
    this.g = SRGBToLinear( color.g );
    this.b = SRGBToLinear( color.b );

    return this;

}

copyLinearToSRGB( color ) {

    this.r = LinearToSRGB( color.r );
    this.g = LinearToSRGB( color.g );
    this.b = LinearToSRGB( color.b );

    return this;

}

convertSRGBToLinear() {

    this.copySRGBToLinear( this );

    return this;

}

convertLinearToSRGB() {

    this.copyLinearToSRGB( this );

    return this;

}
```

`LinearToSRGB` と `SRGBToLinear` は次のようになっています．

```javascript title="three/src/math/ColorManagement.js
export function SRGBToLinear( c ) {

    return ( c < 0.04045 ) ? c * 0.0773993808 : Math.pow( c * 0.9478672986 + 0.0521327014, 2.4 );

}

export function LinearToSRGB( c ) {

    return ( c < 0.0031308 ) ? c * 12.92 : 1.055 * ( Math.pow( c, 0.41666 ) ) - 0.055;

}
```

set系のメソッドを見てきましたが、get系メソッドでも同様の変換処理が行われています．
ちなみに、このカラー管理を有効にすることは推奨となっています．
これからわかるように例えば `#123456` の値を `setHex` で設定したものと、`#123456` をRGBに変換して 255 で割った値をカラー空間を適切に設定せずにそのまま setRGB で設定すると結果が異なります．


## マテリアルやライトは？

これらは Working color space (標準では Linear-sRGB) での値と見なされます．
`BufferAttributes`での頂点カラーも同様です．


## テクスチャ

一番注意しなければならないのがテクスチャでしょう．
テクスチャがどのカラー空間なのかは自動で判別することはできないので、データ製作者および開発者側が適切なカラー空間を設定する必要があります．

テクスチャのカラー空間は `.colorSpace` プロパティで設定します．標準では `NoColorSpace` となっています．つまり、何も変換しません．

```javascript title="three/src/textures/Texture.js"
class Texture extends EventDispatcher {

    constructor( ..., colorSpace = NoColorSpace ) {
        ...
    }

}
```

例えば、カラーテクスチャ (Diffuse) を読み込んでテクスチャに設定する場合、sRGB 空間のデータならばカラー空間を設定します．

```javascript
const textureLoader = new THREE.TextureLoader();
textureLoader.load( 'textures/diffuse.jpg', function ( map ) {
    map.colorSpace = THREE.SRGBColorSpace;
} );
```

テクスチャに設定した ColorSpace はどのような処理を行っているのでしょうか．`three/src/renderers/webgl/WebGLTextures.js` を見てみると、WebGL のバージョンによって挙動が異なっているようです．WebGL1では場合によってCPU側で変換しているようです．WebGL2ではテクスチャのバッファーフォーマットで対応しているようです．


### レンダーテクスチャ

他にテクスチャを使っているところはレンダーターゲットのフレームバッファテクスチャです．
こちらも標準で `NoColorSpace` となっています．


## 出力カラー空間

`WebGLRenderer.outputColorSpace` で出力カラー空間を設定できることは述べました．
この値はどのように使われるのでしょうか？

マテリアルを使って描画するときに内部ではシェーダを生成していますが、そのときに使われています．
シェーダのお話になりますが、内部で `linearToOutputTexel` という関数を定義し、ピクセルシェーダの出力時に変換を行います．
MeshBasicMaterial や MeshStandardMaterial は自動で処理されますが、ShaderMaterial や RawShaderMaterial では自動で行ってくれません．
この場合、適切に処理する必要があります．

ShaderMaterial の場合は対応が簡単で、シェーダコードの中に `#include <colorspace_framgent>` を入れれば処理するようになります．
例えば次のようになります．

```c++
gl_FragColor = vec4( outputColor, outputAlpha );
#include <colorspace_fragment>
```

これは `gl_FragColor` に出力した後に入れます．ちなみに `colorspace_fragment` シェーダチャンクの中身は次のようになっています．

```c++
gl_FragColor = linearToOutputTexel( gl_FragColor );
```

RawShaderMaterial の場合は自分で実装する必要があります．
ちょっと面倒なので、 RawShaderMaterial は Working color space で処理して、最終的な出力などには ShaderMaterial などを使った方が楽な気がします．
ポストプロセスなど、WebGLRenderTarget に描画して色々やっている場合、特に何もしてなければ `NoColorSpace` なので今までと処理は変わりません．
レンダーターゲットが null のときに RawShaderMaterial を使っている場合、対応しないと `WebGLRenderer.outputColorSpace` は効果がありません．

:::info

Working color space は自由に書き換えることができるので、何か問題が起きたときに確認した方がいいかもしれません．

```javascript
THREE.ColorManagement.workingColorSpace = THREE.LinearDisplayP3ColorSpace;
```

:::


## さいごに

Three.js のカラー管理について調べたことをまとめました．
カラー空間が関係するメソッドには引数にカラー空間があったり、GLTFLoader などローダーが適切にテクスチャなどのカラー空間を設定する場合もあります．
何か勝手にやられると困るから全部自分でやってやるという場合には ColorManagement を無効にするのもありかもしれません．
今後、大きく変更があるとは思えないですが重要な部分ですので、レンダリングしたときに色がおかしいなと思ったらカラー空間を見直してみるのもありでしょう．

何か抜けがあったり間違っているところがあるかもしれません．その場合は、ご連絡いただけると幸いです．
以上です．

---

[^1]: [Color Management](https://threejs.org/docs/index.html#manual/en/introduction/Color-management)


