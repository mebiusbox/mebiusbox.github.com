---
layout: software
title: CodeMage
---

# CodeMage 0.5.5
Mac 用テキストエディタ TextMate を参考に作成したテキストエディタです。
<a href="{{ site.url }}/software_codemage_manual.html">マニュアルはこちら</a>

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="http://bit.ly/1V3Whuk" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/CodeMageSetup','Title':'CodeMageSetup'});">
				<img src="/assets/img/download_exe.jpg" />
			</a>
		</td>
		<td>
			<a href="http://bit.ly/1OvmyVX" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/CodeMage','Title':'CodeMage'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="/assets/img/CodeMage_snap01.jpg">
		<img src="/assets/img/CodeMage_snap01.jpg" width="240" height="180" alt="snap01" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/CodeMage_snap02.jpg">
		<img src="/assets/img/CodeMage_snap02.jpg" width="240" height="180" alt="snap02" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/CodeMage_snap03.jpg">
		<img src="/assets/img/CodeMage_snap03.jpg" width="240" height="180" alt="snap03" border="0" />
	</a>
	<br class="clear" />
</div>


## 動作環境
Windows XP(32)

## 更新履歴

### 0.5.5
* Improved: キーストローク処理を見直し。
* Improved: スニペット入力中に、別のコマンドを利用できるようにしました。
* Fixed: 文字入力時に、その行のインデントが減少する場合、インデント調整が行われない不具合を修正しました。
* Fixed: GoTo Line で、１行ずれていた不具合を修正しました。
* Fixed: GoTo Line で、ダイアログのスピンコントロールが機能していなかった不具合を修正しました。
* Fixed: 編集中のファイルが外部で変更され、CodeMageがアクティブになったときにリロードをすると、その後の編集がおかしくなる不具合を修正しました。

### 0.5.4
* Added: ショートカット一覧機能を追加しました。
* Added: コマンド「beginning-of-line2」 を追加しました。
* Added: コマンド「input-command」を追加しました。
* Improved: ファイルを開いていない状態のメインメニューの項目を変更しました。
* Improved: ダブルクリックによる単語選択を改善しました。
* Fixed: メインメニューの「編集 > プロジェクト内を置換」が使用できなかった不具合を修正しました。
* Misc: 標準キーマップで、「Home」ボタンに割り当てていた「beginning-of-line」を「beginning-of-line2」に変更しました。
* Misc: 標準キーマップに、「input-command」を「M-x」に割り当てました。

### 0.5.3
* Misc: 言語文法の $base の扱いを変更しました。
* Fixed: 「選択範囲内をすべて置換」が機能していなかった不具合を修正しました。
* Fixed: テキストを選択した状態において、「すべて置換」を実行しても機能していなかった不具合を修正しました。
* Fixed: 行選択状態でペーストすると異常終了する不具合を修正しました。
* Fixed: 箱型選択状態で削除すると、先頭行まで削除する不具合を修正しました。
* Fixed: ファイル読み込み時に、最後の行が空行だった場合、読み飛ばしてしまう不具合を修正しました。

### 0.5.2
* Fixed: ステータスバー上で、文字エンコーディングを変更したときに、異常終了する不具合を修正しました。
*  Misc: ステータスバー上で、文字エンコーディングを変更したときは、再読込しないようにしました。保存時のみ影響します。
* Fixed: オプションの文字エンコーディングの設定が正常に保存されない不具合を修正しました。

### 0.5.1
* Misc: バンドルのリポジトリ「http://github.com/textmate/」に対応しました。
* Improved: バンドル管理画面を改善しました。

### 0.5.0
* Misc: 行データの管理構造を変更しました。
* Misc: その他、色々と改善・変更しました。
* Improved: スコープ、折り畳み、インデント、シンボルの更新処理を改善しました。

### 0.4.1
* Improved: アクティブ時に、開いているファイルが変更されているかどうかチェックするようにしました。
* Improved: 検索に一致した文字をハイライトするようにしました。
* Fixed: ファイルを切り替えた時、ステータスバーの内容が更新されていなかった不具合を修正しました。
* Fixed: 一部のスニペットが正常に展開されない不具合を修正しました。
* Fixed: 検索したときに、見つかった位置が表示されない場合がある不具合を修正しました。
* Fixed: 検索関連でいくつか修正しました。
* Fixed: 正規表現による検索置換が正常に機能していなかった不具合を修正しました。
* Added: New command 'newline-and-smart-indent'
* Added: New command 'indent-line'
* Added: New command 'smart-indent-line'
* Misc: アップデータを更新

### 0.4.0
* Added: 折り畳み機能を実装しました。
* Added: 全てのテキストに対して、折り畳み情報を更新するコマンドを追加しました。
* Added: ツールバーにアイコンを追加しました。
* Added: オプションに項目を追加しました。
* Misc: メニューアイコンを一部変更しました。

### 0.3.0
* Improved: スコープの割り当て処理を大幅に見直しました。
* Added: コマンド入力機能を追加しました。(Tool > Command...)
* Added: 全てのテキストに対して、スコープを再割り当てするコマンドを追加しました。
* Added: ツールバーを新たに追加しました。
* Misc: メニューアイコンを追加しました。
* Fixed: バンドルエディタで、バンドル項目内の Menu を選択すると異常終了する場合がある不具合を修正しました。

### 0.2.1
* Improved: マウスホイールでのスクロール行を設定できるようにしました。
* Fixed: ファイルを開いており、かつ、言語を設定している状態で、バンドル管理画面を開き「OK」を選択した後に、ファイルを編集すると異常終了してしまう不具合を修正しました。
* Fixed: 一部のスニペットを実行すると強制終了する不具合を修正しました。
* Fixed: スニペット中の環境変数が展開されない場合がある不具合を修正しました。
* Fixed: バンドルエディタで編集した内容がすぐに反映されない場合がある不具合を修正しました。
* Fixed: 一部のコマンドが動作しない不具合を修正しました。
* Fixed: メインメニューから「Goto File...」が正常に動作しない不具合を修正しました。
* Fixed: 「Goto File...」のダイアログで正常に表示されない場合がある不具合を修正しました。

### 0.2.0
* Added: ソフトウェアの更新機能を追加しました。
* Fixed: オプション「ビュー」の折り返しが反映されない不具合を修正しました。

### 0.1.0
* First release.
