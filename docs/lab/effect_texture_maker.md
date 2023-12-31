---
title: EffectTextureMaker
description: EffectTextureMakerはブラウザで主にエフェクト用のテクスチャを作成することができるものです
keywords:
  - EffectTextureMaker
  - Three.js
  - シェーダー
  - テクスチャ
  - Vfx
image: https://og-image-mebiusbox.vercel.app/api/og?title=EffectTextureMaker&subtitle=EffectTetureMaker%E3%81%AF%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%A7%E4%B8%BB%E3%81%AB%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%88%E7%94%A8%E3%81%AE%E3%83%86%E3%82%AF%E3%82%B9%E3%83%81%E3%83%A3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99&date=2023%2F01%2F11
last_update:
  date: 2023-12-31
  author: mebiusbox
---

# EffectTextureMaker

[EffectTextureMaker](http://mebiusbox.github.io/contents/EffectTextureMaker/) は，ブラウザで主にエフェクト用のテクスチャを作成することができるものです．様々な種類のテンプレートを選択して，適当にパラメータを調整するだけで，簡単かつ直感的にテクスチャを作成することができます．また，アニメーションにも対応しており，特定のフレームごとにレンダリングした画像をまとめたスプライトシートも作成することができます．さらに詳しいことは [この記事](/blog/2017/01/06/EffectTextureMaker) を参照してください．


## 機能

- 67種類のエフェクトテンプレートがあります
- セーブ・ロード機能
- ノーマルマップを作成することができます
- スプライトシートを作成することができます
- ブラウザがサポートしている画像形式で保存することができます
- 最大 2048 サイズに対応しています
- カラーバランス調整により，色の指定をハイライト，中間，シャドウの３つに分けて行うことができます


## ライセンス

EffectTextureMaker で作成したテクスチャは商用・非商用問わず，自由に使ってもらって構いません．作成したテクスチャは CC0 (Creative Commons Zero) が適用されます．

![EffectTextureMaker](/img/lab/EffectTextureMaker.gif)


## 使い方

<div className="container">
  <div className="row">
    <div className="col">
      <ol>
        <li>解像度を決める (resolution)</li>
        <li>生成するエフェクトの種類を選択する (type)</li>
        <li>パラメータを適当に調整する (Parameters)</li>
        <li>Saveボタンを押すとレンダリングした画像が開きますので保存してください．</li>
      </ol>
    </div>
    <div className="col">
      <img src="/img/lab/EffectTextureMaker_HowToUse.png" />
    </div>
  </div>
</div>

### time

時間．アニメーションするタイプのエフェクトで使えます．

### animate

エフェクトをアニメーションします．一部のエフェクトで使えます．

### polarConversion

エフェクトを極座標変換します．

### Toon

トゥーンシェーディングします．暗い部分(dark)、明るい部分(light)、それ以外の3諧調です．

|  項目  |       意味       |
| ------ | ---------------- |
| enable | 有効にします     |
| dark   | 暗い部分の割合   |
| light  | 明るい部分の割合 |

### Tiling

エフェクトの上下左右をループするように処理します．（イマイチです）

|    項目     |             意味             |
| ----------- | ---------------------------- |
| enable      | 有効にします                 |
| radial mask | 境界の交わり具合を調整します |

### NormalMap

法線マップに変換します．輝度を高さとして勾配を求めます．

|     項目     |      意味      |
| ------------ | -------------- |
| generate     | 有効にします   |
| cHeightScale | 高さのスケール |

### ColorBalance

エフェクトにカラーバランスの色調補正をかけます．

|       項目        |       意味       |
| ----------------- | ---------------- |
| Shadows           | 暗い部分         |
| Midtones          | 中間の部分       |
| Highlights        | 明るい部分       |
| resetColorBalance | 初期値に戻します |

### SpriteSheet

アニメーションするエフェクトを1枚のテクスチャに並べて生成します（スプライトシート）．

|    項目    |           意味           |
| ---------- | ------------------------ |
| dimension  | 画像の分割数です         |
| time       | アニメーションの開始時間 |
| timeLength | アニメーションの長さ     |
| timeStep   | ステップ時間             |

例えば、以下のような設定だとします：

- resolution : 512
- dimesion : 8
- time : 0
- timeLength : 3
- timeStep : 0.1

これは `512x512` の画像の中に最大で `16` 個のスプライトを描画します．つまり1つのスプライトのサイズは `64x64` (512/8)で最大64個となります．
`0` を開始時間として、 `0.1` 秒ごとに1つのスプライトを描画し、それを `3` 秒分行います．スプライトの最大数に達すればそこで描画が終了します．

![SpriteSheet](/img/lab/EffectTextureMaker_SpriteSheet.png)


### Image with alpha (PNG)

アルファチャンネル付きのPNG形式で保存します．これは実験的な機能です．
また、スプライトシートの保存には使えません．

|      項目      |             意味             |
| -------------- | ---------------------------- |
| threshold      | 0 (黒)に切り捨てる閾値       |
| tolerance      | 1 (白)に切り上げる下限値     |
| blur           | 全体にブラー処理をかける強さ |
| visible        | アルファを確認します         |
| Save (PNG)     | 保存します                   |
| Download (PNG) | ダウンロードします           |

Save と Download の2種類がありますが、ブラウザ互換のために用意しているだけなのでどちらを使っても構いません．


## セーブとロード

JSON形式で保存したり読み込んだりすることができます．それぞれコントローラーの上にある `save` と `load` ボタンを押してください．


## ギャラリー

<div className="container">
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_wood.gif" alt="Wood" />
      <div className="mbx-center margin-bottom--sm">Wood</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_circle.gif" alt="Circle" />
      <div className="mbx-center margin-bottom--sm">Circle</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_solar.gif" alt="Solar" />
      <div className="mbx-center margin-bottom--sm">Solar</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_corona.gif" alt="Corona" />
      <div className="mbx-center margin-bottom--sm">Corona</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_spark.gif" alt="Spark" />
      <div className="mbx-center margin-bottom--sm">Spark</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_ring.gif" alt="Ring" />
      <div className="mbx-center margin-bottom--sm">Ring</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_gradation.gif" alt="Gradation" />
      <div className="mbx-center margin-bottom--sm">Gradation</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_gradationline.gif" alt="GradationLine" />
      <div className="mbx-center margin-bottom--sm">GradationLine</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flash.gif" alt="Flash" />
      <div className="mbx-center margin-bottom--sm">Flash</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cone.gif" alt="Cone" />
      <div className="mbx-center margin-bottom--sm">Cone</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_flower.gif" alt="Flower" />
      <div className="mbx-center margin-bottom--sm">Flower</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flowerfun.gif" alt="FlowerFun" />
      <div className="mbx-center margin-bottom--sm">FlowerFun</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_wavering.gif" alt="WaveRing" />
      <div className="mbx-center margin-bottom--sm">WaveRing</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_smoke.gif" alt="Smoke" />
      <div className="mbx-center margin-bottom--sm">Smoke</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flame.gif" alt="Flame" />
      <div className="mbx-center margin-bottom--sm">Flame</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_frameeye.gif" alt="FlameEye" />
      <div className="mbx-center margin-bottom--sm">FlameEye</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_fire.gif" alt="Fire" />
      <div className="mbx-center margin-bottom--sm">Fire</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cell.gif" alt="Cell" />
      <div className="mbx-center margin-bottom--sm">Cell</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_lightning.gif" alt="Lightning" />
      <div className="mbx-center margin-bottom--sm">Lightning</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flare.gif" alt="Flare" />
      <div className="mbx-center margin-bottom--sm">Flare</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_flare2.gif" alt="Flare2" />
      <div className="mbx-center margin-bottom--sm">Flare2</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flare3.gif" alt="Flare3" />
      <div className="mbx-center margin-bottom--sm">Flare3</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_lensflare.gif" alt="LensFlare" />
      <div className="mbx-center margin-bottom--sm">LensFlare</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_sun.gif" alt="Sun" />
      <div className="mbx-center margin-bottom--sm">Sun</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_magiccircle.gif" alt="MagicCircle" />
      <div className="mbx-center margin-bottom--sm">MagicCircle</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_mandara.gif" alt="Mandara" />
      <div className="mbx-center margin-bottom--sm">Mandara</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_explosion.gif" alt="Explosion" />
      <div className="mbx-center margin-bottom--sm">Explosion</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_explosion2.gif" alt="Explosion2" />
      <div className="mbx-center margin-bottom--sm">Explosion2</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cross.gif" alt="Cross" />
      <div className="mbx-center margin-bottom--sm">Cross</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_laser.gif" alt="Laser" />
      <div className="mbx-center margin-bottom--sm">Laser</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_laser2.gif" alt="Laser2" />
      <div className="mbx-center margin-bottom--sm">Laser2</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_light.gif" alt="Light" />
      <div className="mbx-center margin-bottom--sm">Light</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cloud.gif" alt="Cloud" />
      <div className="mbx-center margin-bottom--sm">Cloud</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cloud2.gif" alt="Cloud2" />
      <div className="mbx-center margin-bottom--sm">Cloud2</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_perlinnoise.gif" alt="PerlinNoise" />
      <div className="mbx-center margin-bottom--sm">PerlinNoise</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_seemlessnoise.gif" alt="SeemlessNoise" />
      <div className="mbx-center margin-bottom--sm">SeemlessNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_booleannoise.gif" alt="BooleanNoise" />
      <div className="mbx-center margin-bottom--sm">BooleanNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_cellnoise.gif" alt="CellNoise" />
      <div className="mbx-center margin-bottom--sm">CellNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_turbulentnoise.gif" alt="TurbulentNoise" />
      <div className="mbx-center margin-bottom--sm">TurbulentNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_fbmnoise.gif" alt="FbmNoise" />
      <div className="mbx-center margin-bottom--sm">FbmNoise</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_fbmnoise2.gif" alt="FbmNoise2" />
      <div className="mbx-center margin-bottom--sm">FbmNoise2</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_fbmnoise3.gif" alt="FbmNoise3" />
      <div className="mbx-center margin-bottom--sm">FbmNoise3</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_randomnoise.gif" alt="RandomNoise" />
      <div className="mbx-center margin-bottom--sm">RandomNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_voronoinoise.gif" alt="VoronoiNoise" />
      <div className="mbx-center margin-bottom--sm">VoronoiNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_sparknoise.gif" alt="SparkNoise" />
      <div className="mbx-center margin-bottom--sm">SparkNoise</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_marblenoise.gif" alt="MarbleNoise" />
      <div className="mbx-center margin-bottom--sm">MarbleNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_tessnoise.gif" alt="TessNoise" />
      <div className="mbx-center margin-bottom--sm">TessNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_gradientnoise.gif" alt="GradientNoise" />
      <div className="mbx-center margin-bottom--sm">GradientNoise</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_checker.gif" alt="Checker" />
      <div className="mbx-center margin-bottom--sm">Checker</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_flamelance.gif" alt="FlameLance" />
      <div className="mbx-center margin-bottom--sm">FlameLance</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_bonfire.gif" alt="Bonfire" />
      <div className="mbx-center margin-bottom--sm">Bonfire</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_snow.gif" alt="Snow" />
      <div className="mbx-center margin-bottom--sm">Snow</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_diamondgear.gif" alt="DiamondGear" />
      <div className="mbx-center margin-bottom--sm">DiamondGear</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_brushstroke.gif" alt="BrushStroke" />
      <div className="mbx-center margin-bottom--sm">BrushStroke</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_speckle.gif" alt="Speckle" />
      <div className="mbx-center margin-bottom--sm">Speckle</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_bubbles.gif" alt="Bubbles" />
      <div className="mbx-center margin-bottom--sm">Bubbles</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_pentagon.gif" alt="Pentagon" />
      <div className="mbx-center margin-bottom--sm">Pentagon</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_grunge.gif" alt="Grunge" />
      <div className="mbx-center margin-bottom--sm">Grunge</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_energy.gif" alt="Energy" />
      <div className="mbx-center margin-bottom--sm">Energy</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_inksplat.gif" alt="InkSplat" />
      <div className="mbx-center margin-bottom--sm">InkSplat</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_particle.gif" alt="Particle" />
      <div className="mbx-center margin-bottom--sm">Particle</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_electric.gif" alt="Electric" />
      <div className="mbx-center margin-bottom--sm">Electric</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_caustics.gif" alt="Caustics" />
      <div className="mbx-center margin-bottom--sm">Caustics</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_squiggles.gif" alt="Squiggles" />
      <div className="mbx-center margin-bottom--sm">Squiggles</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_waterturbulence.gif" alt="WaterTurbulence" />
      <div className="mbx-center margin-bottom--sm">WaterTurbulence</div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <img src="/img/lab/fxgen_trabeculum.gif" alt="Trabeculum" />
      <div className="mbx-center margin-bottom--sm">Trabeculum</div>
    </div>
    <div className="col">
      <img src="/img/lab/fxgen_binarymatrix.gif" alt="BinaryMatrix" />
      <div className="mbx-center margin-bottom--sm">BinaryMatrix</div>
    </div>
    <div className="col">
    </div>
    <div className="col">
    </div>
    <div className="col">
    </div>
  </div>
</div>


## Tips

次のような画像を作るときのパラメータです．

<div className="container">
  <div className="row">
    <div className="col">
      <img src="/img/lab/EffectTextureMaker_Tips01.png" alt="Tips01" />
    </div>
    <div className="col">
      <ul>
        <li>type: GradientLine </li>
        <li>Direction X: 0</li>
        <li>Direction Y: 1</li>
        <li>Offset: 0</li>
        <li>PowerExponent: 5</li>
        <li>polarConversion: 有効</li>
      </ul>
    </div>
  </div>
</div>


## お問い合わせ

mebiusbox[at]gmail[dot].com までご連絡ください．


## 免責事項

以下を参照してください．

[プライバシーポリシー](/privacy)


## コピーライト

Copyright (C) 2017-2023 mebiusbox software.


## Changes

- 2023-12-31: BinaryMatrix を追加しました．
- 2023-12-12: スプライトシートをアルファチャンネル付きのPNG形式で保存できるようになりました．
- 2023-11-23: アルファチャンネルを追加したPNG形式で保存できるようになりました（実験的）．メニューには「Save (PNG)」と「Download (PNG)」がありますが機能は同じです．これはブラウザ互換のために2種類用意しました．
