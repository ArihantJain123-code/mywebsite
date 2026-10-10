# fix_card_links.ps1
# Fixes broken /online-= links on degree pages to point to /review-[university_id]

$files = @("online-mba.html", "online-mca.html", "online-bca.html", "online-bba.html", "online-mcom.html")

foreach ($f in $files) {
    $path = "$PSScriptRoot\$f"
    if (Test-Path $path) {
        $html = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        
        # Replace href="/online-=[id]" onclick="event.preventDefault(); openModal('[id]')"
        # with href="/review-[id]" (removing preventDefault so crawler and user can visit the deep-dive review)
        $fixed = [regex]::Replace($html, 'href="/online-=([^"]+)"\s+onclick="event\.preventDefault\(\);\s*openModal\(\''[^\'']+\''\)"', 'href="/review-$1"')
        
        # Also catch any raw /online-=
        $fixed = $fixed -replace '/online-=', '/review-'
        
        # Also fix any 'mba.ToUpper()' or similar literals in onclick
        $fixed = $fixed -replace "'mba\.ToUpper\(\)'", "'Online MBA'" `
                        -replace "'mca\.ToUpper\(\)'", "'Online MCA'" `
                        -replace "'bca\.ToUpper\(\)'", "'Online BCA'" `
                        -replace "'bba\.ToUpper\(\)'", "'Online BBA'" `
                        -replace "'mcom\.ToUpper\(\)'", "'Online M.Com'"
        
        [System.IO.File]::WriteAllText($path, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed internal review links and CTA parameters in $f" -ForegroundColor Green
    }
}
