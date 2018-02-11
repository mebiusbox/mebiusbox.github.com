---
layout: software
title: SmartTweetBar
---

# SmartTweetBar

画面上部固定のシンプルで邪魔にならない Twitter クライアントです。
ツイート専用です。ツイートした内容をメールで送信したり、ツイートに含まれている URL を delicious に登録、URL の短縮機能もあります。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="http://mebiusbox.sakura.ne.jp/bin/dl.php?dl=SmartTweetBarSetup" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/SmartTweetBarSetup','Title':'SmartTweetBarSetup'});">
				<img src="/assets/img/download_exe.jpg" />
			</a>
		</td>
		<td>
			<a href="http://mebiusbox.sakura.ne.jp/bin/dl.php?dl=SmartTweetBar" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/SmartTweetBar','Title':'SmartTweetBar'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="{{ site.url }}/assets/img/smart_tweet_bar_ss001.png">
		<img src="{{ site.url }}/assets/img/smart_tweet_bar_ss001.png" />
	</a>
	<a class="fancybox" rel="group" href="{{ site.url }}/assets/img/smart_tweet_bar_ss002.png">
		<img src="{{ site.url }}/assets/img/smart_tweet_bar_ss002.png" />
	</a>
	<br class="clear" />
</div>

## 動作環境
* WindowsXP, Vista, 7
* .Net Framework 3.5以上

