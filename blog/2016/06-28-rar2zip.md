---
layout: post
title: rar形式からzip形式に一括変換するバッチファイル
category: note
tags: [バッチ]
authors: [mebiusbox]
---

rar形式のファイルをzip形式に一括変換するバッチファイルです。
実行するには WinRAR が必要です。

[WinRAR](http://www.winrarjapan.com/)

64bit版をデフォルトの場所にインストールされていることを想定しています。

```bat
@if (1==1) /*
@echo off
cscript //nologo //E:JScript "%~f0" "%~f0" %*
pause
GOTO :EOF
rem */
@end

// javascript code here.

WScript.quit(main(WScript.arguments.length, WScript.arguments));

// argc : argv の長さ
// argv : 個数は argv.Count、参照は argv(index)
function main(argc, argv) {

	WScript.echo(argc);
	for (i=0; i<argc; ++i) {
		WScript.echo(argv(i));
	}

	var sh  = WScript.CreateObject("WScript.Shell");
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var dirname = fso.GetParentFolderName(argv(0));
	var files = fso.GetFolder(dirname).Files;
	var e = new Enumerator(files);
	for (; !e.atEnd(); e.moveNext()) {
		var file = e.item();
		if (fso.GetExtensionName(file.Name) == "rar") {

			if (fso.FolderExists(dirname + "\\" + fso.GetBaseName(file.Name)) == false) {
				fso.CreateFolder(dirname + "\\" + fso.GetBaseName(file.Name));
			}

			var cmd = "\"C:\\Program Files\\WinRAR\\rar\"";
			cmd += " x -inul";
			cmd += " \"" + file.Name + "\"";
			cmd += " \"" + dirname + "\\" + fso.GetBaseName(file.Name) + "\"";
			WScript.echo(cmd);
			sh.Run(cmd, 0, 1);

			cmd = "\"C:\\Program Files\\WinRAR\\winrar\"";
			cmd += " a -afzip -r -ep1 -m0";
			cmd += " \"" + fso.GetBaseName(file.Name) + ".zip\"";
			cmd += " \"" + fso.GetBaseName(file.Name) + "\\*\"";
			WScript.echo(cmd);
			sh.Run(cmd, 0, 1);

			fso.DeleteFolder(dirname + "\\" + fso.GetBaseName(file.Name));
//			fso.DeleteFile(file.Name);

//			WScript.echo(file.Name);
		}
	}

}
```

使い方は変換したいファイルがあるフォルダにこのバッチファイルを入れて実行します。
時々変換に失敗することがあるので、元ファイルは消さないようになっています。
手動で消すか、`fso.DeleteFile(file.Name);` を有効にすれば変換したときに消します。
