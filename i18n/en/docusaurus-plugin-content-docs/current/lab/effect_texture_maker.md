---
title: EffectTextureMaker
description: EffectTextureMaker is generating texture tool on the web browser
keywords:
  - EffectTextureMaker
  - Three.js
  - シェーダー
  - テクスチャ
  - Vfx
image: https://og-image-mebiusbox.vercel.app/api/og?title=EffectTextureMaker&subtitle=EffectTetureMaker%E3%81%AF%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%A7%E4%B8%BB%E3%81%AB%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%88%E7%94%A8%E3%81%AE%E3%83%86%E3%82%AF%E3%82%B9%E3%83%81%E3%83%A3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99&date=2023%2F01%2F11
last_update:
  date: 2023-01-30
  author: mebiusbox
---

# EffectTextureMaker

[EffectTextureMaker](http://mebiusbox.github.io/contents/EffectTextureMaker/) is generating texture tool on the web browser. This tool can make a lot of vfx textures and you can also make animated sprites sheet.

<img src="/img/lab/EffectTextureMaker.png" width="50%" />


## Features

- A lot of type of template for vfx texture.
- Make a normal map.
- Make a animated sprites sheet.
- You can save as image format supported by the web browser.
- Support image maximum of 2048 sizes.
- Support color balance adjustment.


## End-User License

The texture generated with EffectTextureMaker can be freely used for commercial and non-commercial products. The texture is licensed under the [CC0](http://creativecommons.org/publicdomain/zero/1.0/).


## How To Use

<div className="container">
  <div className="row">
    <div className="col">
      <ol>
        <li>Set the resolution. (resolution)</li>
        <li>Choose the effect template. (type)</li>
        <li>Adjust parameters as you like. (Parameters)</li>
        <li>Click the Save button to open the rendered image and save it.</li>
      </ol>
    </div>
    <div className="col">
      <img src="/img/lab/EffectTextureMaker_HowToUse.png" />
    </div>
  </div>
</div>

### time

It can be used for animated effects.

### animate

Animates an effect. It is available for some effects.

### polarConversion

Transforms the effect into polar coordinates.


### Toon

Enable toon shading. Three gradations: dark, light, and other.

| Parameter |       Summary        |
| --------- | -------------------- |
| enable    | Enable toon shading. |
| dark      | Rate of dark part.   |
| light     | Rate of light part.  |

### Tiling

To seemless the effect. (Not good)

|  Parameter  |            Summary             |
| ----------- | ------------------------------ |
| enable      | Enable tiling.                 |
| radial mask | Adjust boundary intersections. |

### NormalMap

Convert to a normal map.

|  Parameter   |      Summary       |
| ------------ | ------------------ |
| generate     | Enable conversion. |
| cHeightScale | Scale of height.   |

### ColorBalance

Apply color bbalance to the effect.


|     Parameter     |            Summary             |
| ----------------- | ------------------------------ |
| Shadows           | Dark part.                     |
| Midtones          | Middle part.                   |
| Highlights        | Light part.                    |
| resetColorBalance | Reset ColorBalance parameters. |

### SpriteSheet

Generates animated effects on a single image (SpriteSheet).

| Parameter  |            Summary             |
| ---------- | ------------------------------ |
| dimension  | The number of image divisions. |
| time       | Animation start time.          |
| timeLength | Length of animation.           |
| timeStep   | Step time.                     |

For example, assume the parameters as follows:

- resolution : 512
- dimesion : 8
- time : 0
- timeLength : 3
- timeStep : 0.1

It will render at most `16` sprites in `512x512` image. That is, the size of one sprite is `64x64` (512/8), up to 64 sprites. The sprite rendering starts at `0`, and one sprite is drawn every `0.1` seconds, for `3` seconds. When the maximum number of sprites is reached, the rendering is finished.

![SpriteSheet](/img/lab/EffectTextureMaker_SpriteSheet.png)


### Image with alpha (PNG)

Save in PNG image with alpha channel. This is an experimental feature. It cannot be used to save SpriteSheet.


|   Parameter    |                Summary                 |
| -------------- | -------------------------------------- |
| threshold      | Threshold to truncate to 0.0 (black)   |
| tolerance      | Tolerance to be rounded up 1.0 (white) |
| blur           | Strength of the blur.                  |
| visible        | Show the alpha channel.                |
| Save (PNG)     | Save generated image.                  |
| Download (PNG) | Download generated image.              |

There are two methods: Save and Download, but you can use either.


## Save/Load

You can save and load the data in JSON format. Press the `save` and `load` buttons on the top of controller, respectively.


## Gallery

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

This parameters can be used to create the follwing image.

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


## Contact

Please do not hesitate to contact me. 

mebiusbox[at]gmail[dot].com


## Copyright

Copyright (C) 2017-2023 mebiusbox software.


## Changes

- 2023-11-23: [Add] An generated image can be saved in Png image with alpha channel (Experimental). 'Save (PNG)' and 'Download (PNG)' have the same function. They are provided for browser compatibility. This feature is not support for saving the image as spritesheet.