## マニュアル
* [使い方](#usage)
* [delicious](#delicious)
* [instapaper](#instapaper)
* [bitly](#bitly)
* [E-mail](#email)
* [ホットキー](#hotkey)
* [ショートカット](#shortcut)
* [スキン](#skin)
* [モード](#mode)
* [オプション](#option)
* [コンテキストメニュー](#contextmenu)
* [高度な使い方](#advanced)

### <a name="usage"> 使い方

#### Twitter 認証をしましょう
SmartTweetBar を使ってツイートするには、あなたの Twitter アカウントで、SmartTweetBar からツイートできるように認証する必要があります。

#### 認証画面を表示する
SmartTweetBar を起動して、マウスを画面上部に置くと、ツイート画面が表示されます。
その上で、右クリックを押して「Twitter 認証」を選択します。

![smart_tweet_bar_ss_twitter_auth]({{ site.url }}/assets/img/smart_tweet_bar_ss_twitter_auth.png)

#### Twitter の認証画面
下図のような認証画面がブラウザで表示されますので「認証する」をクリックしてください。

![smart_tweet_bar_ss_twitter_account]({{ site.url }}/assets/img/smart_tweet_bar_ss_twitter_account.png)

#### PIN を入力する
「認証をする」をクリックすると、PIN が画面に表示されます。これを SmartTweetBar に登録することで認証が終わります。

![smart_tweet_bar_ss_twitter_pin2]({{ site.url }}/assets/img/smart_tweet_bar_ss_twitter_pin2.png)

SmartTweetBar に PIN を登録するには、ツイート画面で右クリックし「Twitter PIN 入力」を選択します。

![smart_tweet_bar_ss_twitter_pin]({{ site.url }}/assets/img/smart_tweet_bar_ss_twitter_pin.png)

画面に入力画面が表示されますので、PIN を入力し「認証」ボタンを押してください。

![smart_tweet_bar_ss_twitter_pin3]({{ site.url }}/assets/img/smart_tweet_bar_ss_twitter_pin3.png)

#### これで準備完了です！
認証が終わればツイートすることが出来ます。
SmartTweetBar は通常隠れていますので、ツイートしたいときはカーソルを画面の一番上に移動してください。
また、ホットキーを使用すればキーボード操作で入力画面が表示されます。Enjoy twitter!

### <a name="delicious"> delicious
delicious はソーシャルブックマークサービスです。

#### delicious: 使用するには
ツイート時に delicious に登録するには、拡張モードにする必要があります。
拡張モードは画面を右クリックして「モード」→「拡張」を選択します。
また、delicious にアクセスするために、ユーザー名とパスワードが必要です。
画面上で、右クリックし「delicious 設定」を選択して、設定してください。

![delicious settings menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_delicious_settings_menu.png)

![delicious settings]({{ site.url }}/assets/img/smart_tweet_bar_ss_delicious_settings.png)

#### delicious: 入力画面
delicious の入力画面はツイートする場所のすぐ下に表示されます。

![delicious form]({{ site.url }}/assets/img/smart_tweet_bar_ss_delicious_form.png)

登録する時は、「delicious」のチェックボックスを有効にしてください。

#### delicious: URL とタイトル
SmartTweetBar は、ツイート入力時に、URL を貼りつけると自動で URL やタイトルを設定します。

### <a name="instapaper"> instapaper
instapaper はサイトを保存して後で読むことができるサービスです。

#### instapaper: 使用するには
instapaper にアクセスするために、ユーザー名とパスワードが必要です。
画面上で、右クリックし「instapaper 設定」を選択して、設定してください。

![instapaper settings menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_instapaper_settings_menu.png)

![instapaper settings]({{ site.url }}/assets/img/smart_tweet_bar_ss_instapaper_settings.png)

#### instapaper: 登録するには
ツイート入力画面で、半角スペースの後に、「/instapaper」または「/i」と入力してスペースキーを押してください。
有効状態であれば画面に [Instapaper] と表示されます。
一度ツイートすると、無効状態となります。

![instapaper form]({{ site.url }}/assets/img/smart_tweet_bar_ss_instapaper_form.png)

### <a name="bitly"> Bit.ly

#### Bit.ly: 使用するには
通常、URL の短縮は Google のサービスを利用しますが、Bit.ly を使用することもできます。
URL 短縮に Bit.ly を使用するには、Bit.ly の設定を行う必要があります。画面上で、右クリックし「Bitly の設定」を選択します。
最後に、Enable にチェックします。

![email settings menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_bitly_settings_menu.png)

![email settings]({{ site.url }}/assets/img/smart_tweet_bar_ss_bitly_form.png)


### <a name="email"> Email

#### Email 機能
ツイートした内容、および delicious に登録した内容をメールで送信することが出来ます。

#### Email: 使用するには
まず拡張モードにする必要があります。拡張モードは画面を右クリックして「モード」→「拡張」を選択します。

次に、メールを送信するための SMTP サーバー の設定を行います。
設定は画面を右クリックして「Email 設定」を選択します。

![email settings menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_email_settings_menu.png)

![email settings]({{ site.url }}/assets/img/smart_tweet_bar_ss_email_settings.png)

#### Email: 入力画面
Email の入力画面は delicious のすぐ下に表示されます。

![email form]({{ site.url }}/assets/img/smart_tweet_bar_ss_email_form.png)

アドレスは複数入力することが可能です。その場合は間に半角スペースを入力してください。
また、メール送信する場合は「E-mail」をチェックしてください。

### <a name="hotkey"> ホットキー

#### ホットキー
ホットキーを設定することで、キーボード操作からツイート入力画面に移行することが出来ます。

#### ホットキー: 使用するには
ホットキーの設定は画面を右クリックして「ホットキー 設定」を選択します。

![hotkey settings menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_hotkey_settings_menu.png)

![hotkey settings]({{ site.url }}/assets/img/smart_tweet_bar_ss_hotkey_settings.png)

最後に、Enable にチェックをして有効にしてください。


### <a name="shortcut"> ショートカット

 キーストローク | コマンド
--- | ---
Shift + Enter | 送信
Esc | 入力画面から抜けます


### <a name="skin"> スキン

画面上で右クリック、「スキン」で設定できます。

![skin menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_menu.png)

#### twitter
![skin twitter]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_twitter.png)


#### standard
![skin standard]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_standard.png)

#### black
![skin black]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_black.png)

#### mac
![skin mac]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_mac.png)

#### ipod
![skin ipod]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_ipod.png)

#### vs2010.1
![skin vs2010_1]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_vs2010_1.png)

#### vs2010.2
![skin vs2010_2]({{ site.url }}/assets/img/smart_tweet_bar_ss_skin_vs2010_2.png)

### <a name="mode"> モード
「通常」モードはツイートするだけの画面、「拡張」モードは delicious や email の機能を利用するためのモードです。

モードの設定は、画面上で右クリック、「モード」で設定します。

![mode menu]({{ site.url }}/assets/img/smart_tweet_bar_ss_mode_menu.png)


### <a name="option"> オプション
![option]({{ site.url }}/assets/img/smart_tweet_bar_ss_option.png)

 項目 | 説明
---|---
スリープ時間 | マウスカーソルの位置を監視する時のスリープ時間。ミリ秒。
出現時間 | マウスカーソルを画面上部に移動して、SmartTweetBar を表示させるまでの時間。ミリ秒。
本体：アニメーション時間 | SmartTweetBar 本体のアニメーション時間。ミリ秒。
本体：アニメーションタイプ | SmartTweetBar 本体のアニメーションタイプ。
URL短縮時、タイトルも付加する | URLを短縮する時に、短縮した URL と一緒にタイトルも付け足します。
Email の Address を記憶する | 最後に送信した Email の Address を記憶します。
Email: 送信後、無効にする | 送信したら、無効状態にします。
Delicious: 送信後、無効にする | 送信したら、無効状態にします。
タイトルを取得する拡張子 | SmartTweetBar はツイートに URL を入力すると、自動的にアクセスして得られたページのタイトルを取得します。アクセス先がファイルの場合に、タイトルを取得するかどうかを拡張子で判断します。拡張子は「\|」で区切って入力してください。

### <a name="contextmenu"> コンテキストメニュー
<img src="./images/smart_tweet_bar_ss_context_menu.png" alt="context menu" />

 項目 | 説明
---|---
ヘルプ | SmartTweetBar のヘルプページを開きます。
クリア | ツイート、delicious, email に入力されている内容を消去します
送信 | 「Twitter」「delicious」「email」それぞれ個別に送信することが出来ます。
Twitter 認証 | <a href="#usage">こちら</a>
Twitter Pin 入力 | <a href="#usage">こちら</a>
Bit.ly 設定 | <a href="#bitly">こちら</a>
Delicious 設定 | <a href="#delicious">こちら</a>
Email 設定 | <a href="#email">こちら</a>
ホットキー 設定 | <a href="#hotkey">こちら</a>
モード | <a href="#mode">こちら</a>
スキン | <a href="#skin">こちら</a>
オプション | <a href="#option">こちら</a>
バージョン情報 | SmartTweetBar のバージョンを表示します。
終了 | SmartTweetBar を終了します。</a>

### <a name="advanced"> 高度な使い方

#### URL短縮
ツイート内容に URL を含んだ文字列を貼りつけるとき、自動で URL を短縮します。
もし、URL を入力したときは、URL を入力後スペースキーを押すと URL を短縮します。

#### delicious のタグ、email のアドレスをツイートから入力
ツイートを入力する際に「+」または「^」を入力し、続けて文字を入力した後(例 +SmartTweetBar) スペースキーを押すと、
「+」の場合は delicious のタグに、「^」の場合は Email のアドレスにその内容（例なら SmartTweetBar）が入力されます。

#### SmartTweetBar の設定をツイート入力画面から操作
ツイートを入力する際に「/」を入力し、続けて特定の文字を入力してスペースキーを押すと、SmartTweetBar の設定を行うことが出来ます。
また、各文字の先頭１文字だけでも構いません。たとえば mode なら「/m」と入力すると「/mode」と同じになります。

 特定の文字 | 機能
---|---
mode | モードを切り替えます。「標準」→「拡張」→「標準」... と切り替わります。
delicious | delicious の有効／無効を切り替えます
email | email の有効／無効を切り替えます
private | delicious 登録時に、プライベートかどうかを設定します。
instapaper | instapaper の有効／無効を切り替えます

## 更新履歴

### 1.2.4
* fixed: タイトルの取得が出来ない場合がある不具合を修正
* modified: URL や タグなどの検出において、半角スペースが前に入っていないと検出しないようにした。
* new: Instapaper に対応しました。
* new: オプションに「Email: 送信後、無効にする」「Delicious: 送信後、無効にする」「タイトルを取得する拡張子」を追加しました。
* improved: タイトル取得時に、前後の空白を取り除くようにしました。
* improved: URL にファイル名が含まれていたら、調べて特定の拡張子の時だけ、タイトルを取得するようにした。

### 1.2.3
* fixed: ツイート送信で終了してしまう場合がある不具合を修正
* fixed: ツイート入力で貼り付けを行うと常に末尾に追加される不具合を修正
* fixed: タイトルの取得が出来ない場合がある不具合を修正
* fixed: ホットキー設定で何も設定せずにＯＫをすると終了してしまう不具合を修正
* new: コンテキストメニューに「クリア」「送信」を追加
* improved: delicious 送信で失敗した場合はリトライをするようにした

### 1.2.2
* fixed: タイトルの取得が出来ない場合がある不具合を修正
* fixed: タイトルを HTMLデコードするようにした。
* fixed: タイトルが文字化けする場合がある不具合を修正
* new: /XXX(XXXは任意の文字列)と入力して、スペースキーを押すと一部の設定の操作が出来るようになった。

### 1.2.1
* fixed: bitly を有効にした状態で、URL短縮を行い、その状態でスペースを押すと強制終了してしまう不具合を修正

### 1.2.0
* new : オプションに「URL短縮時にタイトルを付与する」を追加
* new : オプションに「Email の Address を記憶する」を追加
* fixed: delicious, email で送信できない場合がある不具合を修正
* fixed: タイトルの取得が出来ない場合がある不具合を修正
* improved: 送信状況を表示するようにした

### 1.1.0
* new : +XXX と入力し(XXXは任意の文字列)スペースキーを押すと、XXX がタグに入力されるようにしました。
* new : ^XXX と入力し(XXXは任意の文字列)スペースキーを押すと、XXX がEmailに入力されるようにしました。
* improved : URL を入力し、スペースキーを押すと URL 短縮を行うようにしました。
* improved : 状況を細かく表示するようにした。

### 1.0.0
* First version.
