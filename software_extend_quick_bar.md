---
layout: software
title: ExtendQuickBar
---

# ExtendQuickBar 1.5.5
ExtendQuickBarはクイック起動ツールバーを拡張したようなランチャーです。
クイック起動ツールバーをよく使っているのですが、登録数が多くなるとタスクバーの領域を多くとってしまったり選択しづらいです。
そこで、このランチャーだけ登録しておき、他のアプリケーションなどはこのランチャー経由で実行するようにすれば、クイック起動のところがスッキリします。
常駐可能です。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="http://bit.ly/1SaG1Gh" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/ExtendQuickBarSetup','Title':'ExtendQuickBarSetup'});">
				<img src="/assets/img/download_exe.jpg" />
			</a>
		</td>
		<td>
			<a href="http://bit.ly/1Ovs3nv" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/ExtendQuickBar','Title':'ExtendQuickBar'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="/assets/img/ExtendQuickBar_snap01.jpg">
		<img src="/assets/img/ExtendQuickBar_snap01.jpg" width="240" height="180" alt="snap01" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/ExtendQuickBar_snap02.jpg">
		<img src="/assets/img/ExtendQuickBar_snap02.jpg" width="240" height="180" alt="snap02" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/ExtendQuickBar_snap03.jpg">
		<img src="/assets/img/ExtendQuickBar_snap03.jpg" width="240" height="180" alt="snap02" border="0" />
	</a>
	<br class="clear" />
</div>

## 動作環境
Windows XP, Vista, 2000

## 更新履歴

### 1.5.5
* Fixed: [#0000155] ログに「[error] BreezeServiceHost: Read failed. (.\BreezeService.cpp,219)」を出力し続ける不具合を修正しました。

### 1.5.4
* Improved: [#0000151] 仮想デスクトップ対策をしました。オプションの「仮想デスクトップ対策」をチェックしてください。仮想デスクトップを使っていても問題なければ、チェックしないでください。

### 1.5.3
* Fixed: ショートカットの作業ディレクトリが反映されない場合がある不具合を修正しました。

### 1.5.2
* Fixed: [#0000143] Windows2000 において、ツールチップが表示されない不具合を修正しました。

### 1.5.1
* Improved: グループタブを削除するときに、確認ダイアログを表示するようにしました。（オプションで変更可能）
* Fixed: [#0000102] 基準パスをグループの構築場所と同じか、その中のフォルダを設定し、グループタブを削除しようとすると、強制終了する不具合を修正しました（もし、基準パスが、グループの構築場所と同じか、その中のフォルダの場合は、オプションの「グループ情報を設定ファイルの場所に構築する」をＯＦＦに自動設定されるようにしました。）

### 1.5.0
* Added: グループの順番を指定できるようにしました。
* Fixed: 一部のタブの幅が不正確だった不具合を修正しました。

### 1.4.3
* Added: 起動時のアクティブなグループを設定できるようにしました。
* Fixed: ショートカットファイルに設定されている作業フォルダ等が反映されない不具合を修正しました。

### 1.4.2
* Added: オプションに「ほかのウィンドウの手前に表示する」を追加しました。[#0000099]
* Improved: エラー処理を強化しました。
* Fixed: 一部の環境で登録してあるアイテムを起動できない不具合を修正しました。

### 1.4.1
* Improved: アイテムにＤ＆Ｄをして、実行出来るようになりました。[#0000076]

### 1.4.0
* Added: ホットキーを設定できるようになりました。
* Added: ショートカットキーを設定できるようになりました。
* Added: 無効なアイテムがあったときに自動で前に詰めるオプションを追加しました。
* Improved: File &gt; Open でアクティブなグループのフォルダを開くようにしました。
* Improved: キーボードで操作できるようになりました。

### 1.3.6
* Fixed: アイテムが表示されない場合がある不具合を修正しました。

### 1.3.5
* Improved: 表示位置を上に設定できるようになりました。
* Improved: タブを常に表示できるようになりました。
* Improved: タブのフレーム背景を透明にできるようになりました。
* Improved: アニメーション時間を設定できるようになりました。
* Improved: オプションを整理しました。
* Fixed: ドラッグアンドドロップで登録した際に、作業フォルダが空になっていた不具合を修正しました。[#0000052]

### 1.3.4
* Added: オプション「システムトレイに追加する」を追加しました。
* Added: オプション「タスクバーに表示する」を追加しました。
* Fixed: オプションの設定が保存されない場合がある不具合を修正しました。

### 1.3.3
* Fixed: ＣＰＵに大きな負荷がかかっていた不具合を修正しました。

### 1.3.2
* Improved: 任意の場所に項目を配置できるようになりました。
* Improved: システムトレイ上で右クリックしたときの処理を改善しました。

### 1.3.1
* Improved: 並び替えのときは非透明にするようにしました。
* Fixed: オプション「タブの角を丸くする」の設定が保存されない不具合を修正しました。

### 1.3.0
* Added: グループ機能をつけました。
* Added: アニメーション機能をつけました。
* Improved: ウィンドウの透明度を設定できるようになりました。
* Improved: システムトレイ上からの起動をシングルクリック／ダブルクリックのどちらかに切り替えられるようにしました。
* Improved: メニューを変更しました。
* Improved: 起動時にオプション /R を指定することで常駐状態で起動できるようにしました。
* その他調整

### 1.2.1
* Fixed: 設定が保存されない不具合を修正しました。

### 1.2.0
* Added: 並び替えが出来るようになりました。

### 1.1.0
* Improved: 常駐出来るようにしました。
* Improved: Ｄ＆Ｄで登録出来るようになりました。
* Improved: 非アクティブになったときに自動的に閉じることが出来るようになりました。
* Improved: ２重起動で終了することが出来るようになりました。
* Improved: Ctrlキーを押さなくても連続で起動できることが出来るようになりました。
* Improved: ショートカット矢印の表示／非表示を切り替えられるようにしました。
* Improved: システムトレイにアイコンを登録するようにしました。
* Improved: ツールチップの色を変更できるようにしました。
* Improved: ツールチップの遅延表示時間を調整できるようにしました。
* Improved: 右クリックでメインメニューを表示するようにしました。
* Improved: メインメニューの表示／非表示を切り替えられるようにしました。
* Fixed:一部のオーバーレイアイコンが表示されない不具合を修正しました。
* その他調整

### 1.0.0
* first release.
