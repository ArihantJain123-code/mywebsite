# build_all_blogs.ps1
# Pre-renders all 43 editorial articles and verified university reviews into clean static HTML

$ErrorActionPreference = "Stop"
Write-Host "=== Starting Full Blog & Review Static Generator ===" -ForegroundColor Cyan

# Read base index.html
$indexHtml = [System.IO.File]::ReadAllText("$PSScriptRoot\index.html", [System.Text.Encoding]::UTF8)

# Extract template sections
$headerMatch = [regex]::Match($indexHtml, '(?s)(<header class="site-header">.*?</header>)')
$headerHtml = $headerMatch.Groups[1].Value

$footerMatch = [regex]::Match($indexHtml, '(?s)(<footer>.*?</footer>)')
$footerHtml = $footerMatch.Groups[1].Value

$modalsMatch = [regex]::Match($indexHtml, '(?s)(<!-- --- MODAL DIALOGS --- -->.*?</main>)')
$modalsHtml = $modalsMatch.Groups[1].Value

# Clean Nav and Footer
function Get-CleanNav($html) {
    $res = $html -replace '/\?view=home', '/' `
                 -replace '/\?view=catalog', '/online-mba' `
                 -replace '/\?view=compare', '/compare' `
                 -replace '/\?view=blog', '/blog' `
                 -replace '/\?view=contact', '/contact' `
                 -replace '/\?view=resume-builder', '/resume-builder'
    $res = $res -replace 'class="nav-link active"', 'class="nav-link"'
    $res = $res -replace 'data-target="blog"', 'data-target="blog" class="nav-link active"'
    return $res
}

function Get-CleanFooter($html) {
    return $html -replace '/\?view=catalog&amp;course=mba', '/online-mba' `
                 -replace '/\?view=catalog&amp;course=mca', '/online-mca' `
                 -replace '/\?view=catalog&amp;course=bca', '/online-bca' `
                 -replace '/\?view=catalog&amp;course=bba', '/online-bba' `
                 -replace '/\?view=catalog&amp;course=mcom', '/online-mcom' `
                 -replace '/\?view=catalog', '/online-mba' `
                 -replace '/\?view=compare', '/compare' `
                 -replace '/\?view=blog', '/blog' `
                 -replace '/\?view=contact', '/contact' `
                 -replace '/\?view=resume-builder', '/resume-builder'
}

$cleanNav = Get-CleanNav $headerHtml
$cleanFoot = Get-CleanFooter $footerHtml

