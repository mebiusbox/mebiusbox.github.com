---
layout: post
title: PackAssistant について
category: note
tags: [diary]
authors: [mebiusbox]
---

FileHammer も 64bit 化したので，ついでに PackAssistant も 64bit 化しようかなと．
今でも窓の杜で公開されているので，使っている人はまだいてくれているのかなと思っています．

<!-- truncate -->

かなり前から何か更新するなら PackClassify を削除して，直接 iso ファイルを作れるようにしたいと思っていました．
**mkisofs** を使うと簡単に作れるらしいのですが，一次フォルダに全部まとめないといけないので，あまりよろしくないわけです．

そこで，別の方法を考えていたのですが，**BurnAware** というソフトでデータディスクを作成するときに，`貼り付け`  で複数の任意のフォルダやファイルを登録出来るのでは，と思いました．とりあえず，何かしらの方法で登録できれば **PackClassify** なんていらないわけです．

ということで，ちょっと試してみます．
