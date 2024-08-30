---
title: Visual Studio Codeでのターミナル操作
description: Visual Studio Codeでターミナルを操作する便利な設定
keywords:
  - Visual Studio Code
  - Terminal
category: note
authors: [mebiusbox]
tags: [vscode]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual+Studio+Code%e3%81%a7%e3%81%ae%e3%82%bf%e3%83%bc%e3%83%9f%e3%83%8a%e3%83%ab%e6%93%8d%e4%bd%9c&subtitle=Visual+Studio+Code%e3%81%a7%e3%82%bf%e3%83%bc%e3%83%9f%e3%83%8a%e3%83%ab%e3%82%92%e6%93%8d%e4%bd%9c%e3%81%99%e3%82%8b%e4%be%bf%e5%88%a9%e3%81%aa%e8%a8%ad%e5%ae%9a&date=2024%2F08%2F30&tags=vscode
---

WindowsのVisual Studio Codeでターミナルを快適に操作させるためのいくつかの設定を紹介します．

<!-- truncate -->

まず、「Ctrl+@」でターミナル画面の表示を切り替えることができます．通常だとターミナルはパネルに含まれており、画面下部に表示されます．
ターミナル上で再度「Ctrl+@」を押せば、その前のビューに戻ります．

## ターミナルの新規作成

「Ctrl+Shift+@」でターミナルを新規に作成できます．

私の場合、ターミナルはエディター内でも作業したいことがあります．これは、パネルにあるターミナル画面とは別のものです．サーバー起動などの用途に少なくとも2つのターミナルが欲しいので、使い分けたいのです．新規に作成されるターミナルの場所は設定で変更できます．設定画面で「Terminal > integrated: Default Location」を「Editor」に設定します．設定ファイルを直接編集する場合、`"terminal.integrated.defaultLocation": "editor"` とします．

また、コマンドパレットから「Terminal: Create New Terminal in Editor Area」としてもエディター内に新規ターミナルを作れます．他にも「Terminal: Create New Terminal in Editor Area to the Side」であれば、隣のグループに新規ターミナルを作れます．

## ターミナルとエディタを切り替える

エディター内に作成したターミナルと現在開いているエディターを切り替える方法がいくつかあります．

まずは「Ctrl+Tab」を使った方法です．このショートカットは「View: Quick Open Previous Recently Used Editor in Group」が割り当てられており、前回使っていたエディター画面を開きます．現在編集中のファイルと、ターミナルを切り替えていれば、この機能で手軽に切り替えられます．

別の方法として、「Terminal: Focus Terminal」を使うやり方があります．これはどのエディター画面からも一発でターミナル画面に移動できるコマンドで、標準だとショートカットが割り当てられていないので、手動で割り当てる必要があります．これでターミナル画面に移動できるのですが、前のエディターに戻ることができません．そこで、ターミナル画面をタブの一番最初に置くことを前提とすれば「View: Open Next Editor in Group」を使って、相互に切り替えられます．
たとえば、`F1`キーでターミナルと切り替えたい場合、「Terminal: Focus Terminal」を`F1`キーに設定し、Whenを`editorTextFocus`に設定します．そして、「View: Open Next Editor in Group」も`F1`キーに設定し、Whenを`terminalFocus`とします．これで、`F1`キーで相互に移動できます．
ターミナルがタブの一番最初にするといいましたが、具体的にはターミナルがタブの左に、編集中のエディタータブがその右隣にあれば問題ありません．
以下は直接キー設定ファイルを編集する場合です：

```json
{
  "key": "f1",
  "command": "workbench.action.terminal.focus",
  "when": "editorTextFocus"
},
{
  "key": "f1",
  "command": "workbench.action.nextEditorInGroup",
  "when": "terminalFocus"
},
```

エディター内のでターミナル操作とパネルでのターミナル（`Ctrl+@`）を使った方法は別々なので、2つのターミナルを使い分けることができます．

## Shortcut Menu Bar

最後に拡張機能「[Shortcut Menu Bar](https://marketplace.visualstudio.com/items?itemName=jerrygoyal.shortcut-menu-bar)」を紹介します．
これはVisual Studio Codeのメニューバー（エディターの右上）にボタンを追加する拡張機能です．
この拡張機能でユーザーが自由に設定できるカスタムボタンを手軽に作成できます．これらのボタンにターミナルの新規作成や切り替えなどを割り当てると、マウス操作でも手軽に制御できます．詳しくは拡張機能のドキュメントを参照してください．

以上です．
