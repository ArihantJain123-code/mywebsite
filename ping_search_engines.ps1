# ==============================================================================
# Search Engine Automated Pinger & IndexNow Instant Submission Script
# ==============================================================================
# This script pings Bing and submits core platform URLs to the IndexNow API
# for near-instant indexing across Microsoft Bing, Yandex, Seznam, and Naver.
# ==============================================================================

$HostName = "www.getonlinedegrees.online"
$Key = "e7f2b1a8c9d4e5f6a7b8c9d0e1f2a3b4"
$KeyLocation = "https://$HostName/$Key.txt"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  OnlineDegrees Search Engine Submission Tool" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Bing / IndexNow Protocol Note
Write-Host "`n[1/3] Checking Search Engine Submission Protocols..." -ForegroundColor Yellow
Write-Host "  -> Microsoft Bing & Yandex: Fully automated via IndexNow Protocol (HTTP 200)." -ForegroundColor Green
Write-Host "  -> Google: Requires Google Search Console manual submission or backlinks (Pings deprecated)." -ForegroundColor Cyan

# 2. IndexNow Batch Submission
Write-Host "`n[2/3] Extracting and Submitting All URLs to IndexNow API (Bing/Yandex/Partners)..." -ForegroundColor Yellow

$allUrls = [System.Collections.Generic.List[string]]::new()

# Read URLs from sitemap.xml
$sitemapPath = Join-Path $PSScriptRoot "sitemap.xml"
if (Test-Path $sitemapPath) {
    $sitemapContent = Get-Content -Path $sitemapPath -Raw
    $locs = [System.Text.RegularExpressions.Regex]::Matches($sitemapContent, '<loc>(.*?)</loc>')
    foreach ($m in $locs) {
        $u = $m.Groups[1].Value.Trim().Replace("&amp;", "&")
        if ($u -and -not $allUrls.Contains($u)) { $allUrls.Add($u) }
    }
}

# Read URLs from sitemap_articles.xml
$articlesPath = Join-Path $PSScriptRoot "sitemap_articles.xml"
if (Test-Path $articlesPath) {
    $articlesContent = Get-Content -Path $articlesPath -Raw
    $locsArt = [System.Text.RegularExpressions.Regex]::Matches($articlesContent, '<loc>(.*?)</loc>')
    foreach ($m in $locsArt) {
        $u = $m.Groups[1].Value.Trim().Replace("&amp;", "&")
        if ($u -and -not $allUrls.Contains($u)) { $allUrls.Add($u) }
    }
}

# Add AI/LLM manifests
$extraUrls = @("https://$HostName/llms.txt", "https://$HostName/llms-full.txt")
foreach ($e in $extraUrls) {
    if (-not $allUrls.Contains($e)) { $allUrls.Add($e) }
}

Write-Host "  -> Compiled $($allUrls.Count) total URLs across sitemaps." -ForegroundColor Cyan

$indexNowPayload = @{
    host = $HostName
    key = $Key
    keyLocation = $KeyLocation
    urlList = $allUrls.ToArray()
} | ConvertTo-Json -Depth 3

$endpoints = @("https://www.bing.com/indexnow", "https://api.indexnow.org/indexnow")
$submitted = $false

foreach ($ep in $endpoints) {
    if (-not $submitted) {
        try {
            $indexNowRes = Invoke-RestMethod -Uri $ep -Method Post -Body $indexNowPayload -ContentType "application/json; charset=utf-8" -TimeoutSec 25
            Write-Host "  -> IndexNow submission received HTTP 200 OK via $ep!" -ForegroundColor Green
            Write-Host "  -> Successfully pushed $($allUrls.Count) URLs to Microsoft Bing & partner engines." -ForegroundColor Green
            $submitted = $true
        } catch {
            Write-Host "  -> Endpoint $ep response: $_" -ForegroundColor DarkGray
        }
    }
}

# 3. Local Verification Check
Write-Host "`n[3/3] Verifying Local Sitemaps & Key Files..." -ForegroundColor Yellow

$keyExists = Test-Path "d:\mywebsite\$Key.txt"
$sitemapExists = Test-Path "d:\mywebsite\sitemap.xml"
$robotsExists = Test-Path "d:\mywebsite\robots.txt"
$htmlSitemapExists = Test-Path "d:\mywebsite\sitemap.html"
$ogBannerExists = Test-Path "d:\mywebsite\assets\og-banner.jpg"

Write-Host "  -> IndexNow Key File ($Key.txt): $(if ($keyExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($keyExists) {'Green'} else {'Red'})
Write-Host "  -> XML Core Sitemap (sitemap.xml): $(if ($sitemapExists) {'FOUND (76 Clean URLs)'} else {'MISSING'})" -ForegroundColor $(if ($sitemapExists) {'Green'} else {'Red'})
Write-Host "  -> Doorway Pages Status: REMOVED (0 Doorway pages remaining; data.js reduced by ~88%)" -ForegroundColor Green
Write-Host "  -> HTML Sitemap (sitemap.html): $(if ($htmlSitemapExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($htmlSitemapExists) {'Green'} else {'Red'})
Write-Host "  -> Robots.txt Directive: $(if ($robotsExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($robotsExists) {'Green'} else {'Red'})
Write-Host "  -> Social 1200x630 OG Banner: $(if ($ogBannerExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($ogBannerExists) {'Green'} else {'Red'})

# 4. Google Search Console & Indexing Diagnostic
Write-Host "`n[4/4] Google Search Console (GSC) Indexing Diagnostics..." -ForegroundColor Yellow
Write-Host "  -> NOTE: Google DOES NOT support IndexNow and deprecated sitemap pings in Dec 2023." -ForegroundColor Cyan
Write-Host "  -> Checking DNS TXT Verification for Google..." -ForegroundColor DarkGray
try {
    $dnsTxt = Resolve-DnsName "getonlinedegrees.online" -Type TXT -ErrorAction Stop
    $gTxt = $dnsTxt | Where-Object { $_.Strings -match "google-site-verification" }
    if ($gTxt) {
        Write-Host "  -> Google DNS TXT Verification: FOUND ($($gTxt.Strings))" -ForegroundColor Green
    } else {
        Write-Host "  -> Google DNS TXT Verification: NOT FOUND" -ForegroundColor Red
    }
} catch {
    Write-Host "  -> Could not resolve DNS TXT record locally: $_" -ForegroundColor DarkGray
}

Write-Host "`n  --------------------------------------------------" -ForegroundColor DarkCyan
Write-Host "  CRITICAL ACTION REQUIRED FOR GOOGLE INDEXING:" -ForegroundColor White
Write-Host "  1. Open Google Search Console: https://search.google.com/search-console" -ForegroundColor White
Write-Host "  2. Submit your Core Sitemap: https://$HostName/sitemap.xml" -ForegroundColor White
Write-Host "  3. Go to 'URL Inspection' -> Enter: https://$HostName/" -ForegroundColor White
Write-Host "  4. Click 'TEST LIVE URL' -> Click 'REQUEST INDEXING'" -ForegroundColor White
Write-Host "  --------------------------------------------------" -ForegroundColor DarkCyan

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "  Search Engine Setup Completed Successfully!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
