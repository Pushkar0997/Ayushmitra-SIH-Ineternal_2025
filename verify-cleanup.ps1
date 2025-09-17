# Verification script to check if API keys are completely removed
# Run this after completing the cleanup

Write-Host "🔍 API Key Cleanup Verification" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

$foundIssues = $false

# Check current working directory files
Write-Host "1. Checking current files for API keys..." -ForegroundColor Yellow

$apiKeyPatterns = @(
    "gsk_[a-zA-Z0-9]{51}",  # Groq API key pattern
    "sk-[a-zA-Z0-9]{48,}",   # OpenAI-style API key pattern
    "[a-zA-Z0-9_-]{32,}"     # Generic long strings that might be keys
)

$filesToCheck = @(
    "Frontend/src/components/ChatWidget.tsx",
    "Frontend/.env",
    "Frontend/.env.local",
    "Backend/ayushmitra_unified_backend.ipynb"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        foreach ($pattern in $apiKeyPatterns) {
            if ($content -match $pattern) {
                Write-Host "❌ Found potential API key in: $file" -ForegroundColor Red
                $foundIssues = $true
            }
        }
    }
}

if (-not $foundIssues) {
    Write-Host "✅ No API keys found in current files" -ForegroundColor Green
} else {
    Write-Host "⚠️  Found potential API keys in current files" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Checking git history for the specific exposed key..." -ForegroundColor Yellow

try {
    $historyCheck = git log --all --full-history -S "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" --oneline 2>$null
    if ($historyCheck) {
        Write-Host "❌ The exposed API key is still in git history!" -ForegroundColor Red
        Write-Host "Commits containing the key:" -ForegroundColor Yellow
        $historyCheck | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        $foundIssues = $true
    } else {
        Write-Host "✅ Exposed API key not found in git history" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check git history: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Checking for any remaining Groq API key patterns in history..." -ForegroundColor Yellow

try {
    $groqKeyCheck = git log --all --full-history -S "gsk_" --oneline 2>$null
    if ($groqKeyCheck) {
        Write-Host "⚠️  Found commits with 'gsk_' pattern (may be false positives):" -ForegroundColor Yellow
        $groqKeyCheck | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    } else {
        Write-Host "✅ No 'gsk_' patterns found in git history" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check for Groq key patterns: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4. Checking environment variable setup..." -ForegroundColor Yellow

$envExamplePath = "Frontend/.env.example"
$envLocalPath = "Frontend/.env.local"

if (Test-Path $envExamplePath) {
    Write-Host "✅ .env.example file exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env.example file missing" -ForegroundColor Red
    $foundIssues = $true
}

if (Test-Path $envLocalPath) {
    Write-Host "✅ .env.local file exists (good for development)" -ForegroundColor Green
    
    # Check if it contains a real API key (basic check)
    $envContent = Get-Content $envLocalPath -Raw
    if ($envContent -match "GROQ_API_KEY=gsk_") {
        Write-Host "✅ .env.local contains a Groq API key (verify it's the NEW one)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.local exists but may not have a valid Groq API key" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  .env.local file not found (create it for local development)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "5. Checking .gitignore configuration..." -ForegroundColor Yellow

if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "✅ .gitignore properly excludes .env files" -ForegroundColor Green
    } else {
        Write-Host "❌ .gitignore doesn't exclude .env files" -ForegroundColor Red
        $foundIssues = $true
    }
} else {
    Write-Host "❌ .gitignore file missing" -ForegroundColor Red
    $foundIssues = $true
}

Write-Host ""
Write-Host "📋 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan

if ($foundIssues) {
    Write-Host "❌ Issues found that need attention!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Recommended actions:" -ForegroundColor Yellow
    Write-Host "1. Complete the git history cleanup if the exposed key is still there" -ForegroundColor White
    Write-Host "2. Ensure you've revoked the old API key from Groq console" -ForegroundColor White
    Write-Host "3. Set up proper environment variables" -ForegroundColor White
    Write-Host "4. Force push cleaned history to GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "Run cleanup-api-keys.ps1 if you haven't already!" -ForegroundColor Red
} else {
    Write-Host "✅ All checks passed! Your repository appears to be clean." -ForegroundColor Green
    Write-Host ""
    Write-Host "Final steps:" -ForegroundColor Cyan
    Write-Host "1. Ensure you've revoked the old API key: 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" -ForegroundColor White
    Write-Host "2. Make sure your .env.local has your NEW API key" -ForegroundColor White
    Write-Host "3. If you cleaned git history, force push to GitHub" -ForegroundColor White
    Write-Host "4. Monitor your GitHub repository - the secret scanning alert should disappear" -ForegroundColor White
}

Write-Host ""