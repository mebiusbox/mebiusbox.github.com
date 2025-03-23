$ErrorActionPreference = "Stop"

function CreateNewBlogPost() {
    param(
        [string]$WorkspaceFolder,
        [string]$NewName
    )
    $year = Get-Date -Format 'yyyy'
    $date = Get-Date -Format 'MM-dd'
    if (-not(Test-Path -LiteralPath "${WorkspaceFolder}\blog\${year}")) {
         New-Item -Path "${WorkspaceFolder}\blog\${year}" -ItemType "directory" | Out-Null 
    }
    New-Item -Path "${WorkspaceFolder}\blog\${year}\${date}-${NewName}.md" | Out-Null
    code "${WorkspaceFolder}\blog\${year}\${date}-${NewName}.md"
}

function CreateNewNote() {
    param(
        [string]$WorkspaceFolder,
        [string]$NewName
    )
    $date = Get-Date -Format 'yyyy-MM-dd'
    New-Item -Path "${WorkspaceFolder}\docs\note\${date}-${NewName}.md" | Out-Null
    code "${WorkspaceFolder}\docs\note\${date}-${NewName}.md"
}