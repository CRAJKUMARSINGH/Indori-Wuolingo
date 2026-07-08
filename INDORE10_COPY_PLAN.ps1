# Indore10 copy plan for the unified IndiLingo repo.
# Edit $FinalRepo before running. This script intentionally copies only source folders
# and does not delete anything.

$FinalRepo = "C:\path\to\IndiLingo"
$SourceRoot = "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indore10"

if (!(Test-Path $FinalRepo)) {
  throw "Final repo path not found: $FinalRepo"
}

New-Item -ItemType Directory -Force -Path "$FinalRepo\apps" | Out-Null
New-Item -ItemType Directory -Force -Path "$FinalRepo\packages" | Out-Null
New-Item -ItemType Directory -Force -Path "$FinalRepo\docs\source-audits\indore10" | Out-Null

Copy-Item "$SourceRoot\artifacts\indilingo" "$FinalRepo\apps\web" -Recurse -Force
Copy-Item "$SourceRoot\artifacts\api-server" "$FinalRepo\apps\api" -Recurse -Force
Copy-Item "$SourceRoot\lib\db" "$FinalRepo\packages\db" -Recurse -Force
Copy-Item "$SourceRoot\lib\api-spec" "$FinalRepo\packages\api-spec" -Recurse -Force
Copy-Item "$SourceRoot\lib\api-client-react" "$FinalRepo\packages\api-client-react" -Recurse -Force
Copy-Item "$SourceRoot\lib\api-zod" "$FinalRepo\packages\api-zod" -Recurse -Force

New-Item -ItemType Directory -Force -Path "$FinalRepo\packages\curriculum\src" | Out-Null
Copy-Item "$SourceRoot\scripts\src\seed-indilingo.ts" "$FinalRepo\packages\curriculum\src\seed-indilingo.ts" -Force

Copy-Item "$SourceRoot\README.md" "$FinalRepo\docs\source-audits\indore10\README.md" -Force
Copy-Item "$SourceRoot\replit.md" "$FinalRepo\docs\source-audits\indore10\replit.md" -Force
Copy-Item "$SourceRoot\Creat.md" "$FinalRepo\docs\source-audits\indore10\Creat.md" -Force

Write-Host "Indore10 source copied. Next: patch match_pairs, soft hearts, PWA, and workspace package names."

