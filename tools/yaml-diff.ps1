lsd .\docs-review\yaml\*.yaml | fzf | ForEach-Object {
    $fileName = Split-Path $_ -Leaf
    Get-Content .\docs-review\$fileName | ForEach-Object {
        if ($_ -match "^\s*gpt:") {
            return
        }
        $_
    } | Out-File ".\docs-review\diff.tmp"
    git diff --no-index -U0 -w .\$_ ".\docs-review\diff.tmp"
}