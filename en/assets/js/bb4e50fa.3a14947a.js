"use strict";(self.webpackChunkmebiusbox_docusaurus=self.webpackChunkmebiusbox_docusaurus||[]).push([[7232],{91357:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>t,contentTitle:()=>r,default:()=>o,frontMatter:()=>n,metadata:()=>c,toc:()=>d});var l=i(85893),a=i(11151);const n={title:"EffectTextureMaker",description:"EffectTextureMaker is generating texture tool on the web browser",keywords:["EffectTextureMaker","Three.js","\u30b7\u30a7\u30fc\u30c0\u30fc","\u30c6\u30af\u30b9\u30c1\u30e3","Vfx"],image:"https://og-image-mebiusbox.vercel.app/api/og?title=EffectTextureMaker&subtitle=EffectTetureMaker%E3%81%AF%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%A7%E4%B8%BB%E3%81%AB%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%88%E7%94%A8%E3%81%AE%E3%83%86%E3%82%AF%E3%82%B9%E3%83%81%E3%83%A3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99&date=2023%2F01%2F11",last_update:{date:new Date("2024-03-26T00:00:00.000Z"),author:"mebiusbox"}},r="EffectTextureMaker",c={id:"lab/effect_texture_maker",title:"EffectTextureMaker",description:"EffectTextureMaker is generating texture tool on the web browser",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/lab/effect_texture_maker.md",sourceDirName:"lab",slug:"/lab/effect_texture_maker",permalink:"/en/docs/lab/effect_texture_maker",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"EffectTextureMaker",description:"EffectTextureMaker is generating texture tool on the web browser",keywords:["EffectTextureMaker","Three.js","\u30b7\u30a7\u30fc\u30c0\u30fc","\u30c6\u30af\u30b9\u30c1\u30e3","Vfx"],image:"https://og-image-mebiusbox.vercel.app/api/og?title=EffectTextureMaker&subtitle=EffectTetureMaker%E3%81%AF%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%A7%E4%B8%BB%E3%81%AB%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%88%E7%94%A8%E3%81%AE%E3%83%86%E3%82%AF%E3%82%B9%E3%83%81%E3%83%A3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99&date=2023%2F01%2F11",last_update:{date:"2024-03-26T00:00:00.000Z",author:"mebiusbox"}},sidebar:"main",previous:{title:"Publication",permalink:"/en/docs/lab/article"},next:{title:"Three.js",permalink:"/en/docs/lab/threejs"}},t={},d=[{value:"Features",id:"features",level:2},{value:"End-User License",id:"end-user-license",level:2},{value:"How To Use",id:"how-to-use",level:2},{value:"time",id:"time",level:3},{value:"animate",id:"animate",level:3},{value:"polarConversion",id:"polarconversion",level:3},{value:"Toon",id:"toon",level:3},{value:"Tiling",id:"tiling",level:3},{value:"NormalMap",id:"normalmap",level:3},{value:"ColorBalance",id:"colorbalance",level:3},{value:"SpriteSheet",id:"spritesheet",level:3},{value:"Image with alpha (PNG)",id:"image-with-alpha-png",level:3},{value:"Save/Load",id:"saveload",level:2},{value:"Gallery",id:"gallery",level:2},{value:"CoherentNoise",id:"coherentnoise",level:2},{value:"Tips",id:"tips",level:2},{value:"Contact",id:"contact",level:2},{value:"Copyright",id:"copyright",level:2},{value:"Changes",id:"changes",level:2}];function m(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.a)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(s.h1,{id:"effecttexturemaker",children:"EffectTextureMaker"}),"\n",(0,l.jsxs)(s.p,{children:[(0,l.jsx)(s.a,{href:"http://mebiusbox.github.io/contents/EffectTextureMaker/",children:"EffectTextureMaker"})," is generating texture tool on the web browser. This tool can make a lot of vfx textures and you can also make animated sprites sheet."]}),"\n",(0,l.jsx)("img",{src:"/img/lab/EffectTextureMaker.png",width:"50%"}),"\n",(0,l.jsx)(s.h2,{id:"features",children:"Features"}),"\n",(0,l.jsxs)(s.ul,{children:["\n",(0,l.jsx)(s.li,{children:"A lot of type of template for vfx texture."}),"\n",(0,l.jsx)(s.li,{children:"Make a normal map."}),"\n",(0,l.jsx)(s.li,{children:"Make a animated sprites sheet."}),"\n",(0,l.jsx)(s.li,{children:"You can save as image format supported by the web browser."}),"\n",(0,l.jsx)(s.li,{children:"Support image maximum of 2048 sizes."}),"\n",(0,l.jsx)(s.li,{children:"Support color balance adjustment."}),"\n"]}),"\n",(0,l.jsx)(s.h2,{id:"end-user-license",children:"End-User License"}),"\n",(0,l.jsxs)(s.p,{children:["The texture generated with EffectTextureMaker can be freely used for commercial and non-commercial products. The texture is licensed under the ",(0,l.jsx)(s.a,{href:"http://creativecommons.org/publicdomain/zero/1.0/",children:"CC0"}),"."]}),"\n",(0,l.jsx)(s.h2,{id:"how-to-use",children:"How To Use"}),"\n",(0,l.jsx)("div",{className:"container",children:(0,l.jsxs)("div",{className:"row",children:[(0,l.jsx)("div",{className:"col",children:(0,l.jsxs)("ol",{children:[(0,l.jsx)("li",{children:"Set the resolution. (resolution)"}),(0,l.jsx)("li",{children:"Choose the effect template. (type)"}),(0,l.jsx)("li",{children:"Adjust parameters as you like. (Parameters)"}),(0,l.jsx)("li",{children:"Click the Save button to open the rendered image and save it."})]})}),(0,l.jsx)("div",{className:"col",children:(0,l.jsx)("img",{src:"/img/lab/EffectTextureMaker_HowToUse.png"})})]})}),"\n",(0,l.jsx)(s.h3,{id:"time",children:"time"}),"\n",(0,l.jsx)(s.p,{children:"It can be used for animated effects."}),"\n",(0,l.jsx)(s.h3,{id:"animate",children:"animate"}),"\n",(0,l.jsx)(s.p,{children:"Animates an effect. It is available for some effects."}),"\n",(0,l.jsx)(s.h3,{id:"polarconversion",children:"polarConversion"}),"\n",(0,l.jsx)(s.p,{children:"Transforms the effect into polar coordinates."}),"\n",(0,l.jsx)(s.h3,{id:"toon",children:"Toon"}),"\n",(0,l.jsx)(s.p,{children:"Enable toon shading. Three gradations: dark, light, and other."}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"enable"}),(0,l.jsx)(s.td,{children:"Enable toon shading."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"dark"}),(0,l.jsx)(s.td,{children:"Rate of dark part."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"light"}),(0,l.jsx)(s.td,{children:"Rate of light part."})]})]})]}),"\n",(0,l.jsx)(s.h3,{id:"tiling",children:"Tiling"}),"\n",(0,l.jsx)(s.p,{children:"To seamless the effect. (Not good)"}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"enable"}),(0,l.jsx)(s.td,{children:"Enable tiling."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"radial mask"}),(0,l.jsx)(s.td,{children:"Adjust boundary intersections."})]})]})]}),"\n",(0,l.jsx)(s.h3,{id:"normalmap",children:"NormalMap"}),"\n",(0,l.jsx)(s.p,{children:"Convert to a normal map."}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"generate"}),(0,l.jsx)(s.td,{children:"Enable conversion."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"cHeightScale"}),(0,l.jsx)(s.td,{children:"Scale of height."})]})]})]}),"\n",(0,l.jsx)(s.h3,{id:"colorbalance",children:"ColorBalance"}),"\n",(0,l.jsx)(s.p,{children:"Apply color bbalance to the effect."}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"Shadows"}),(0,l.jsx)(s.td,{children:"Dark part."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"Midtones"}),(0,l.jsx)(s.td,{children:"Middle part."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"Highlights"}),(0,l.jsx)(s.td,{children:"Light part."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"resetColorBalance"}),(0,l.jsx)(s.td,{children:"Reset ColorBalance parameters."})]})]})]}),"\n",(0,l.jsx)(s.h3,{id:"spritesheet",children:"SpriteSheet"}),"\n",(0,l.jsx)(s.p,{children:"Generates animated effects on a single image (SpriteSheet)."}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"dimension"}),(0,l.jsx)(s.td,{children:"The number of image divisions."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"time"}),(0,l.jsx)(s.td,{children:"Animation start time."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"timeLength"}),(0,l.jsx)(s.td,{children:"Length of animation."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"timeStep"}),(0,l.jsx)(s.td,{children:"Step time."})]})]})]}),"\n",(0,l.jsx)(s.p,{children:"For example, assume the parameters as follows:"}),"\n",(0,l.jsxs)(s.ul,{children:["\n",(0,l.jsx)(s.li,{children:"resolution : 512"}),"\n",(0,l.jsx)(s.li,{children:"dimesion : 8"}),"\n",(0,l.jsx)(s.li,{children:"time : 0"}),"\n",(0,l.jsx)(s.li,{children:"timeLength : 3"}),"\n",(0,l.jsx)(s.li,{children:"timeStep : 0.1"}),"\n"]}),"\n",(0,l.jsxs)(s.p,{children:["It will render at most ",(0,l.jsx)(s.code,{children:"16"})," sprites in ",(0,l.jsx)(s.code,{children:"512x512"})," image. That is, the size of one sprite is ",(0,l.jsx)(s.code,{children:"64x64"})," (512/8), up to 64 sprites. The sprite rendering starts at ",(0,l.jsx)(s.code,{children:"0"}),", and one sprite is drawn every ",(0,l.jsx)(s.code,{children:"0.1"})," seconds, for ",(0,l.jsx)(s.code,{children:"3"})," seconds. When the maximum number of sprites is reached, the rendering is finished."]}),"\n",(0,l.jsx)(s.p,{children:(0,l.jsx)(s.img,{alt:"SpriteSheet",src:i(55993).Z+"",width:"512",height:"512"})}),"\n",(0,l.jsx)(s.h3,{id:"image-with-alpha-png",children:"Image with alpha (PNG)"}),"\n",(0,l.jsx)(s.p,{children:"Save in PNG image with alpha channel. This is an experimental feature. It cannot be used to save SpriteSheet."}),"\n",(0,l.jsxs)(s.table,{children:[(0,l.jsx)(s.thead,{children:(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.th,{children:"Parameter"}),(0,l.jsx)(s.th,{children:"Summary"})]})}),(0,l.jsxs)(s.tbody,{children:[(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"threshold"}),(0,l.jsx)(s.td,{children:"Threshold to truncate to 0.0 (black)"})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"tolerance"}),(0,l.jsx)(s.td,{children:"Tolerance to be rounded up 1.0 (white)"})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"blur"}),(0,l.jsx)(s.td,{children:"Strength of the blur."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"visible"}),(0,l.jsx)(s.td,{children:"Show the alpha channel."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"Save (PNG)"}),(0,l.jsx)(s.td,{children:"Save generated image."})]}),(0,l.jsxs)(s.tr,{children:[(0,l.jsx)(s.td,{children:"Download (PNG)"}),(0,l.jsx)(s.td,{children:"Download generated image."})]})]})]}),"\n",(0,l.jsx)(s.p,{children:"There are two methods: Save and Download, but you can use either."}),"\n",(0,l.jsx)(s.h2,{id:"saveload",children:"Save/Load"}),"\n",(0,l.jsxs)(s.p,{children:["You can save and load the data in JSON format. Press the ",(0,l.jsx)(s.code,{children:"save"})," and ",(0,l.jsx)(s.code,{children:"load"})," buttons on the top of controller, respectively."]}),"\n",(0,l.jsx)(s.h2,{id:"gallery",children:"Gallery"}),"\n",(0,l.jsxs)("div",{className:"container",children:[(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_wood.gif",alt:"Wood"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Wood"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_circle.gif",alt:"Circle"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Circle"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_solar.gif",alt:"Solar"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Solar"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_corona.gif",alt:"Corona"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Corona"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_spark.gif",alt:"Spark"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Spark"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_ring.gif",alt:"Ring"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Ring"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_gradation.gif",alt:"Gradation"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Gradation"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_gradationline.gif",alt:"GradationLine"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"GradationLine"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flash.gif",alt:"Flash"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flash"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cone.gif",alt:"Cone"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Cone"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flower.gif",alt:"Flower"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flower"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flowerfun.gif",alt:"FlowerFun"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FlowerFun"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_wavering.gif",alt:"WaveRing"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"WaveRing"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_smoke.gif",alt:"Smoke"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Smoke"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flame.gif",alt:"Flame"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flame"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_frameeye.gif",alt:"FlameEye"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FlameEye"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_fire.gif",alt:"Fire"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Fire"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cell.gif",alt:"Cell"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Cell"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_lightning.gif",alt:"Lightning"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Lightning"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flare.gif",alt:"Flare"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flare"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flare2.gif",alt:"Flare2"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flare2"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flare3.gif",alt:"Flare3"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Flare3"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_lensflare.gif",alt:"LensFlare"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"LensFlare"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_sun.gif",alt:"Sun"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Sun"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_magiccircle.gif",alt:"MagicCircle"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"MagicCircle"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_mandara.gif",alt:"Mandara"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Mandara"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_explosion.gif",alt:"Explosion"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Explosion"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_explosion2.gif",alt:"Explosion2"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Explosion2"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cross.gif",alt:"Cross"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Cross"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_laser.gif",alt:"Laser"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Laser"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_laser2.gif",alt:"Laser2"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Laser2"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_light.gif",alt:"Light"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Light"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cloud.gif",alt:"Cloud"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Cloud"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cloud2.gif",alt:"Cloud2"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Cloud2"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_perlinnoise.gif",alt:"PerlinNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"PerlinNoise"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_seamlessnoise.gif",alt:"SeamlessNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"SeamlessNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_booleannoise.gif",alt:"BooleanNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"BooleanNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_cellnoise.gif",alt:"CellNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"CellNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_turbulentnoise.gif",alt:"TurbulentNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"TurbulentNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_fbmnoise.gif",alt:"FbmNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FbmNoise"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_fbmnoise2.gif",alt:"FbmNoise2"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FbmNoise2"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_fbmnoise3.gif",alt:"FbmNoise3"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FbmNoise3"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_randomnoise.gif",alt:"RandomNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"RandomNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_voronoinoise.gif",alt:"VoronoiNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"VoronoiNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_sparknoise.gif",alt:"SparkNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"SparkNoise"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_marblenoise.gif",alt:"MarbleNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"MarbleNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_tessnoise.gif",alt:"TessNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"TessNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_gradientnoise.gif",alt:"GradientNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"GradientNoise"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_checker.gif",alt:"Checker"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Checker"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_flamelance.gif",alt:"FlameLance"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"FlameLance"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_bonfire.gif",alt:"Bonfire"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Bonfire"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_snow.gif",alt:"Snow"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Snow"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_diamondgear.gif",alt:"DiamondGear"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"DiamondGear"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_brushstroke.gif",alt:"BrushStroke"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"BrushStroke"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_speckle.gif",alt:"Speckle"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Speckle"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_bubbles.gif",alt:"Bubbles"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Bubbles"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_pentagon.gif",alt:"Pentagon"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Pentagon"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_grunge.gif",alt:"Grunge"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Grunge"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_energy.gif",alt:"Energy"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Energy"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_inksplat.gif",alt:"InkSplat"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"InkSplat"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_particle.gif",alt:"Particle"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Particle"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_electric.gif",alt:"Electric"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Electric"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_caustics.gif",alt:"Caustics"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Caustics"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_squiggles.gif",alt:"Squiggles"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Squiggles"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_waterturbulence.gif",alt:"WaterTurbulence"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"WaterTurbulence"})]})]}),(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_trabeculum.gif",alt:"Trabeculum"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"Trabeculum"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_binarymatrix.gif",alt:"BinaryMatrix"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"BinaryMatrix"})]}),(0,l.jsxs)("div",{className:"col",children:[(0,l.jsx)("img",{src:"/img/lab/fxgen_coherentnoise.gif",alt:"CoherentNoise"}),(0,l.jsx)("div",{className:"mbx-center margin-bottom--sm",children:"CoherentNoise"})]}),(0,l.jsx)("div",{className:"col"}),(0,l.jsx)("div",{className:"col"})]})]}),"\n",(0,l.jsx)(s.h2,{id:"coherentnoise",children:"CoherentNoise"}),"\n",(0,l.jsxs)(s.ul,{children:["\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"NoiseFrequency"})," should be divisible by ",(0,l.jsx)(s.code,{children:"Repeat"}),"."]}),"\n",(0,l.jsxs)(s.li,{children:["Maximzing ",(0,l.jsx)(s.code,{children:"Gain"})," can allow to binarize a noise value. It can also be adjusted with the ",(0,l.jsx)(s.code,{children:"Bias"}),"."]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"VoronoiCell"})," has effect when ",(0,l.jsx)(s.code,{children:"VoronoiNoise"})," is enabled."]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"RidgeOffset"})," has effect when ",(0,l.jsx)(s.code,{children:"Ridge"})," is enabled."]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"ScaleShift"})," maps noise values from [-1,1] to [0,1]."]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"GradientNoise"})," is Perlin Noise\uff0e"]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"Bias"})," is used to shift noise mean value."]}),"\n",(0,l.jsxs)(s.li,{children:[(0,l.jsx)(s.code,{children:"Gain"}),' is used to "sharpen" noise.']}),"\n"]}),"\n",(0,l.jsx)(s.h2,{id:"tips",children:"Tips"}),"\n",(0,l.jsx)(s.p,{children:"This parameters can be used to create the following image."}),"\n",(0,l.jsx)("div",{className:"container",children:(0,l.jsxs)("div",{className:"row",children:[(0,l.jsx)("div",{className:"col",children:(0,l.jsx)("img",{src:"/img/lab/EffectTextureMaker_Tips01.png",alt:"Tips01"})}),(0,l.jsx)("div",{className:"col",children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:"type: GradientLine "}),(0,l.jsx)("li",{children:"Direction X: 0"}),(0,l.jsx)("li",{children:"Direction Y: 1"}),(0,l.jsx)("li",{children:"Offset: 0"}),(0,l.jsx)("li",{children:"PowerExponent: 5"}),(0,l.jsx)("li",{children:"polarConversion: \u6709\u52b9"})]})})]})}),"\n",(0,l.jsx)(s.h2,{id:"contact",children:"Contact"}),"\n",(0,l.jsx)(s.p,{children:"Please do not hesitate to contact me."}),"\n",(0,l.jsx)(s.p,{children:"mebiusbox[at]gmail[dot].com"}),"\n",(0,l.jsx)(s.h2,{id:"copyright",children:"Copyright"}),"\n",(0,l.jsx)(s.p,{children:"Copyright (C) 2017-2024 mebiusbox software."}),"\n",(0,l.jsx)(s.h2,{id:"changes",children:"Changes"}),"\n",(0,l.jsxs)(s.ul,{children:["\n",(0,l.jsxs)(s.li,{children:["2024-03-26:","\n",(0,l.jsxs)(s.ul,{children:["\n",(0,l.jsx)(s.li,{children:"[Add] CoherentNoise template type."}),"\n",(0,l.jsx)(s.li,{children:"[Add] Add a button to reset effect parameters."}),"\n",(0,l.jsx)(s.li,{children:"[Fix] Noise sphere cannot be rendered."}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(s.li,{children:"2023-12-31: [Add] BinaryMatrix template type."}),"\n",(0,l.jsx)(s.li,{children:"2023-12-12: [Add] SpriteSheets can be saved as Png image with alpha channel."}),"\n",(0,l.jsx)(s.li,{children:"2023-11-23: [Add] An generated image can be saved in Png image with alpha channel (Experimental). 'Save (PNG)' and 'Download (PNG)' have the same function. They are provided for browser compatibility."}),"\n"]})]})}function o(e={}){const{wrapper:s}={...(0,a.a)(),...e.components};return s?(0,l.jsx)(s,{...e,children:(0,l.jsx)(m,{...e})}):m(e)}},55993:(e,s,i)=>{i.d(s,{Z:()=>l});const l=i.p+"assets/images/EffectTextureMaker_SpriteSheet-4758856a3aef88783db5a1d1a54add9c.png"},11151:(e,s,i)=>{i.d(s,{Z:()=>c,a:()=>r});var l=i(67294);const a={},n=l.createContext(a);function r(e){const s=l.useContext(n);return l.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),l.createElement(n.Provider,{value:s},e.children)}}}]);