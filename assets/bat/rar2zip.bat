@if (1==1) /*
@echo off
cscript //nologo //E:JScript "%~f0" "%~f0" %*
pause
GOTO :EOF
rem */
@end

// javascript code here.

WScript.quit(main(WScript.arguments.length, WScript.arguments));

// argc : argv ‚Ì’·‚³
// argv : ŒÂ”‚Í argv.CountAQÆ‚Í argv(index)
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
