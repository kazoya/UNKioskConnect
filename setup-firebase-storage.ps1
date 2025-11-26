# Firebase Storage Setup Script for Windows PowerShell
# This script sets up Firebase Storage and deploys security rules

Write-Host "🔥 Setting up Firebase Storage..." -ForegroundColor Cyan

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>&1
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Check if user is logged in
try {
    firebase projects:list 2>&1 | Out-Null
    Write-Host "✅ Already logged in to Firebase" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Firebase..." -ForegroundColor Yellow
    firebase login
}

# Check if .firebaserc exists
if (-not (Test-Path ".firebaserc")) {
    Write-Host "🚀 Initializing Firebase project..." -ForegroundColor Yellow
    Write-Host "⚠️  Run: firebase init storage" -ForegroundColor Yellow
    Write-Host "   Select your project and storage rules file" -ForegroundColor Yellow
} else {
    Write-Host "✅ Firebase project already initialized" -ForegroundColor Green
}

# Deploy Storage rules
Write-Host "📤 Deploying Storage security rules..." -ForegroundColor Cyan
firebase deploy --only storage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firebase Storage setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure Firebase Storage is enabled in Firebase Console" -ForegroundColor White
    Write-Host "2. Test image upload in your application" -ForegroundColor White
    Write-Host "3. Check Storage rules in Firebase Console → Storage → Rules" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Please check the error above." -ForegroundColor Red
}

