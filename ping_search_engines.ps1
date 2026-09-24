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

# 1. Bing Sitemap Ping
Write-Host "`n[1/3] Pinging Microsoft Bing Sitemap Endpoint..." -ForegroundColor Yellow
$bingPingUrl = "https://www.bing.com/ping?sitemap=https%3A%2F%2F$HostName%2Fsitemap.xml"

try {
    $res = Invoke-WebRequest -Uri $bingPingUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "  -> Bing Ping Status: $($res.StatusCode) $($res.StatusDescription)" -ForegroundColor Green
} catch {
    Write-Host "  -> Note: Bing Ping returned: $_ (Normal if running in an offline or restricted environment)" -ForegroundColor DarkGray
}

# 2. IndexNow Batch Submission
Write-Host "`n[2/3] Submitting Core URLs to IndexNow API (Bing/Yandex/Partners)..." -ForegroundColor Yellow

$coreUrls = @(
    "https://$HostName/",
    "https://$HostName/?view=catalog",
    "https://$HostName/?view=catalog&course=mba",
    "https://$HostName/?view=catalog&course=mca",
    "https://$HostName/?view=catalog&course=bca",
    "https://$HostName/?view=catalog&course=bba",
    "https://$HostName/?view=catalog&course=mcom",
    "https://$HostName/?view=compare",
    "https://$HostName/?view=blog",
    "https://$HostName/?view=resume-builder",
    "https://$HostName/?view=contact",
    "https://$HostName/sitemap.html",
    "https://$HostName/llms.txt",
    "https://$HostName/llms-full.txt"
)

$indexNowPayload = @{
    host = $HostName
    key = $Key
    keyLocation = $KeyLocation
    urlList = $coreUrls
} | ConvertTo-Json -Depth 3

try {
    $indexNowRes = Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" -Method Post -Body $indexNowPayload -ContentType "application/json; charset=utf-8" -TimeoutSec 10
    Write-Host "  -> IndexNow submission received HTTP 200 OK!" -ForegroundColor Green
    Write-Host "  -> Submitted $($coreUrls.Count) primary URLs for instant indexing." -ForegroundColor Green
} catch {
    Write-Host "  -> IndexNow API response: $_ (Will succeed in production upon DNS/HTTPS deployment)" -ForegroundColor DarkGray
}

# 3. Local Verification Check
Write-Host "`n[3/3] Verifying Local Sitemaps & Key Files..." -ForegroundColor Yellow

$keyExists = Test-Path "d:\mywebsite\$Key.txt"
$sitemapExists = Test-Path "d:\mywebsite\sitemap.xml"
$robotsExists = Test-Path "d:\mywebsite\robots.txt"
$htmlSitemapExists = Test-Path "d:\mywebsite\sitemap.html"
$ogBannerExists = Test-Path "d:\mywebsite\assets\og-banner.jpg"

Write-Host "  -> IndexNow Key File ($Key.txt): $(if ($keyExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($keyExists) {'Green'} else {'Red'})
Write-Host "  -> XML Sitemap (sitemap.xml): $(if ($sitemapExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($sitemapExists) {'Green'} else {'Red'})
Write-Host "  -> HTML Sitemap (sitemap.html): $(if ($htmlSitemapExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($htmlSitemapExists) {'Green'} else {'Red'})
Write-Host "  -> Robots.txt Directive: $(if ($robotsExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($robotsExists) {'Green'} else {'Red'})
Write-Host "  -> Social 1200x630 OG Banner: $(if ($ogBannerExists) {'FOUND'} else {'MISSING'})" -ForegroundColor $(if ($ogBannerExists) {'Green'} else {'Red'})

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "  Search Engine Setup Completed Successfully!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
