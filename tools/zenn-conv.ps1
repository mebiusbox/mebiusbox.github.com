lsd .\docs\note | fzf | ForEach-Object {
    md2zenn.ps1 .\docs\note\$_ .\docs-zenn docusaurus
}