$env_vars = @(
    @{ key = "DATABASE_URL"; value = 'postgresql://postgres.vojwtbxjwxrtpkkbsmzs:.7u%25f-Ge2MGiN%235@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' },
    @{ key = "DIRECT_URL"; value = 'postgresql://postgres.vojwtbxjwxrtpkkbsmzs:.7u%25f-Ge2MGiN%235@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres' },
    @{ key = "NEXTAUTH_URL"; value = 'https://best-tools-r42t.vercel.app' },
    @{ key = "NEXTAUTH_SECRET"; value = 'VT+8t/A56djGslP/J1zSzA+/oJqih33vlXx107KaTxo=' },
    @{ key = "NEXT_PUBLIC_SITE_URL"; value = 'https://best-tools-r42t.vercel.app' }
)

foreach ($var in $env_vars) {
    Write-Host "Adding $($var.key)..." -ForegroundColor Cyan
    $var.value | npx vercel env add $var.key production --force 2>&1
    Write-Host "Done: $($var.key)" -ForegroundColor Green
}

Write-Host "`nBarcha env vars yuborildi!" -ForegroundColor Yellow
