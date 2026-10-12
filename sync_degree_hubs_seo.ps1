# sync_degree_hubs_seo.ps1
# Synchronizes Speakable schema, CAT Calculator nav link, and sidebar cross-links across all degree hubs.

$hubs = @(
    @{ File = "online-mba.html"; Slug = "online-mba"; Title = "Online MBA in India 2026: Compare Top UGC-DEB Approved Colleges, Fees & Placements" },
    @{ File = "online-mca.html"; Slug = "online-mca"; Title = "Online MCA in India 2026: Compare Top UGC-DEB Approved Colleges, Fees & Placements" },
    @{ File = "online-bca.html"; Slug = "online-bca"; Title = "Online BCA in India 2026: Compare Top UGC-DEB Approved Colleges, Fees & Placements" },
    @{ File = "online-bba.html"; Slug = "online-bba"; Title = "Online BBA in India 2026: Compare Top UGC-DEB Approved Colleges, Fees & Placements" },
    @{ File = "online-mcom.html"; Slug = "online-mcom"; Title = "Online M.Com in India 2026: Compare Top UGC-DEB Approved Colleges, Fees & Placements" }
)

$catNav = @"
        <li>
          <a class="nav-link" href="/cat-score-calculator">
            <i class="fas fa-calculator" style="color:var(--accent);margin-right:2px;"></i> CAT Calc <span class="nav-pill-tag hot">LIVE</span>
          </a>
        </li>
"@

$catSidebar = @"
                <a href="/cat-score-calculator" style="padding:8px 12px; border-radius:6px; background:#f8fafc; color:var(--text-main); text-decoration:none; font-weight:600; font-size:0.9rem;"><i class="fas fa-calculator" style="color:var(--accent);"></i> CAT Score Calculator 2026</a>
"@

foreach ($h in $hubs) {
    $filePath = Join-Path $PSScriptRoot $h.File
    if (-not (Test-Path $filePath)) { continue }

    $html = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. Add CAT Calc to Navbar if not present
    if ($html -notmatch '/cat-score-calculator') {
        # Insert after compare board li
        $html = $html -replace '(?s)(<li[^>]*>\s*<a class="nav-link compare-badge-container".*?</li>)', "`$1`n$catNav"
    }

    # 2. Add CAT Calculator to Sidebar degree list if not present
    if ($html -notmatch 'href="/cat-score-calculator".*?CAT Score Calculator') {
        $html = $html -replace '(?s)(<div style="display:flex; flex-direction:column; gap:8px;">.*?)(</div>\s*</div>\s*<!-- Budget Filter)', "`$1$catSidebar`n              `$2"
    }

    # 3. Add Speakable schema if not present
    if ($html -notmatch 'SpeakableSpecification') {
        $speakableBlock = @"
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "$($h.Title)",
      "url": "https://www.getonlinedegrees.online/$($h.Slug)",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [
          ".course-header-desc",
          ".faq-answer-inner",
          ".buyer-guide-lead"
        ]
      }
    },
"@
        $html = $html -replace '(?s)("\@type":\s*"WebSite"[^}]+},)', "`$1`n$speakableBlock"
    }

    [System.IO.File]::WriteAllText($filePath, $html, [System.Text.Encoding]::UTF8)
    Write-Host "Synchronized SEO & AEO for $($h.File)" -ForegroundColor Green
}
