---
description: Three.jsで開発したもの
image: https://og-image-mebiusbox.vercel.app/api/og?title=Three.js&subtitle=Three.js%E3%81%A7%E9%96%8B%E7%99%BA%E3%81%97%E3%81%9F%E3%82%82%E3%81%AE&date=2023%2F01%2F11
last_update:
  date: 2022-01-11
  author: mebiusbox
---

# Three.js

## pixy.js

Three.js 用の独自シェーダとユーティリティライブラリです．

### 機能

- 物理ベースレンダリング（拡散反射：ランバート，オーレン・ナイヤー，鏡面反射：クック・トランス）
- ディファードシェーディング（three.js の MRT カスタムバージョンを使用）

### サンプル

- [フォン・シェーディング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_phong.html)
- [テクスチャマッピング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_texture.html)
- [ガラス](http://mebiusbox.github.io/contents/pixyjs/samples/shader_glass.html)
- [フォグ，リムライト，ライトマップ](http://mebiusbox.github.io/contents/pixyjs/samples/shader_fog.html)
- [ディスプレイスメントマップ，インナーグロー，ライングロー](http://mebiusbox.github.io/contents/pixyjs/samples/shader_displacement.html)
- [インナーグロー](http://mebiusbox.github.io/contents/pixyjs/samples/shader_innerglow.html)
- [投影マッピング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_projection.html)
- [ベルベット，歪み，ＵＶスクロール](http://mebiusbox.github.io/contents/pixyjs/samples/shader_velvet.html)
- [大気散乱，海](http://mebiusbox.github.io/contents/pixyjs/samples/shader_sky.html)
- [物理ベースレンダリング（ＵＥ４ベース，オーレン・ナイヤー）](http://mebiusbox.github.io/contents/pixyjs/samples/shader_standard.html)
- [オーバーレイ](http://mebiusbox.github.io/contents/pixyjs/samples/shader_overlay.html)
- [草，影，インスタンス](http://mebiusbox.github.io/contents/pixyjs/samples/shader_grass.html)
- [ディファード，ブルーム，トーンマッピング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_deferred.html)
- [球状エリアライト（ラフネスハック）](http://mebiusbox.github.io/contents/pixyjs/samples/shader_area_light_hack.html)
- [線状エリアライト（ラフネスハック）](http://mebiusbox.github.io/contents/pixyjs/samples/shader_tube_light_hack.html)
- [エリアライト](http://mebiusbox.github.io/contents/pixyjs/samples/shader_area_light.html)
- [視差，歪み](http://mebiusbox.github.io/contents/pixyjs/samples/shader_parallax.html)
- [視差オクリュージョン，リリーフマッピング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_parallax_occlusion.html)
- [ソフト，ＧＰＵパーティクル](http://mebiusbox.github.io/contents/pixyjs/samples/softparticle.html)
- [ディザリング](http://mebiusbox.github.io/contents/pixyjs/samples/shader_dither.html)
- [トーンマップ](http://mebiusbox.github.io/contents/pixyjs/samples/shader_tonemap.html)
- [カラーバランス](http://mebiusbox.github.io/contents/pixyjs/samples/shader_colorbalance.html)

## シェーダ

- [PBR (Lambert, Cook-Torrance, Clear-coat, Anisotropic, Multi-scattering microfacet BRDF)](http://mebiusbox.github.io/contents/pbrwip/)
