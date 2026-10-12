# build_full_site.ps1
# Complete Pre-render Engine for OnlineDegrees: Degrees, Core Tools, and Pillar Articles.

$ErrorActionPreference = "Stop"
Write-Host "=== Starting Full Site Static Generator ===" -ForegroundColor Cyan

# 1. Read base index.html
$indexHtml = Get-Content -Path "index.html" -Raw -Encoding UTF8

# Extract template sections
$headerMatch = [regex]::Match($indexHtml, '(?s)(<header class="site-header">.*?</header>)')
$headerHtml = $headerMatch.Groups[1].Value

$footerMatch = [regex]::Match($indexHtml, '(?s)(<footer>.*?</footer>)')
$footerHtml = $footerMatch.Groups[1].Value

$modalsMatch = [regex]::Match($indexHtml, '(?s)(<!-- --- MODAL DIALOGS --- -->.*?</main>)')
$modalsHtml = $modalsMatch.Groups[1].Value

# Clean Nav and Footer
function Get-CleanNav($html, $activeTarget) {
    $res = $html -replace '/\?view=home', '/' `
                 -replace '/\?view=catalog', '/online-mba' `
                 -replace '/\?view=compare', '/compare' `
                 -replace '/\?view=blog', '/blog' `
                 -replace '/\?view=contact', '/contact' `
                 -replace '/\?view=resume-builder', '/resume-builder'
                 
    $res = $res -replace 'class="nav-link active"', 'class="nav-link"'
    if ($activeTarget -eq 'home') {
        $res = $res -replace 'data-target="home"', 'data-target="home" class="nav-link active"'
    } elseif ($activeTarget -eq 'catalog') {
        $res = $res -replace 'data-target="catalog"', 'data-target="catalog" class="nav-link active"'
    } elseif ($activeTarget -eq 'compare') {
        $res = $res -replace 'data-target="compare"', 'data-target="compare" class="nav-link active"'
    } elseif ($activeTarget -eq 'blog') {
        $res = $res -replace 'data-target="blog"', 'data-target="blog" class="nav-link active"'
    } elseif ($activeTarget -eq 'contact') {
        $res = $res -replace 'data-target="contact"', 'data-target="contact" class="nav-link active"'
    }
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

# 2. Extract Compare View HTML
$compareSectionMatch = [regex]::Match($indexHtml, '(?s)(<section id="compare-view" class="view-section">.*?</section>)')
$compareSectionHtml = $compareSectionMatch.Groups[1].Value -replace 'class="view-section"', 'class="view-section active"'

# 3. Extract Blog View HTML
$blogSectionMatch = [regex]::Match($indexHtml, '(?s)(<section id="blog-view" class="view-section">.*?</section>)')
$blogSectionHtml = $blogSectionMatch.Groups[1].Value -replace 'class="view-section"', 'class="view-section active"'

# 4. Extract Contact View HTML
$contactSectionMatch = [regex]::Match($indexHtml, '(?s)(<section id="contact-view" class="view-section">.*?</section>)')
$contactSectionHtml = $contactSectionMatch.Groups[1].Value -replace 'class="view-section"', 'class="view-section active"'

# 5. Extract Resume Builder View HTML
$resumeSectionMatch = [regex]::Match($indexHtml, '(?s)(<section id="resume-builder-view" class="view-section">.*?</section>)')
$resumeSectionHtml = $resumeSectionMatch.Groups[1].Value -replace 'class="view-section"', 'class="view-section active"'

# 6. Extract Blog Detail Base View HTML
$blogDetailSectionMatch = [regex]::Match($indexHtml, '(?s)(<section id="blog-detail-view" class="view-section">.*?</section>)')
$blogDetailBaseHtml = $blogDetailSectionMatch.Groups[1].Value -replace 'class="view-section"', 'class="view-section active"'

# Helper to construct full HTML document
function Build-Doc($title, $desc, $canonicalPath, $activeNav, $contentSectionHtml, $ldJson, $initJs = "") {
    $cleanNav = Get-CleanNav $headerHtml $activeNav
    $cleanFoot = Get-CleanFooter $footerHtml

    return @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title</title>
  <meta name="description" content="$desc">
  <meta name="author" content="OnlineDegrees">
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
  <link rel="alternate" hreflang="en" href="https://www.getonlinedegrees.online/$canonicalPath">
  <link rel="alternate" hreflang="x-default" href="https://www.getonlinedegrees.online/$canonicalPath">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/logo.png">
  <link rel="apple-touch-icon" href="assets/logo.png">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OnlineDegrees">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="https://www.getonlinedegrees.online/$canonicalPath">
  <meta property="og:title" content="$title">
  <meta property="og:description" content="$desc">
  <meta property="og:image" content="https://www.getonlinedegrees.online/assets/og-banner.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:site" content="@OnlineDegrees">
  <meta property="twitter:url" content="https://www.getonlinedegrees.online/$canonicalPath">
  <meta property="twitter:title" content="$title">
  <meta property="twitter:description" content="$desc">
  <meta property="twitter:image" content="https://www.getonlinedegrees.online/assets/og-banner.jpg">

  <!-- Verification Tags -->
  <meta name="google-site-verification" content="ryeZfQtwAz0BvQG0KNqVp_kHCm7YwmL143gKgnmej7o">
  <meta name="google-site-verification" content="X73PWSuzwFFpFYBdR7lBB7q6ef-8gNznk1Lm6Cx7tAw">
  <meta name="msvalidate.01" content="BING_VERIFICATION_TOKEN_HERE">

  <!-- Fonts & Stylesheet -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">

  <script type="application/ld+json">
  $ldJson
  </script>
</head>
<body>

  $cleanNav

  <main>
    $contentSectionHtml

    <!-- Hidden Sections for SPA Router Compatibility -->
    <section id="home-view" class="view-section" style="display:none;"></section>
    <section id="catalog-view" class="view-section" style="display:none;"></section>
    <section id="compare-view" class="view-section" style="display:none;"></section>
    <section id="blog-view" class="view-section" style="display:none;"></section>
    <section id="blog-detail-view" class="view-section" style="display:none;"></section>
    <section id="contact-view" class="view-section" style="display:none;"></section>
    <section id="resume-builder-view" class="view-section" style="display:none;"></section>

    $modalsHtml

  $cleanFoot

  <!-- Client-Side Hydration Scripts -->
  <script src="data.js" defer></script>
  <script src="app.js" defer></script>
  <script src="chatbot.js" defer></script>
  <script src="analytics.js" defer></script>
  $(if ($initJs) { "<script>$initJs</script>" } else { "" })
</body>
</html>
"@
}

# --- A. Generate compare.html ---
$compareLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OnlineDegrees",
    "url": "https://www.getonlinedegrees.online/"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Compare Online Universities Side-by-Side: Fees, Approvals & Placements",
    "url": "https://www.getonlinedegrees.online/compare",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".compare-header p",
        ".compare-matrix"
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "Compare Board", "item": "https://www.getonlinedegrees.online/compare" }
    ]
  }
]
"@
$compareHtml = Build-Doc `
    -title "Compare Online Universities Side-by-Side: Fees, Approvals & Placements | OnlineDegrees" `
    -desc "Compare fees, NAAC grades, UGC-DEB approvals, LMS ratings, and placement reports of top online universities side-by-side in India." `
    -canonicalPath "compare" `
    -activeNav "compare" `
    -contentSectionHtml $compareSectionHtml `
    -ldJson $compareLdJson `
    -initJs "document.addEventListener('DOMContentLoaded', function(){ if(typeof renderCompareMatrix === 'function'){ renderCompareMatrix(); } });"

Set-Content -Path "compare.html" -Value $compareHtml -Encoding UTF8
Write-Host "Generated compare.html" -ForegroundColor Green

# --- B. Generate blog.html ---
$blogLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OnlineDegrees",
    "url": "https://www.getonlinedegrees.online/"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Educational Guides, UGC Approvals Checklist & University Reviews",
    "url": "https://www.getonlinedegrees.online/blog",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".blog-header p"
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "Blogs & Guides", "item": "https://www.getonlinedegrees.online/blog" }
    ]
  }
]
"@
$blogHtml = Build-Doc `
    -title "Educational Guides, UGC Approvals Checklist & University Reviews | OnlineDegrees" `
    -desc "Authoritative articles on UGC-DEB regulations, fee comparisons, entrance exam exemptions, tech career transitions, and verified university reviews." `
    -canonicalPath "blog" `
    -activeNav "blog" `
    -contentSectionHtml $blogSectionHtml `
    -ldJson $blogLdJson `
    -initJs "document.addEventListener('DOMContentLoaded', function(){ if(typeof renderBlogs === 'function'){ renderBlogs(); } });"

Set-Content -Path "blog.html" -Value $blogHtml -Encoding UTF8
Write-Host "Generated blog.html" -ForegroundColor Green

# --- C. Generate contact.html ---
$contactLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact OnlineDegrees Academic Counselors",
    "url": "https://www.getonlinedegrees.online/contact"
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://www.getonlinedegrees.online/contact" }
    ]
  }
]
"@
$contactHtml = Build-Doc `
    -title "Contact Academic Counselors: 100% Free Online Degree Guidance | OnlineDegrees" `
    -desc "Speak with verified educational advisors. Helpline: +91 63750 79973. Compare university fees, eligibility, and scholarship assistance." `
    -canonicalPath "contact" `
    -activeNav "contact" `
    -contentSectionHtml $contactSectionHtml `
    -ldJson $contactLdJson

Set-Content -Path "contact.html" -Value $contactHtml -Encoding UTF8
Write-Host "Generated contact.html" -ForegroundColor Green

# --- D. Generate resume-builder.html ---
$resumeLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OnlineDegrees ATS Resume Builder",
    "url": "https://www.getonlinedegrees.online/resume-builder",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free ATS Resume Builder for Tech & Management Graduates",
    "url": "https://www.getonlinedegrees.online/resume-builder",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".resume-builder-header p"
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "ATS Resume Builder", "item": "https://www.getonlinedegrees.online/resume-builder" }
    ]
  }
]
"@
$resumeHtml = Build-Doc `
    -title "Free ATS Resume Builder for Tech & Management Graduates | OnlineDegrees" `
    -desc "Create a professional, ATS-optimized resume for IT and corporate careers in under 5 minutes. Real-time preview and instant PDF download." `
    -canonicalPath "resume-builder" `
    -activeNav "" `
    -contentSectionHtml $resumeSectionHtml `
    -ldJson $resumeLdJson

Set-Content -Path "resume-builder.html" -Value $resumeHtml -Encoding UTF8
Write-Host "Generated resume-builder.html" -ForegroundColor Green

# --- E. Helper to build Pre-rendered Pillar Article Pages ---
function Build-ArticlePage($id, $title, $desc, $category, $author, $readTime, $date, $bodyHtml, $canonicalPath) {
    # Replace contents inside blogDetailBaseHtml
    $articleSection = $blogDetailBaseHtml
    $articleSection = $articleSection -replace '<h1 class="blog-article-title" id="blog-article-title">.*?</h1>', "<h1 class=`"blog-article-title`" id=`"blog-article-title`">$title</h1>"
    $articleSection = $articleSection -replace '<span class="blog-article-category-tag" id="blog-article-category">.*?</span>', "<span class=`"blog-article-category-tag`" id=`"blog-article-category`">$category</span>"
    $articleSection = $articleSection -replace '<span class="blog-article-read-time" id="blog-article-readtime">.*?</span>', "<span class=`"blog-article-read-time`" id=`"blog-article-readtime`"><i class=`"far fa-clock`"></i> $readTime</span>"
    $articleSection = $articleSection -replace '<h4 id="blog-article-author">.*?</h4>', "<h4 id=`"blog-article-author`">$author</h4>"
    $articleSection = $articleSection -replace '<p id="blog-article-date">.*?</li>|<p id="blog-article-date">.*?</p>', "<p id=`"blog-article-date`">Posted on $date</p>"
    $articleSection = $articleSection -replace '<!-- Article html copy injected -->', $bodyHtml
    $articleSection = $articleSection -replace 'id="blog-breadcrumb-active".*?>Article<', "id=`"blog-breadcrumb-active`">$title<"
    $articleSection = $articleSection -replace '<div class="related-posts-grid" id="blog-related-grid">.*?</div>', @"
<div class="related-posts-grid" id="blog-related-grid">
  <div class="blog-card">
    <div class="blog-card-body">
      <span class="blog-card-category">Regulatory</span>
      <h3 class="blog-card-title"><a href="/online-mba-colleges-haryana" style="color:inherit; text-decoration:none;">Top Online MBA Colleges in Haryana (KUK, OP Jindal, Manav Rachna)</a></h3>
      <p class="blog-card-excerpt">Comprehensive review of UGC-DEB approved institutions in Haryana with fees under 1 Lakh and NAAC A+ grades.</p>
    </div>
  </div>
  <div class="blog-card">
    <div class="blog-card-body">
      <span class="blog-card-category">Fee Comparison</span>
      <h3 class="blog-card-title"><a href="/online-mba-colleges-under-1-lakh" style="color:inherit; text-decoration:none;">Top Online MBA Colleges in India Under 1 Lakh</a></h3>
      <p class="blog-card-excerpt">Budget-friendly accredited MBA programs from Uttaranchal University, SCDL, and SMU.</p>
    </div>
  </div>
  <div class="blog-card">
    <div class="blog-card-body">
      <span class="blog-card-category">Career Guide</span>
      <h3 class="blog-card-title"><a href="/ultimate-guide-online-bba-programs-india" style="color:inherit; text-decoration:none;">The Ultimate Guide to Online BBA Programs in India</a></h3>
      <p class="blog-card-excerpt">Scope, corporate placement opportunities, and top colleges for 10+2 graduates.</p>
    </div>
  </div>
</div>
"@

    $articleLdJson = @"
[
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "$title",
    "description": "$desc",
    "author": {
      "@type": "Organization",
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
    "@type": "WebPage",
    "name": "$title",
    "url": "https://www.getonlinedegrees.online/$canonicalPath",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".article-body p:first-of-type"
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.getonlinedegrees.online/" },
      { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://www.getonlinedegrees.online/blog" },
      { "@type": "ListItem", "position": 3, "name": "$title", "item": "https://www.getonlinedegrees.online/$canonicalPath" }
    ]
  }
]
"@

    $articleHtml = Build-Doc `
        -title "$title | OnlineDegrees" `
        -desc $desc `
        -canonicalPath $canonicalPath `
        -activeNav "blog" `
        -contentSectionHtml $articleSection `
        -ldJson $articleLdJson

    Set-Content -Path "$canonicalPath.html" -Value $articleHtml -Encoding UTF8
    Write-Host "Generated $canonicalPath.html" -ForegroundColor Green
}

# --- F. Build the 3 Pillar Articles ---

# 1. Haryana Guide
$haryanaBody = (Get-Content "data.js" -Raw -Encoding UTF8)
$haryanaMatch = [regex]::Match($haryanaBody, '(?s)id:\s*"online-mba-colleges-haryana-guide".*?content:\s*`(.*?)`')
if ($haryanaMatch.Success) {
    Build-ArticlePage `
        -id "online-mba-colleges-haryana-guide" `
        -title "Top Online MBA Colleges in Haryana: Fees, UGC Approvals & 2026 Admission Guide" `
        -desc "Planning to pursue an Online MBA in Haryana? Discover top UGC-DEB approved universities including KUK, OP Jindal, Manav Rachna, MDU Rohtak & Amity Gurugram. Compare fees and placements." `
        -category "Career Guidance" `
        -author "Academic Counselors Team" `
        -readTime "8 min read" `
        -date "2026-08-05" `
        -bodyHtml $haryanaMatch.Groups[1].Value `
        -canonicalPath "online-mba-colleges-haryana"
}