# Knowledge Graph Entity Map for Generative Engine Optimization (GEO & Google Knowledge Vault)
$wikiMap = @{
    "review-amity_university_online" = @("https://en.wikipedia.org/wiki/Amity_University", "https://www.wikidata.org/wiki/Q4746979")
    "review-chandigarh_university_online" = @("https://en.wikipedia.org/wiki/Chandigarh_University", "https://www.wikidata.org/wiki/Q16955891")
    "review-manipal_university_jaipur_online" = @("https://en.wikipedia.org/wiki/Manipal_University_Jaipur", "https://www.wikidata.org/wiki/Q6749969")
    "review-lovely_professional_university_lpu_online" = @("https://en.wikipedia.org/wiki/Lovely_Professional_University", "https://www.wikidata.org/wiki/Q3631980")
    "review-jain_university_online" = @("https://en.wikipedia.org/wiki/Jain_University", "https://www.wikidata.org/wiki/Q6123861")
    "review-d_y_patil_university_online_pune" = @("https://en.wikipedia.org/wiki/Dr._D._Y._Patil_Vidyapeeth", "https://www.wikidata.org/wiki/Q16960113")
    "review-dy_patil_vidyapeeth_online_navi_mumbai" = @("https://en.wikipedia.org/wiki/Dr._D._Y._Patil_Vidyapeeth", "https://www.wikidata.org/wiki/Q16960113")
    "review-nmims_online" = @("https://en.wikipedia.org/wiki/NMIMS", "https://www.wikidata.org/wiki/Q6954203")
    "review-symbiosis_centre_for_distance_learning_scdl" = @("https://en.wikipedia.org/wiki/Symbiosis_Centre_for_Distance_Learning", "https://www.wikidata.org/wiki/Q7661144")
    "review-uttaranchal_university_online" = @("https://en.wikipedia.org/wiki/Uttaranchal_University", "https://www.wikidata.org/wiki/Q7903429")
    "review-kurukshetra_university_online" = @("https://en.wikipedia.org/wiki/Kurukshetra_University", "https://www.wikidata.org/wiki/Q6447477")
    "review-sikkim_manipal_university_online" = @("https://en.wikipedia.org/wiki/Sikkim_Manipal_University", "https://www.wikidata.org/wiki/Q7513753")
    "review-op_jindal_global_university_online" = @("https://en.wikipedia.org/wiki/O._P._Jindal_Global_University", "https://www.wikidata.org/wiki/Q7072147")
    "review-jamia_hamdard_university_online" = @("https://en.wikipedia.org/wiki/Jamia_Hamdard", "https://www.wikidata.org/wiki/Q1681387")
    "review-srm_university_online" = @("https://en.wikipedia.org/wiki/SRM_Institute_of_Science_and_Technology", "https://www.wikidata.org/wiki/Q2567425")
    "review-sastra_university_online" = @("https://en.wikipedia.org/wiki/Shanmugha_Arts,_Science,_Technology_%26_Research_Academy", "https://www.wikidata.org/wiki/Q7488812")
    "review-upes_online" = @("https://en.wikipedia.org/wiki/University_of_Petroleum_and_Energy_Studies", "https://www.wikidata.org/wiki/Q7896131")
    "review-amrita_vishwa_vidyapeetham_online" = @("https://en.wikipedia.org/wiki/Amrita_Vishwa_Vidyapeetham", "https://www.wikidata.org/wiki/Q4748685")
    "review-kl_university_online" = @("https://en.wikipedia.org/wiki/K_L_University", "https://www.wikidata.org/wiki/Q6327311")
    "review-golden_gate_university_usa" = @("https://en.wikipedia.org/wiki/Golden_Gate_University", "https://www.wikidata.org/wiki/Q1535492")
    "review-liverpool_john_moores_university_uk" = @("https://en.wikipedia.org/wiki/Liverpool_John_Moores_University", "https://www.wikidata.org/wiki/Q1866497")
    "review-andhra_university_online" = @("https://en.wikipedia.org/wiki/Andhra_University", "https://www.wikidata.org/wiki/Q492348")
    "review-shoolini_university_online" = @("https://en.wikipedia.org/wiki/Shoolini_University_of_Biotechnology_and_Management_Sciences", "https://www.wikidata.org/wiki/Q7500588")
    "review-galgotias_university_online" = @("https://en.wikipedia.org/wiki/Galgotias_University", "https://www.wikidata.org/wiki/Q5518491")
    "review-chitkara_university_online" = @("https://en.wikipedia.org/wiki/Chitkara_University,_Punjab", "https://www.wikidata.org/wiki/Q5102287")
}

# Read data.js
$raw = [System.IO.File]::ReadAllText("$PSScriptRoot\data.js", [System.Text.Encoding]::UTF8)
$startMarker = "const BLOGS_DATA = ["
$startIdx = $raw.IndexOf($startMarker)
$blogsText = $raw.Substring($startIdx + $startMarker.Length)

$blocks = [System.Text.RegularExpressions.Regex]::Split($blogsText, '(?m)^\s*\{\s*$\r?\n\s*id:\s*"')

$generatedUrls = @()

