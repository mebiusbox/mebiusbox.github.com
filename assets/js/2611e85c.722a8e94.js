"use strict";(self.webpackChunkmebiusbox_docusaurus=self.webpackChunkmebiusbox_docusaurus||[]).push([[7264],{22822:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>l});var a=n(85893),i=n(11151);const r={layout:"post",title:"DiskCatalogManager \u306b\u3064\u3044\u3066",category:"note",tags:["diary"],authors:["mebiusbox"]},o=void 0,s={permalink:"/blog/2018/02/08/diary",source:"@site/blog/2018/02-08-diary.md",title:"DiskCatalogManager \u306b\u3064\u3044\u3066",description:"\u6c17\u3065\u3044\u305f\u3089\u524d\u56de\u306e\u6295\u7a3f\u304b\u3089\uff11\u5e74\u7d4c\u904e\u3057\u3066\u3044\u307e\u3057\u305f\uff0e",date:"2018-02-08T00:00:00.000Z",tags:[{inline:!0,label:"diary",permalink:"/blog/tags/diary"}],readingTime:4.49,hasTruncateMarker:!1,authors:[{name:"mebiusbox",title:"enginner",url:"https://github.com/mebiusbox",imageURL:"https://github.com/mebiusbox.png",key:"mebiusbox"}],frontMatter:{layout:"post",title:"DiskCatalogManager \u306b\u3064\u3044\u3066",category:"note",tags:["diary"],authors:["mebiusbox"]},unlisted:!1,prevItem:{title:"FileHammer 64bit \u7248\u306b\u3064\u3044\u3066",permalink:"/blog/2018/02/10/diary"},nextItem:{title:"EffectTextureMaker \u3068\u3044\u3046\u306e\u3092\u4f5c\u308a\u307e\u3057\u305f",permalink:"/blog/2017/01/06/EffectTextureMaker"}},u={authorsImageUrls:[void 0]},l=[];function c(e){const t={p:"p",...(0,i.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"\u6c17\u3065\u3044\u305f\u3089\u524d\u56de\u306e\u6295\u7a3f\u304b\u3089\uff11\u5e74\u7d4c\u904e\u3057\u3066\u3044\u307e\u3057\u305f\uff0e\n\u4f55\u3068\u3044\u3046\u304b\uff0c\u53bb\u5e74\u306f\u306a\u304b\u306a\u304b\u601d\u3044\u901a\u308a\u306b\u884c\u304b\u306a\u304b\u3063\u305f\u6c17\u304c\u3057\u3066\u3044\u307e\u3059\u304c\uff0c\u82f1\u8a9e\u30fb\u6570\u5b66\u3092\u518d\u52c9\u5f37\u3057\u3066\uff0cQiita\n\u306b\u6280\u8853\u7684\u306a\u8a18\u4e8b\u3092\u6295\u7a3f\u3057\u305f\u308a\u3068\uff0c\u65b0\u3057\u3044\u3053\u3068\u3092\u3084\u3063\u305f\u308a\u3082\u3057\u307e\u3057\u305f\uff0e"}),"\n",(0,a.jsx)(t.p,{children:"\u8a71\u304c\u5909\u308f\u3063\u3066\uff0c\u30d5\u30ea\u30fc\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u958b\u767a\u3067\u3059\u304c\uff0c\u4f55\u5ea6\u304b\u518d\u958b\u3059\u308b\u3068\u8a00\u3063\u3066\u304a\u304d\u306a\u304c\u3089\u76f8\u5909\u308f\u3089\u305a\u30a2\u30af\u30b7\u30e7\u30f3\u3092\u8d77\u3053\u305b\u3066\u3044\u306a\u3044\u306e\u306f\u30c0\u30e1\u3067\u3059\u306d\uff0e\n\u3042\u3093\u307e\u308a\uff0c\u305d\u3046\u3044\u3046\u3053\u3068\u306f\u8a00\u308f\u306a\u3044\u65b9\u304c\u826f\u3055\u305d\u3046\u3067\u3059\uff0e\n\u3068\u306f\u8a00\u3046\u3082\u306e\u306e\uff0c\u500b\u4eba\u7684\u306b\u306f\u4f55\u3068\u304b\u3057\u305f\u3044\u3068\u3053\u308d\u3067\u306f\u3042\u308a\u307e\u3059\uff0e\u3068\u308a\u3042\u3048\u305a\uff0cVisual Studio 2015 \u306b\u5909\u3048\u3066 64bit \u5316\uff0c\u4f7f\u7528\u3057\u3066\u3044\u308b\u30e9\u30a4\u30d6\u30e9\u30ea\u306e\u30d0\u30fc\u30b8\u30e7\u30f3\u30a2\u30c3\u30d7\u306a\u3069\uff0c\u5c11\u3057\u4f5c\u696d\u3092\u9032\u3081\u3066\u3044\u307e\u3059\uff0e\u4e00\u5fdc\u300cFileHammer\u300d\u306e 64bit \u7248\u304c\u52d5\u4f5c\u3059\u308b\u3068\u3053\u308d\u307e\u3067\u3044\u304d\u307e\u3057\u305f\uff0e\u3044\u305a\u308c\u516c\u958b\u3067\u304d\u308c\u3070\u3044\u3044\u304b\u306a\u3068\u601d\u3044\u307e\u3059\uff0e"}),"\n",(0,a.jsx)(t.p,{children:"DL\u6570\u3092\u898b\u3066\u307f\u308b\u3068\uff0c\u7d50\u69cb\u591a\u3044\u306a\u3068\u601d\u3063\u3066\u3073\u3063\u304f\u308a\u3057\u3066\u3044\u307e\u3059\uff0e\u7279\u306b Mebiusbox2 \u304c\u60f3\u50cf\u4ee5\u4e0a\u306bDL\u3055\u308c\u3066\u304a\u308a\uff0c\u305d\u3057\u3066\u307b\u307c\u5168\u54e1\u304c\u3053\u308c\u4f7f\u3048\u306a\u3044\u306d\u3068\u601d\u3063\u305f\u3053\u3068\u3067\u3057\u3087\u3046\uff0e\u307e\u3042\uff0c\u5b9f\u9a13\u7684\u306a\u6a5f\u80fd\u3092\u5165\u308c\u3066\u8272\u3005\u3084\u3063\u3066\u307f\u305f\u3082\u306e\u306e\u4e0d\u5b89\u5b9a\u3067\u3059\u304b\u3089\u306d\uff0e"}),"\n",(0,a.jsx)(t.p,{children:"\u5168\u4f53\u7684\u306b\u958b\u767a\u304c\u6b62\u307e\u3063\u3066\u3044\u308b\u306e\u306f\u4ed6\u3067\u3082\u306a\u3044\u79c1\u81ea\u8eab\u304c\u4f7f\u308f\u306a\u304f\u306a\u3063\u305f\u3053\u3068\u304c\u5927\u304d\u3044\u3067\u3059\uff0eROM \u306b\u713c\u304f\u3053\u3068\u3082\u3057\u306a\u304f\u306a\u308a\u307e\u3057\u305f\u3057\uff0eFileHammer \u3082\u305a\u3063\u3068\u4f7f\u3063\u3066\u3044\u307e\u305b\u3093\uff0e\u307e\u3042\uff0c\u4f7f\u3046\u6c17\u304c\u306a\u304f\u306a\u3063\u305f\u3068\u3044\u3046\u3088\u308a\u304b\u306f\uff0c\u5225\u306e\u4f5c\u696d\u3067\u4e00\u676f\u4e00\u676f\u3068\u3044\u3046\u611f\u3058\u3067\u3059\uff0e\u3061\u3087\u3063\u3068\u3057\u305f\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306f\u4f5c\u3063\u3066\u3044\u308b\u306e\u3067\uff0c\u958b\u767a\u81ea\u4f53\u306f\u5168\u304f\u3057\u3066\u3044\u306a\u3044\u3068\u3044\u3046\u8a33\u3067\u306f\u306a\u3044\u3067\u3059\uff0e"}),"\n",(0,a.jsx)(t.p,{children:"\u3061\u3087\u3063\u3068\u524d\u7f6e\u304d\u304c\u9577\u304f\u306a\u308a\u307e\u3057\u305f\u304c\uff0c\u672c\u984c\u306e DiskCatalogManager \u306b\u3064\u3044\u3066\uff0c\u307e\u3042\uff0c\u554f\u3044\u5408\u308f\u305b\u3082\u3044\u304f\u3064\u304b\u9802\u3044\u3066\u3044\u308b\u306e\u3067\uff0c\u4f7f\u3063\u3066\u3044\u308b\u65b9\u3082\u3044\u3089\u3063\u3057\u3083\u308b\u3088\u3046\u3067\u5927\u5909\u5b09\u3057\u3044\u3067\u3059\uff0e\u3044\u307e\u3060\u306b\uff0c\u4ee3\u308f\u308a\u306e\u30bd\u30d5\u30c8\u306f\u306a\u3044\u306e\u304b\u306a\u3068\u601d\u3063\u305f\u308a\u3082\u3057\u307e\u3059\uff0e\u3044\u3084\uff0c\u3082\u3046\u3042\u308b\u306e\u304b\u306a\uff0e\n\u300c\u30ab\u30bf\u30ed\u30b0\u30c7\u30fc\u30bf\u304c\u8aad\u307f\u8fbc\u3081\u306a\u304f\u306a\u3063\u305f\u300d\u3068\u304b\uff0c\u300c\u30ab\u30bf\u30ed\u30b0\u4f5c\u6210\u4e2d\u306b\u30a8\u30e9\u30fc\u300d\u3068\u3044\u3063\u305f\u5831\u544a\u3092\u3082\u3089\u3063\u3066\u3044\u307e\u3059\uff0e\u3044\u3084\u306f\u3084\uff0c\u7533\u3057\u8a33\u306a\u3044\u3067\u3059\uff0e\n\u3061\u3087\u308d\u3063\u3068\u691c\u7d22\u3057\u3066\u307f\u305f\u3068\u3053\u308d\uff0c\u6c17\u3065\u3044\u3066\u3044\u308b\u4eba\u3082\u3044\u308b\u3088\u3046\u3067\uff0c\u30ab\u30bf\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\uff11\u30d5\u30a1\u30a4\u30eb\u306b\u3057\u3066\u3044\u308b\u3053\u3068\u306e\u9650\u754c\u304c\u6765\u305f\u3068\u3044\u3046\u3053\u3068\u3067\u3059\u306d\uff0e\u5927\u91cf\u306e\u30b5\u30e0\u30cd\u30a4\u30eb\u4f5c\u6210\u306b\u3088\u308b\u80a5\u5927\u5316\u306b\u3088\u308b\u3082\u306e\u306e\u3088\u3046\u3067\u3059\uff0e64bit \u306b\u3059\u308c\u3070\uff0c\u6271\u3048\u308b\u30d5\u30a1\u30a4\u30eb\u30b5\u30a4\u30ba\u3082\u5897\u3048\u308b\u306e\u3067\u4e00\u6642\u3057\u306e\u304e\u306b\u306f\u306a\u308a\u305d\u3046\u3067\u3059\u304c\uff0c\u6839\u672c\u7684\u306a\u89e3\u6c7a\u306b\u306f\u306a\u308a\u307e\u305b\u3093\uff0e\n\u3068\u308a\u3042\u3048\u305a\uff0c\u30c7\u30a3\u30b9\u30af\u5358\u4f4d\u3067\u30ab\u30bf\u30ed\u30b0\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u308c\u3070\u554f\u984c\u306a\u3044\u3093\u3058\u3083\u306a\u3044\u304b\u306a\u3063\u3066\u8003\u3048\u3066\u306f\u3044\u307e\u3059\uff0e\u4e0d\u8981\u306a\u30ab\u30bf\u30ed\u30b0\u30c7\u30fc\u30bf\u3082\u30d5\u30a1\u30a4\u30eb\u5358\u4f4d\u3067\u524a\u9664\u3059\u308c\u3070\u826f\u3044\u308f\u3051\u3067\u3059\uff0e\u3042\u3068\u306f\uff0c\u30ab\u30bf\u30ed\u30b0\u30d5\u30a1\u30a4\u30eb\u306e\u5f62\u5f0f\u304c\u72ec\u81ea\u306a\u3093\u3067\u3059\u304c\uff0cSQLite \u306b\u3057\u305f\u3044\u304b\u306a\u3068\u601d\u3063\u3066\u3044\u305f\u308a\uff0e\u3068\u3044\u3063\u305f\u611f\u3058\u3067\u8272\u3005\u601d\u3046\u3053\u3068\u3082\u3042\u308b\u306e\u3067\uff0c\u305d\u306e\u3046\u3061 3.0.0 \u958b\u767a\u7248\u307f\u305f\u3044\u306a\u611f\u3058\u3067\u51fa\u3059\u304b\u3082\u3057\u308c\u307e\u305b\u3093\uff0e\u30c6\u30b9\u30c8\u306b\u306f\u5354\u529b\u3057\u3066\u3082\u3089\u3046\u611f\u3058\u3067\uff0e"}),"\n",(0,a.jsx)(t.p,{children:"\u3067\u306f\u3067\u306f\uff0e"})]})}function m(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},11151:(e,t,n)=>{n.d(t,{Z:()=>s,a:()=>o});var a=n(67294);const i={},r=a.createContext(i);function o(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);