---
layout: post
title: Atom:キーバインドの変更
category: note
tags: [Atom]
authors: [mebiusbox]
---

`git-control`, `advanced-open-file`, `symbols-tree-view` パッケージを入れたところ `ctrl-alt-o` のキーバインドが重複してしまったので、これを何とかしたい。

まず、現在のキーバインドを確認するには `File > Settings` から `Keybindings` を選びます。
`ctrl-alt-o` で検索をかけると、キーバインドの一覧が表示されます。

![keybindings](/img/post/2016-06-17-atom-keybindings.png)

また、Keybinding Resolver を使うと詳しい情報がわかります。`ctrl-.` を押して Keybinding Resolver を有効にし `ctrl-alt-o` を押すと最終的にどのコマンドが実行されたかがわかります。

![resolver](/img/post/2016-06-17-atom-keybindings-resolver.png)

どうやら下から順番に上書きされているようです。この場合ですと `advanced-open-file:toggle` が実行されます。
`ctrl-alt-o` では `git-control:toggle` を実行してほしいのでカスタマイズします。
カスタマイズは `keymap.cson` ファイルを編集します。このファイルは keybindings にある `your keymap file` をクリックすると開くことができます。
記述の仕方は keymap.cson ファイルにあるコメントで記載されています。

実行するコマンドを変更する場合は、現在実行されているコマンドのセレクタに対して設定します。
Keybindings Resolver で実行されているコマンドを確認し、Keybindings の一覧から対象のコマンドを見つけたら、`Keystroke` の左側にあるアイコンを押すとクリップボードにコピーされます。
それを keymap.cson ファイルの最後に貼りつけます。

	'.platform-win32 atom-workspace, .platform-linux atom-workspace':
	  'ctrl-alt-o': 'advanced-open-file:toggle'

そして、`advanced-open-file:toggle` を `git-control:toggle` に変更します。
Keybindings Resolver で正しく設定されていることを確認してみます。

![resolved](/img/post/2016-06-17-atom-keybindings-resolved.png)

keymap.cson によって変更されていることがわかります。

あとは `advanced-open-file:toggle` を `ctrl-o` に、`symbols-tree-view:toggle` を `ctrl-'` に変更します。

	'atom-workspace':
		'ctrl-o': 'advanced-open-file:toggle'
		'ctrl-\'': 'symbols-tree-view:toggle'

`ctrl-'` はキーボード上だと `Ctrl` キーと `^` キーになります。`ctrl-^` ではないんですよね。
Keybindings Resolver で押したキーのキーストロークがわかります。