for ($i = 1; $i -lt $blocks.Length; $i++) {
    $block = 'id: "' + $blocks[$i]
    $id = [System.Text.RegularExpressions.Regex]::Match($block, 'id:\s*"([^"]+)"').Groups[1].Value
    $title = [System.Text.RegularExpressions.Regex]::Match($block, 'title:\s*"([^"]+)"').Groups[1].Value
    $category = [System.Text.RegularExpressions.Regex]::Match($block, 'category:\s*"([^"]+)"').Groups[1].Value
    $date = [System.Text.RegularExpressions.Regex]::Match($block, 'date:\s*"([^"]+)"').Groups[1].Value
    $author = [System.Text.RegularExpressions.Regex]::Match($block, 'author:\s*"([^"]+)"').Groups[1].Value
    $readTime = [System.Text.RegularExpressions.Regex]::Match($block, 'readTime:\s*"([^"]+)"').Groups[1].Value
    $excerpt = [System.Text.RegularExpressions.Regex]::Match($block, 'excerpt:\s*"([^"]+)"').Groups[1].Value
    
    $contentMatch = [System.Text.RegularExpressions.Regex]::Match($block, '(?s)content:\s*`([^`]+)`')
    if (-not $contentMatch.Success) {
        $contentMatch = [System.Text.RegularExpressions.Regex]::Match($block, '(?s)content:\s*"((?:[^"\\]|\\.)*)"')
    }
    
    if (-not $contentMatch.Success) {
        Write-Host "Warning: content match failed for $id" -ForegroundColor Yellow
        continue
    }

    $bodyHtml = $contentMatch.Groups[1].Value -replace '\\"', '"' -replace '\\/', '/'

    # Transform legacy query URLs inside blog body to clean static URLs
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;course=mba', '/online-mba'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;course=mca', '/online-mca'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;course=bca', '/online-bca'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;course=bba', '/online-bba'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;course=mcom', '/online-mcom'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&course=mba', '/online-mba'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&course=mca', '/online-mca'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&course=bca', '/online-bca'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&course=bba', '/online-bba'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&course=mcom', '/online-mcom'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&amp;university=([a-zA-Z0-9_]+)', '/review-$1'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog&university=([a-zA-Z0-9_]+)', '/review-$1'
    $bodyHtml = $bodyHtml -replace '/\?view=catalog', '/online-mba'
    $bodyHtml = $bodyHtml -replace '/\?view=compare', '/compare'
    $bodyHtml = $bodyHtml -replace '/\?view=blog', '/blog'
    $bodyHtml = $bodyHtml -replace '/\?view=contact', '/contact'
    $bodyHtml = $bodyHtml -replace '/\?view=resume-builder', '/resume-builder'

    # Determine canonical path and filename
    $canonicalPath = $id
    if ($id -eq "online-mba-colleges-haryana-guide") {
        $canonicalPath = "online-mba-colleges-haryana"
    } elseif ($id -eq "online-mba-colleges-under-1-lakh-india") {
        $canonicalPath = "online-mba-colleges-under-1-lakh"
    } elseif ($id -eq "ultimate-guide-online-bba-programs-india") {
        $canonicalPath = "ultimate-guide-online-bba-programs-india"
    }

    $generatedUrls += $canonicalPath

    # Clean description for meta tag (strip HTML, quotes)
    $cleanDesc = $excerpt -replace '"', '&quot;' -replace "'", '&#39;'
    if ($cleanDesc.Length -gt 155) { $cleanDesc = $cleanDesc.Substring(0, 155) + "..." }
    $cleanTitle = $title -replace '"', '&quot;'

    # JSON-LD Schemas (AEO / GEO / Knowledge Graph)
    $speakableSchema = @"
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "$cleanTitle",
    "url": "https://www.getonlinedegrees.online/$canonicalPath",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        ".blog-article h1",
        ".aeo-answer-block p",
        "#blog-article-body p:first-of-type"
      ]
    }
  }
"@

    $articleLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "$cleanTitle",
    "description": "$cleanDesc",
    "author": {
      "@type": "Person",
      "name": "$author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OnlineDegrees",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.getonlinedegrees.online/assets/logo.png"
      }
    },
    "datePublished": "$date",
    "dateModified": "2026-10-12",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.getonlinedegrees.online/$canonicalPath"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://www.getonlinedegrees.online/blog" },
      { "@type": "ListItem", "position": 3, "name": "$cleanTitle", "item": "https://www.getonlinedegrees.online/$canonicalPath" }
    ]
  },
$speakableSchema
"@

    if ($canonicalPath -like "review-*") {
        $uniName = $cleanTitle -replace "( Review.*| Online Review.*|:.*)", ""
        $sameAsBlock = ""
        if ($wikiMap.ContainsKey($canonicalPath)) {
            $urls = $wikiMap[$canonicalPath] | ForEach-Object { "`"$_`"" }
            $sameAsList = $urls -join ", "
            $sameAsBlock = "`n    `"sameAs`": [ $sameAsList ],"
        }
        $uniLd = @"
,
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "$uniName",
    "url": "https://www.getonlinedegrees.online/$canonicalPath",$sameAsBlock
    "description": "$cleanDesc",
    "parentOrganization": {
      "@type": "Organization",
      "name": "OnlineDegrees Verified University Index",
      "url": "https://www.getonlinedegrees.online/"
    }
  }
"@
        $articleLdJson += $uniLd
    }

    $articleLdJson += "`n]"

    # Construct HTML
    $fullHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$cleanTitle | OnlineDegrees</title>
  <meta name="description" content="$cleanDesc">
  <meta name="author" content="$author">
  <meta name="publisher" content="OnlineDegrees">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta http-equiv="Content-Language" content="en">
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <meta name="coverage" content="India">
  <meta name="distribution" content="Global">
  <meta name="rating" content="General">
  <meta name="revisit-after" content="7 days">
  <link rel="canonical" href="https://www.getonlinedegrees.online/$canonicalPath">
  <link rel="alternate" hreflang="en-IN" href="https://www.getonlinedegrees.online/$canonicalPath">
  <link rel="alternate" hreflang="x-default" href="https://www.getonlinedegrees.online/$canonicalPath">

  <!-- LLM & AI Generative Search Discovery (GEO Standard) -->
  <link rel="help" type="text/plain" href="https://www.getonlinedegrees.online/llms.txt" title="LLM Knowledge Digest">
  <link rel="alternate" type="text/plain" href="https://www.getonlinedegrees.online/llms-full.txt" title="Full AI Grounding Manifest">

  <!-- Open Graph / Social -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://www.getonlinedegrees.online/$canonicalPath">
  <meta property="og:title" content="$cleanTitle | OnlineDegrees">
  <meta property="og:description" content="$cleanDesc">
  <meta property="og:image" content="https://www.getonlinedegrees.online/assets/og-banner.jpg">
  <meta property="og:site_name" content="OnlineDegrees">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://www.getonlinedegrees.online/$canonicalPath">
  <meta name="twitter:title" content="$cleanTitle | OnlineDegrees">
  <meta name="twitter:description" content="$cleanDesc">
  <meta name="twitter:image" content="https://www.getonlinedegrees.online/assets/og-banner.jpg">

  <!-- Preconnect and Stylesheets -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json" id="seo-schema-ld-json">
