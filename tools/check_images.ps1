$mdfiles = @()
$files = Get-ChildItem "./blog" -Recurse
foreach ($_ in $files) {
    if ($_.Name.EndsWith(".md")) {
        $mdfiles += $_.FullName
    }
}
$files = Get-ChildItem "./docs" -Recurse
foreach ($_ in $files) {
    if ($_.Name.EndsWith(".md")) {
        $mdfiles += $_.FullName
    }
}
$marked = @{}
foreach ($file in $mdfiles) {
    Write-Host ($file + "...")
    Get-Content $file | ForEach-Object {
        if ($_ -match "^!\[.*\]\((?!https)(.+)\)") {
            $basename = (Split-Path $Matches[1] -Leaf)
            $marked[$basename] = $file
        } elseif ($_ -match "<img.*?src=`"(?!https)(.+?)`".*>") {
            $basename = (Split-Path $Matches[1] -Leaf)
            $marked[$basename] = $file
        }
    }
}

$files = Get-ChildItem "./static/img" -Recurse
$images = @{}
foreach ($_ in $files) {
    if ($_.Name -match "\.(png|jpg|jpeg|gif)$") {
        $images[$_.Name] = $_.FullName
    }
}

Write-Host "[----- NotFound -----]"

$results = @{}
foreach ($key in $marked.Keys) {
    if ($images.ContainsKey($key)) {
        if (-not $results.ContainsKey($key)) {
            $name = $marked[$key]
            $results[$key] = $name, $images[$key]
        }
    } else {
        Write-Host ("NotFound: " + $key)
        Write-Host ("          " + $name)
    }
}

# $items = $results.GetEnumerator() | Sort-Object -Property key
# foreach ($_ in $items) {
#     Write-Host $_.Key
#     Write-Host ("    " + $_.Value[0])
#     Write-Host ("    " + $_.Value[1])
#     Write-Host ""
# }

Write-Host "[----- Unused -------]"

$items = $images.GetEnumerator() | Sort-Object -Property key
foreach ($_ in $items) {
    if (-not $results.ContainsKey($_.Key)) {
        Write-Host ("Unused: " + $_.Value)
    }
}