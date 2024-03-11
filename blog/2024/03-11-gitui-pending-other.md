---
title: gitui で Pending Other に Other が表示される
description: gitui で Pending Other に Other が表示されたので対応したこと
keywords:
  - gitui
category: note
authors: [mebiusbox]
tags: [gitui]
image: https://og-image-mebiusbox.vercel.app/api/og?title=gitui%20%E3%81%A7%20Pending%20Other%20%E3%81%AB%20Other%20%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%82%8B&subtitle=gitui%20%E3%81%A7%20Pending%20Other%20%E3%81%AB%20Other%20%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%9F%E3%81%AE%E3%81%A7%E5%AF%BE%E5%BF%9C%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8&date=2024%2F03%2F11&tags=gitui
---

ターミナルでのgit管理に[gitui](https://github.com/extrawurst/gitui)を使っています．
細かい操作をUIで操作するときに便利です．
ところで、ローカルで作業中のリポジトリでgituiを実行すると画面に「Pending Other」が表示されていることに気づきました．何かが終わっていない、途中の状態というのは何となくわかるのですが、これだけでは詳しいことがわかりません．ここでは備忘録として対応したことを書いておきます．

<!-- truncate -->

具体的には次のような画面のように、「Pending Other」のウィンドウが表示され、内容は「Other」となっています．

![gitui](/img/post/03-11-gitui-pending-other-240311-192012.png)

これに関する情報がほとんど見つけられなかったので、とりあえずgituiのソースコードを確認してみることにしました．
どうやらリポジトリのステートを表しているようです．

```rust title="src/sync/state.rs"
pub enum RepoState {
	///
	Clean,
	///
	Merge,
	///
	Rebase,
	///
	Revert,
	///
	Other,
}
```

`Clean`以外のステートのときに画面に表示されるようになっていました．
結局、まだ詳しいことはわからないので、`.git`ディレクトリの中を他のリポジトリのものと比較してみることにしました．
そうすると、「Pending Other」が表示されるリポジトリの`.git`ディレクトリの中に`rebase-apply`というディレクトリが存在していました．中身は空です．どうやら、Rebaseが中途半端な状態だったようです．といってもRebaseをした覚えがないので、何か間違った操作をしてRebaseしようとしたのかもしれません．ということで、この`rebace-apply`ディレクトリを削除することで「Pending Other」は表示されなくなりました．

以上です．
