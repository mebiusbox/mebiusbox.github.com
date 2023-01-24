if ($args.Length -lt 3) {
    Write-Output @"
Not enough parameters.

    rename.ps1 <root> <path> <name>

"@
    return
}

$root = $args[0]
$path = $args[1]
$name = Split-Path $args[2] -Leaf

$files = Get-ChildItem $root
$result = @()
foreach ($_ in $files) {
    if ($path.EndsWith($_.Name)) {
        $_.Name
        $result += $_.Name
    }
}
switch ($result.Length) {
    0 { Write-Host "Not found" }
    1 {
        $filePath = (Join-Path $root $result[0])
        Rename-Item $filePath $name
        Join-Path (Split-Path $path) $name | Set-Clipboard
        Write-Host ("rename {0} to {1}" -f $filePath, $name)
    }
    default: {
        Write-Host "Found man files."
        $result
    }
}


