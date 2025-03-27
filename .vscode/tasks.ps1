$ErrorActionPreference = "Stop"

function New-BlogPost() {
    param(
        [string]$WorkspaceFolder,
        [string]$NewName
    )
    $year = Get-Date -Format 'yyyy'
    $date = Get-Date -Format 'MM-dd'
    if (-not(Test-Path -LiteralPath "${WorkspaceFolder}\blog\${year}")) {
         New-Item -Path "${WorkspaceFolder}\blog\${year}" -ItemType "directory" | Out-Null 
    }
    Copy-Item -LiteralPath "${WorkspaceFolder}\.vscode\templates\blog.md" -Destination "${WorkspaceFolder}\blog\${year}\${date}-${NewName}.md" | Out-Null
    code "${WorkspaceFolder}\blog\${year}\${date}-${NewName}.md"
}

function New-Note() {
    param(
        [string]$WorkspaceFolder,
        [string]$NewName
    )
    $date = Get-Date -Format 'yyyy-MM-dd'
    Copy-Item -LiteralPath "${WorkspaceFolder}\.vscode\templates\note.md" -Destination "${WorkspaceFolder}\docs\note\${date}-${NewName}.md" | Out-Null
    code "${WorkspaceFolder}\docs\note\${date}-${NewName}.md"
}