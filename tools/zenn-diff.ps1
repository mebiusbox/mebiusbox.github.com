lsd .\docs-zenn\*.md | fzf | ForEach-Object {
    git diff --no-index -U0 .\$_ .\$_.bak
}