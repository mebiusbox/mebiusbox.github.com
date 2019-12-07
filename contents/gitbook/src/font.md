# フォント

CSS で指定します．初期状態では次のようになっています．

![](/images/1575604602.png)

例えば，本文に `Noto Serif JP`, `Noto Sans JP`, 見出しレベル１に `Roboto Slab`，pre, code には `Roboto Mono` を指定した `website.css` は次のようになります．

```css
@import url(https://fonts.googleapis.com/css?family=Noto+Sans+JP|Noto+Serif+JP|Roboto+Mono|Roboto+Slab&display=swap&subset=japanese);

.book.font-family-0 {
  font-family: "Noto Serif JP", "メイリオ", serif;
}

.book.font-family-1 {
  font-family: "Noto Sans JP", "メイリオ", sans-serif;
}

.markdown-section h1, 
.markdown-section h2, 
.markdown-section h3, 
.markdown-section h4, 
.markdown-section h5 {
  font-family: "Roboto Slab", "Noto Sans JP", sans-serif;
}

.markdown-section pre,
.markdown-section code {
  font-family: "Roboto Mono", Consolas, "Courier New", courier, monospace;
}
```

`.book.font-family-0` はセリフ系フォントを指定します．

![](/images/1575604849.png)

`.book.font-family-1` はサンセリフ系を設定します．

![](/images/1575604873.png)

見出しの装飾を次のように指定すると

```css
@import url(https://fonts.googleapis.com/css?family=Noto+Sans+JP|Noto+Serif+JP|Roboto+Mono|Roboto+Slab&display=swap&subset=japanese);

.book.font-family-0 {
  font-family: "Noto Serif JP", "メイリオ", serif;
}

.book.font-family-1 {
  font-family: "Noto Sans JP", "メイリオ", sans-serif;
}

.markdown-section h1, 
.markdown-section h2, 
.markdown-section h3, 
.markdown-section h4, 
.markdown-section h5 {
  font-family: "Roboto Slab", "Noto Sans JP", sans-serif;
  font-weight: bold;
  color: rgb(0,113,188);
}

.markdown-section h1 { 
  border-bottom: 1px solid #000; 
}

.markdown-section h2 {
  border-bottom: 1px dotted #888;
}

.markdown-section pre,
.markdown-section code {
  font-family: "Roboto Mono", Consolas, "Courier New", courier, monospace;
}
```

![](/images/1575605143.png)

