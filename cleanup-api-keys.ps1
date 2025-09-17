# Security Cleanup Script for PowerShell
# Run this script AFTER revoking the exposed API key

Write-Host "🚨 API Key Security Cleanup Script" -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository root" -ForegroundColor Red
    Write-Host "Please run this script from the repository root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "⚠️  CRITICAL WARNING:" -ForegroundColor Yellow
Write-Host "This script will rewrite git history to remove the exposed API key." -ForegroundColor Yellow
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "1. ✅ Revoked the old API key from Groq console" -ForegroundColor Green
Write-Host "2. ✅ Generated a new API key" -ForegroundColor Green
Write-Host "3. ✅ Coordinated with your team (history will change)" -ForegroundColor Green
Write-Host ""

$confirmation = Read-Host "Type 'YES I REVOKED THE KEY' to continue"
if ($confirmation -ne "YES I REVOKED THE KEY") {
    Write-Host "❌ Cleanup cancelled. Please revoke the API key first!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Starting git history cleanup..." -ForegroundColor Cyan

# Set environment variable to suppress filter-branch warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

try {
    # Clean up any previous filter-branch backups
    if (Test-Path ".git/refs/original") {
        Write-Host "🧹 Cleaning up previous filter-branch backups..." -ForegroundColor Yellow
        Remove-Item ".git/refs/original" -Recurse -Force
    }

    Write-Host "🔄 Rewriting git history to remove API key..." -ForegroundColor Cyan
    
    # Create a temporary script for the tree filter
    $tempScript = @"
if (Test-Path 'Frontend/src/components/ChatWidget.tsx') {
    (Get-Content 'Frontend/src/components/ChatWidget.tsx') -replace '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', 'REMOVED_EXPOSED_API_KEY' | Set-Content 'Frontend/src/components/ChatWidget.tsx'
}
"@
    
    $tempScriptFile = "temp_cleanup.ps1"
    $tempScript | Out-File -FilePath $tempScriptFile -Encoding UTF8
    
    # Run filter-branch
    git filter-branch --tree-filter "powershell -ExecutionPolicy Bypass -File $tempScriptFile" --all
    
    # Clean up temp script
    Remove-Item $tempScriptFile -Force
    
    Write-Host "✅ Git history cleaned successfully!" -ForegroundColor Green
    
    # Clean up filter-branch refs
    Write-Host "🧹 Cleaning up filter-branch references..." -ForegroundColor Cyan
    git for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }
    
    # Expire reflog and garbage collect
    Write-Host "🗑️  Running garbage collection..." -ForegroundColor Cyan
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    Write-Host ""
    Write-Host "✅ Cleanup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Verify the cleanup worked:" -ForegroundColor White
    Write-Host "   git log --all --oneline | Select-String 'gsk_'" -ForegroundColor Gray
    Write-Host "   (This should return no results)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Force push to update remote repository:" -ForegroundColor White
    Write-Host "   git push origin --force --all" -ForegroundColor Gray
    Write-Host "   git push origin --force --tags" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Set up your new API key:" -ForegroundColor White
    Write-Host "   cd Frontend" -ForegroundColor Gray
    Write-Host "   cp .env.example .env.local" -ForegroundColor Gray
    Write-Host "   # Edit .env.local with your NEW API key" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error during cleanup: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to resolve this manually or use BFG Repo-Cleaner instead." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔒 Security reminder:" -ForegroundColor Green
Write-Host "- The old API key should be revoked" -ForegroundColor White
Write-Host "- Use only environment variables for new keys" -ForegroundColor White
Write-Host "- Never commit secrets to git again" -ForegroundColor White