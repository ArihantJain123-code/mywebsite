# fix_encoding.ps1
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$rupee = [char]0x20B9
$htmlFiles = Get-ChildItem -Filter "*.html"

foreach ($file in $htmlFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    # Replace â‚¹ (UTF-8 bytes 0xC3 0xA2 0xE2 0x80 0x9A 0xC2 0xB9 interpreted as CP1252)
    $newText = $text -replace '\u00e2\u201a\u00b9', $rupee
    if ($newText -ne $text) {
        $outBytes = $utf8NoBom.GetBytes($newText)
        [System.IO.File]::WriteAllBytes($file.FullName, $outBytes)
        Write-Host "Fixed encoding in $($file.Name)" -ForegroundColor Green
    }
}
Write-Host "Encoding fix finished." -ForegroundColor Cyan
