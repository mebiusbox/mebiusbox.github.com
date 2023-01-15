---
title: Docusaurusで数式をクライアントサイドレンダリング(CSR)する
authors: [mebiusbox]
tags: [Docusaurus, katex]
---

Docusaurusは静的サイトジェネレータなので、すべてのページがビルド時にレンダリングされます．
DocusaurusのマークダウンからHTMLにレンダリングする部分は [remark](https://remark.js.org/) と [rehype](https://github.com/rehypejs/rehype) が処理しています．数式を有効にするには、[Docusaurusのドキュメント](https://docusaurus.io/docs/markdown-features/math-equations) によれば、`remark-math` と `rehype-katex` (または `rehype-mathjax`）を使います．
しかし、2,3個の数式ならともかく、それなりの数があるとビルドに時間がかかるようになり、生成されるhtmlやjsファイルが肥大化します．もちろん、数式も含めて事前にレンダリングするので、閲覧する場合はブラウザで数式の処理が入らず高速に表示できますが、個人的にはデメリットの方が大きいので、数式処理はクライアントサイドでしたいところです．ここでは、その方法を記録しておきます．

## 必要なスクリプトやCSSファイルを読み込む

今回は [katex](https://katex.org/) を使って数式処理をします．バージョンは `0.16.4` です．
必要なファイルは以下の通りです．

- https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css
- https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js
- https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js

Docusaurusでこれらを読み込むようにするには `docusaurus.config.js` の `scripts` および `stylesheets` で指定します．

```javascript title="./docusaurus.config.js"
const config = {
  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js",
      integrity: "sha384-PwRUT/YqbnEjkZO0zZxNqcxACrXe+j766U2amXcgMg5457rve2Y7I6ZJSm2A0mS4",
      crossorigin: "anonymous",
      defer: true,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js",
      integrity: "sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05",
      crossorigin: "anonymous",
      defer: true,
    }
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0',
      crossorigin: 'anonymous',
    },
  ],
}
```

## 数式をレンダリングする

クライアントサイドでレンダリングするには、ページがロードし終わったときに `renderMathInElement` を呼び出す必要があります．
そのために、プラグインを作ります．ここでは `./plugins/docusaurus-plugin-katex-client` というプラグインを作ります（以降、`katex-client`プラグイン)．以下のようなフォルダ・ファイル構成にします．

```
└─ plugins
    └─ docusaurus-plugins-katex-client
        ├─ index.js
        └─ render.js
```

ここから、どのような仕組みになっているか説明します．

### プラグイン

Docusaurusに機能を追加するにはさまざまな方法があります． [プラグイン](https://docusaurus.io/docs/advanced/plugins) はその1つです．Docusaurusのプラグインは公式サイトによれば、次のように説明されています．

> Docusaurus' implementation of the plugins system provides us with a convenient way to hook into the website's lifecycle to modify what goes on during development/build, which involves (but is not limited to) extending the webpack config, modifying the data loaded, and creating new components to be used in a page.

要するに、開発やビルドの中でフックして処理を入れることができるよ、という自分なりの解釈です．`katex-client`プラグインでは、すべてのページ(グローバル)に対してフックし、特定のページだけ処理するといったようにします．


### Client Modules

追加のJavascriptをすべてのページで処理するために [Client Modules](https://docusaurus.io/docs/advanced/client#client-modules) を使います． 具体的には `renderMathInElement` を呼び出すJavascriptファイル(`render.js`)をClient Moduleとして指定します．指定する場所はプラグインファイル(`index.js`)です．

```javascript title="./plugins/docusaurus-plugin-katex-client/index.js"
const path = require("path");
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-katex-client',
    getClientModules() {
      return [path.resolve(__dirname, "./render")];
    },
  };
};
```


### ExecutionEnvironment

DocusaurusのSSGについては[こちら](https://docusaurus.io/docs/advanced/ssg)に説明があります．プラグインは開発やビルドにも影響があるため、ブラウザに表示されるときのみ処理するようにしたいです．そのために [ExecutionEnvironment](https://docusaurus.io/docs/advanced/ssg#executionenvironment) を使います．`ExecutionEnvironment.canUseDOM` でブラウザに表示されるかどうかが判定できます．

```javascript
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  // browser only
}
```

次に、ページがロードし終わったときに処理するためには Client Module の[ライフサイクル関数](https://docusaurus.io/docs/advanced/client#client-module-lifecycles) `onRouteDidUpdate` を使います．これはルートが変わってDOMに描画し終わった後に呼ばれます．ドキュメントによれば

> 1. The user clicks a link, which causes the router to change its current location.
> 2. Docusaurus preloads the next route's assets, while keeping displaying the current page's content.
> 3. The next route's assets have loaded.
> 4. The new location's route component gets rendered to DOM.
> 
> `onRouteUpdate` will be called at event (2), and `onRouteDidUpdate` will be called at (4). They both receive the current location and the previous location (which can be null, if this is the first screen).

となっています．この関数の中で `renderMathInElement` を呼び出します． 次のようになります．

```javascript
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteDidUpdate({ location }) {
      renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError : false,
        strict: false
      });
    },
  };
})();
```

`onRouteDidUpdate` の引数にある `location` でルートを取得できます．これを使って処理するページを特定します．パスは
 `location.pathname` です．`katex-client`プラグインのClient Moduleである`render.js`は次のようになります．

```javascript title="./plugins/docusaurus-plugin-katex-client/render.js"
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteDidUpdate({ location }) {

      const pathIsIncluded = 
        location.pathname.startsWith("/docs/note") ||
        location.pathname.startsWith("/blog");
      if (pathIsIncluded == false) {
        
        return null;
      }

      renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError : false,
        strict: false
      });
    },
  };
})();
```


### `katex-client`プラグインを有効にする

後は作成した`katex-client`プラグインを有効にします．`docusaurus.config.js`の`plugins`で指定します．

```javascript title="./docusaurus.config.js"
plugins: [
    './plugins/docusaurus-plugin-katex-client',
],
```


### 結果

ビルド時間が改善されて、生成されるファイルも小さくなりました．以下は、GitHub Actionsでビルドしたときのログです．まずは、`remark-math+rehype-katex`の場合：

```
Run yarn build
yarn run v1.22.19
$ docusaurus build
[INFO] [ja] Creating an optimized production build...
[info] [webpackbar] Compiling Client
[info] [webpackbar] Compiling Server
[BABEL] Note: The code generator has deoptimised the styling of /home/runner/work/mebiusbox.github.com/mebiusbox.github.com/docs/note/math-3dtransformation.md as it exceeds the max of 500KB.
[BABEL] Note: The code generator has deoptimised the styling of /home/runner/work/mebiusbox.github.com/mebiusbox.github.com/docs/note/math-3dtransformation.md as it exceeds the max of 500KB.
[success] [webpackbar] Client: Compiled successfully in 1.40m
[success] [webpackbar] Server: Compiled successfully in 1.53m
[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` command to test your build locally.
Done in 103.03s.
```

そして、`katex-client`プラグインに変えた場合は次の結果となりました．

```
Run yarn build
yarn run v1.22.19
$ docusaurus build
[INFO] [ja] Creating an optimized production build...
[info] [webpackbar] Compiling Client
[info] [webpackbar] Compiling Server
[success] [webpackbar] Client: Compiled successfully in 26.71s
[success] [webpackbar] Server: Compiled successfully in 32.79s
[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` command to test your build locally.
Done in 42.66s.
```

実際のページは[こちら](http://mebiusbox.github.io/docs/note/math-3dtransformation)です．


## 注意点

`katex-client`プラグインにしたことによる注意点です．

### クライアント側の負荷

もちろん、クライアント側で数式処理をするのでページを開いたときに負荷がかかってしまいます．

### マークダウンでエスケープが必要

マークダウンの数式をそのまま remark や rehype に通すので、エスケープする必要があります．これは手間ではありますが、置換で対応できるので許容範囲としています．

### remark-math + rehype-katex(or rehype-mathjax) と併用できない

現状は併用できないです．`katex-client`プラグインを正常に動かすには `remark-math` を有効にできません．

### ページをリロードすると一部の数式処理に失敗する

原因不明．


## 余談

### rehypeプラグイン

`remark-math` で数式がASTに変換されるので、`rehype` のプラグインを自作して、デリミタを加えてそのまま出力することができれば、余計なエスケープ処理をする必要がないのでは、と考えています．ただ、そこまで突っ込んで作る気にはなれなかったです．


### Babelの警告

`remark-math+rehype-katex`で構築していたときに、数式の多いページをビルドすると以下の警告がたくさん出てきます．

```
[BABEL] Note: The code generator has deoptimised the styling of XXX as it exceeds the max of 500KB.
```

500KBを超えると最適化が無効になるとのことです．検索してみるとBabelの設定で、`compact`を`false`にすれば解決するとありましたが、どうも上手くいきませんでした．また、Docusaurusでプロジェクトを作成したときの `babel.config.js` は次のようになっています．

```javascript title="./bable.config.js"
module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
```

そして、`@docusaurus/core/lib/bable/preset`の中身を見てみると`compact`は`true`と指定されています．今回の問題のために、`compact`を`false`にするのはどうかと思いますので、結局そのままにしました．


以上です．
