lsd .\docs\note | fzf | ForEach-Object {
    $outname = $_.Replace(".md", ".yaml")
    python $env:userprofile\bin\md2yaml.py -i .\docs\note\$_ -o .\docs-review\yaml\$outname
}