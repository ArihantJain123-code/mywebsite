# update_sitemaps.ps1
# Generates clean, 100% parameter-free sitemaps for Google Search Console and Bing

$ErrorActionPreference = "Stop"

# 1. Read all blog IDs from data.js
$raw = [System.IO.File]::ReadAllText("$PSScriptRoot\data.js", [System.Text.Encoding]::UTF8)
$startMarker = "const BLOGS_DATA = ["
$startIdx = $raw.IndexOf($startMarker)
$blogsText = $raw.Substring($startIdx + $startMarker.Length)
$blocks = [System.Text.RegularExpressions.Regex]::Split($blogsText, '(?m)^\s*\{\s*$\r?\n\s*id:\s*"')

$articlesUrls = @()

for ($i = 1; $i -lt $blocks.Length; $i++) {
    $block = 'id: "' + $blocks[$i]
    $id = [System.Text.RegularExpressions.Regex]::Match($block, 'id:\s*"([^"]+)"').Groups[1].Value
    if (-not $id) { continue }

    $slug = $id
    if ($id -eq "online-mba-colleges-haryana-guide") {
        $slug = "online-mba-colleges-haryana"
    } elseif ($id -eq "online-mba-colleges-under-1-lakh-india") {
        $slug = "online-mba-colleges-under-1-lakh"
    } elseif ($id -eq "ultimate-guide-online-bba-programs-india") {
        $slug = "ultimate-guide-online-bba-programs-india"
    }

    $priority = "0.80"
    if ($slug -like "online-mba-colleges*") { $priority = "0.85" }
    elseif ($slug -like "ultimate-guide*") { $priority = "0.85" }
    elseif ($slug -like "review-*") { $priority = "0.75" }

    $articlesUrls += [PSCustomObject]@{
        Loc = "https://www.getonlinedegrees.online/$slug"
        Priority = $priority
    }
}

# 2. Build sitemap_articles.xml
$xmlArticles = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- ================================================================= -->
  <!-- Authentic Editorial Guides & Verified University Reviews (Clean)   -->
  <!-- Total: $($articlesUrls.Count) Pre-rendered HTML Pages              -->
  <!-- ================================================================= -->
"@

foreach ($item in $articlesUrls) {
    $xmlArticles += @"

  <url>
    <loc>$($item.Loc)</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>$($item.Priority)</priority>
  </url>
"@
}

$xmlArticles += "`n</urlset>`n"
[System.IO.File]::WriteAllText("$PSScriptRoot\sitemap_articles.xml", $xmlArticles, [System.Text.Encoding]::UTF8)
Write-Host "Updated sitemap_articles.xml with $($articlesUrls.Count) clean URLs." -ForegroundColor Green


# 3. Build sitemap.xml (Core Landing Pages and Degree Hubs)
$xmlCore = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- ===================== MAIN PAGES ===================== -->

  <!-- Homepage -->
  <url>
    <loc>https://www.getonlinedegrees.online/</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Online MBA Hub -->
  <url>
    <loc>https://www.getonlinedegrees.online/online-mba</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Online MCA Hub -->
  <url>
    <loc>https://www.getonlinedegrees.online/online-mca</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Online BCA Hub -->
  <url>
    <loc>https://www.getonlinedegrees.online/online-bca</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Online BBA Hub -->
  <url>
    <loc>https://www.getonlinedegrees.online/online-bba</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Online M.Com Hub -->
  <url>
    <loc>https://www.getonlinedegrees.online/online-mcom</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Interactive University Compare Matrix -->
  <url>
    <loc>https://www.getonlinedegrees.online/compare</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Editorial Blogs & Guides Directory -->
  <url>
    <loc>https://www.getonlinedegrees.online/blog</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Interactive ATS Resume Builder -->
  <url>
    <loc>https://www.getonlinedegrees.online/resume-builder</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- CAT 2026 Score Calculator & Response Sheet Checker -->
  <url>
    <loc>https://www.getonlinedegrees.online/cat-score-calculator</loc>
    <lastmod>2026-10-11</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Academic Counselor Contact Hotline -->
  <url>
    <loc>https://www.getonlinedegrees.online/contact</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>

  <!-- HTML Sitemap Directory -->
  <url>
    <loc>https://www.getonlinedegrees.online/sitemap</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>

  <!-- Privacy Policy -->
  <url>
    <loc>https://www.getonlinedegrees.online/privacy</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.50</priority>
  </url>

  <!-- Terms & Conditions -->
  <url>
    <loc>https://www.getonlinedegrees.online/terms</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.50</priority>
  </url>

</urlset>
"@

[System.IO.File]::WriteAllText("$PSScriptRoot\sitemap.xml", $xmlCore, [System.Text.Encoding]::UTF8)
Write-Host "Updated sitemap.xml with core clean landing pages." -ForegroundColor Green

# 4. Update sitemap_index.xml
$xmlIndex = @"
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.getonlinedegrees.online/sitemap.xml</loc>
    <lastmod>2026-10-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.getonlinedegrees.online/sitemap_articles.xml</loc>
    <lastmod>2026-10-10</lastmod>
  </sitemap>
</sitemapindex>
"@

[System.IO.File]::WriteAllText("$PSScriptRoot\sitemap_index.xml", $xmlIndex, [System.Text.Encoding]::UTF8)
Write-Host "Updated sitemap_index.xml linking sitemap.xml and sitemap_articles.xml." -ForegroundColor Green