$articleLdJson
  </script>
</head>
<body>
  $cleanNav

  <main id="main-content">
    <section id="blog-detail-view" class="view-section active">
      <div class="container blog-detail-container" style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
        <nav class="breadcrumb" style="margin-bottom: 24px; font-size: 0.9rem; color: var(--text-muted, #6c757d);" aria-label="Breadcrumb">
          <a href="/" style="color: var(--primary, #4361ee); text-decoration: none;">Home</a> &rsaquo;
          <a href="/blog" style="color: var(--primary, #4361ee); text-decoration: none;">Blogs</a> &rsaquo;
          <span style="color: var(--text-dark, #2b2d42);">$cleanTitle</span>
        </nav>

        <article class="blog-article" style="background: var(--card-bg, #ffffff); border-radius: 16px; padding: 36px; border: 1px solid var(--border-color, #e9ecef); box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <div class="article-meta" style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap; font-size: 0.88rem; color: var(--text-muted, #6c757d);">
            <span class="badge" style="background: rgba(67, 97, 238, 0.1); color: var(--primary, #4361ee); padding: 4px 12px; border-radius: 20px; font-weight: 600;">$category</span>
            <span>📅 $date</span>
            <span>✍️ $author</span>
            <span>⏱️ $readTime</span>
          </div>

          <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.25; margin-bottom: 24px; color: var(--text-dark, #1a1a2e);">$cleanTitle</h1>

          <!-- Quick Summary AEO Box -->
          <div class="aeo-answer-block" style="background: linear-gradient(135deg, rgba(67, 97, 238, 0.05), rgba(76, 201, 240, 0.05)); border-left: 4px solid var(--primary, #4361ee); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 1.05rem; line-height: 1.6; color: var(--text-dark, #2b2d42);">
              <strong>Direct Summary:</strong> $excerpt
            </p>
          </div>

          <div id="blog-article-body" class="article-body" style="font-size: 1.05rem; line-height: 1.75; color: var(--text-dark, #2b2d42);">
            $bodyHtml
          </div>

          <!-- Counselor CTA -->
          <div style="margin-top: 40px; padding: 28px; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 12px; color: #ffffff; text-align: center;">
            <h3 style="font-size: 1.4rem; margin-bottom: 10px; color: #ffffff;">Need Personalized Admission Guidance?</h3>
            <p style="font-size: 0.95rem; opacity: 0.9; margin-bottom: 20px;">Connect with our verified academic counselors for 100% free guidance on UGC approvals, fees, and placements.</p>
            <a href="/contact" class="btn btn-primary" style="background: #4361ee; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Talk to Counselor (Free)</a>
          </div>
        </article>
      </div>
    </section>

    $modalsHtml

  $cleanFoot

  <script src="data.js"></script>
  <script src="app.js"></script>
  <script src="chatbot.js"></script>
</body>
</html>
"@

    $outPath = "$PSScriptRoot\$canonicalPath.html"
    [System.IO.File]::WriteAllText($outPath, $fullHtml, [System.Text.Encoding]::UTF8)
    Write-Host "Generated $canonicalPath.html" -ForegroundColor Green
}

Write-Host "Generated all $($generatedUrls.Count) blog and review pages!" -ForegroundColor Cyan