# 2. Under 1 Lakh Guide
$under1LakhMatch = [regex]::Match($haryanaBody, '(?s)id:\s*"online-mba-colleges-under-1-lakh-india".*?content:\s*"((?:[^"\\]|\\.)*)"')
if ($under1LakhMatch.Success) {
    $cleanContent = $under1LakhMatch.Groups[1].Value -replace '\\"', '"' -replace '\\/', '/'
    Build-ArticlePage `
        -id "online-mba-colleges-under-1-lakh-india" `
        -title "Top Online MBA Colleges in India Under 1 Lakh: The Ultimate Guide" `
        -desc "Looking for affordable online MBA programs in India? Explore top UGC-DEB approved MBA colleges with total fees under 1 Lakh. Compare fees, accreditations, and placement opportunities." `
        -category "University Comparisons" `
        -author "Academic Counselors Team" `
        -readTime "6 min read" `
        -date "2026-07-12" `
        -bodyHtml $cleanContent `
        -canonicalPath "online-mba-colleges-under-1-lakh"
} else {
    Write-Host "Warning: under 1 lakh match failed" -ForegroundColor Yellow
}

# 3. BBA Guide
$bbaGuideMatch = [regex]::Match($haryanaBody, '(?s)id:\s*"ultimate-guide-online-bba-programs-india".*?content:\s*"((?:[^"\\]|\\.)*)"')
if ($bbaGuideMatch.Success) {
    $cleanContent = $bbaGuideMatch.Groups[1].Value -replace '\\"', '"' -replace '\\/', '/'
    Build-ArticlePage `
        -id "ultimate-guide-online-bba-programs-india" `
        -title "The Ultimate Guide to Online BBA Programs in India: Scope, Fees, & Top Colleges" `
        -desc "Looking to kickstart your corporate career with a flexible business degree? Discover the top UGC-DEB approved Online BBA programs in India, compare fee structures, and placements." `
        -category "Career Guidance" `
        -author "Academic Counselors Team" `
        -readTime "7 min read" `
        -date "2026-07-15" `
        -bodyHtml $cleanContent `
        -canonicalPath "ultimate-guide-online-bba-programs-india"
} else {
    Write-Host "Warning: bba guide match failed" -ForegroundColor Yellow
}

Write-Host "=== Full Site Static Generator Completed Successfully! ===" -ForegroundColor Cyan
