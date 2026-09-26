$port = 8080
$root = "d:\mywebsite"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "HTTP Server listening on http://localhost:$port/"
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $req = $context.Request
            $res = $context.Response
            
            $localPath = $req.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($localPath)) { 
                $localPath = "index.html" 
            }
            
            $fullPath = Join-Path $root $localPath
            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                switch ($ext) {
                    ".html" { $res.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $res.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
                    ".json" { $res.ContentType = "application/json; charset=utf-8" }
                    ".png"  { $res.ContentType = "image/png" }
                    ".jpg"  { $res.ContentType = "image/jpeg" }
                    ".jpeg" { $res.ContentType = "image/jpeg" }
                    ".webp" { $res.ContentType = "image/webp" }
                    ".svg"  { $res.ContentType = "image/svg+xml" }
                    ".ico"  { $res.ContentType = "image/x-icon" }
                    ".woff" { $res.ContentType = "font/woff" }
                    ".woff2"{ $res.ContentType = "font/woff2" }
                    default { $res.ContentType = "application/octet-stream" }
                }
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
                $notFoundPage = Join-Path $root "404.html"
                if (Test-Path $notFoundPage) {
                    $bytes = [System.IO.File]::ReadAllBytes($notFoundPage)
                    $res.ContentType = "text/html; charset=utf-8"
                    $res.ContentLength64 = $bytes.Length
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $res.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $res.OutputStream.Close()
        } catch {
            # Continue on connection reset or abort
        }
    }
} finally {
    $listener.Stop()
}
