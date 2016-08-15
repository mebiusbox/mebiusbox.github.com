---
layout: software
title: PortalFolder
---

# PortalFolder 0.1.0

PortalFolder は フォルダへの移動、コピーを支援し、素早いアクセスを可能にしたソフトウェアです。
複数のフォルダを一元管理し、ポータルフォルダ（実行ファイル）を経由して、多くのフォルダに簡単にアクセスすることができます。
また、ポータルフォルダにファイルやフォルダをドラッグ＆ドロップすれば、登録されているフォルダにコピーや移動を行うことができます。
フォルダを開いたり、フォルダにコピー・移動の操作をすべてポータルフォルダに集中することができます。
これで、あなたのデスクトップも少しはスッキリするかも。
本ソフトウェアはフリーソフトウェアです。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="https://dl.dropboxusercontent.com/u/36645874/mebiusbox/PortalFolder-0.1.0.zip" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/PortalFolder','Title':'PortalFolder'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## スクリーンショット
<div class="snap">
	<a class="fancybox" href="{{ site.url }}/assets/img/portal_folder_screen_0001.jpg">
		<img style="padding:0;margin:0" src="{{ site.url }}/assets/img/portal_folder_screen_0001.jpg" Width="200" border="0" />
	</a>
	<br class="clear" />
</div>

## 動作環境
* WindowsXP(32bit)
* .Net Framework 3.5以上

## マニュアル

PortalFolder の使い方は２つあります。１つは、フォルダへのアクセスです。もう１つは、フォルダへのコピーや移動です。

### フォルダへのアクセス
PortalFolder を直接実行すれば、フォルダアクセスモードになります。
画面にフォルダリストが表示されますので、その中からアクセスしたいフォルダをクリックします。

![name]({{ site.url }}/assets/img/portal_folder_screen_0001.jpg")

### フォルダへのコピー・移動
PortalFolder に対して、ファイルやフォルダをドラッグ＆ドロップすると、登録してあるフォルダに対して、コピーや移動を行うことができます。
ドラッグ＆ドロップすると、まずはコピーか移動かを選択します。

![copy]({{ site.url }}/assets/img/portal_folder_screen_0002.jpg")

次に、フォルダリストが表示されますので、その中からフォルダを選んでクリックします。

### PortalFolderBridge

Windows には実行ファイルに対してのドラッグ＆ドロップに制限があります。
PortalFolderBridge はこの制限をなくして、PortalFolder に対して、ドラッグ＆ドロップする数を増やします。

![bridge]({{ site.url }}/assets/img/portal_folder_screen_0003.jpg")

右上のピンで、常に最善面に表示するか設定することができます。

### PortalFolderEditor

PortalFolderEditor は PortalFolder が管理するフォルダを編集するためのソフトウェアです。

![editor]({{ site.url }}/assets/img/portal_folder_screen_0004.jpg)

* 追加: フォルダを追加登録します。
* 削除: フォルダを削除します。
* 上、下: フォルダを順番を並び替えます。
* 特殊: 特殊なフォルダを登録します。現在はゴミ箱だけです。

#### フォルダの詳細
フォルダには、表示名、パス、そして、フックを設定することができます。フックについては「<a href="manual_hook.html">フック</a>」を参照してください。

* 表示名: フォルダリストに表示される名前です。
* パス: フォルダのパスです。
* フック：実行ファイル: フックの実行ファイルパスです。
* フック：パラメータ: 実行ファイルに渡すパラメータです。以下の変数が使えます。
	* <span class="param">$Files</span>:ドロップしたファイル
	* <span class="param">$Folders</span>:ドロップしたフォルダ
	* <span class="param">$Items</span>:ドロップしたファイルとフォルダ
* フック：作業フォルダ: フックの作業フォルダです。
* フック：表示: 実行ファイルを起動したときに、ウィンドウ状態です。
* フォルダフック：実行ファイル: フォルダフックの実行ファイルパスです。
* フォルダフック：パラメータ: 実行ファイルに渡すパラメータです。以下の変数が使えます。
	* <span class="param">$Folder</span>:ドロップ先のフォルダ
* フォルダフック：作業フォルダ: フォルダフックの作業フォルダです。
* フォルダフック：表示: 実行ファイルを起動したときに、ウィンドウ状態です。

#### 重要事項
フォルダのパラメータを編集したら、必ず「<span>更新</span>」をしてください。
また、フォルダリストを編集したら、必ず「<span>保存</span>」をしてください。
PortalFolderEditor で編集した情報は、PortalFolder を再起動しないと反映されません。

### フック
PortalFolder 経由で、コピーや移動を行った後に、自動でプログラムを起動することができます。これをフックといいます。

#### フックとフォルダフック
PortalFolder には、フックとフォルダフックの２種類があります。
フックは、コピー・移動したファイルやフォルダを対象に処理をします。
フォルダフックは、コピー・移動先のフォルダを対象に処理をします。

#### 設定
フックとフォルダフックの設定は PortalFolderEditor で行います。

#### たとえば…
FileHammer や、バックアップ、同期といった処理が考えられます。
実はこのフックを活かせるソフトウェアを開発中です。

### フォルダリスト
PortalFolderEditor で編集できるリストです。通常はデフォルトのフォルダリストを編集・使用しますが、個別に指定することができます。
たとえば、仕事用のフォルダリスト、個人用のフォルダリスト、整理用のフォルダリストといった使い方が可能です。

まず、PortalFolderEditor でフォルダリストを編集し、メニューの「Save as」を選んで保存します。

次に、PortalFolder のショートカットを作成し、プロパティ画面を開きます。
「リンク先」を「...PortalFolder.exe -l&lt;保存したフォルダリストのパス&gt;」と設定します。
これで、作成したフォルダリストを指定することができます。
（ただし、常駐機能は無効にしてください。そうしないと、プロセスが常に１つしか存在しなくなります。常駐の設定は、PortalFolder を起動して、フォルダリストを表示し、右クリックから設定できます。）

### スキン
PortalFolder を起動して、フォルダリスト画面を表示し、フォルダを右クリックするとスキンを設定できます。

#### Default
![skin_default]({{ site.url }}/assets/img/portal_folder_skin_default.jpg)

#### Default(Rounded)
![skin_default_raounded]({{ site.url }}/assets/img/portal_folder_skin_default_rounded.jpg")

#### Black
![skin_black]({{ site.url }}/assets/img/portal_folder_skin_black.jpg)

#### Black(Rounded)
![skin_black_rounded]({{ site.url }}/assets/img/portal_folder_skin_black_rounded.jpg)

#### iPod
![skin_ipod]({{ site.url }}/assets/img/portal_folder_skin_ipod.jpg)

#### iPod(Rounded)
![skin_ipod_rounded]({{ site.url }}/assets/img/portal_folder_skin_ipod_rounded.jpg)

#### VS2010
![skin_vs2010]({{ site.url }}/assets/img/portal_folder_skin_vs2010.jpg)

#### VS2010(Rounded)
![skin_vs2010_rounded]({{ site.url }}/assets/img/portal_folder_skin_vs2010_rounded.jpg)


## 更新履歴

### 0.1.0.0
* First version.
