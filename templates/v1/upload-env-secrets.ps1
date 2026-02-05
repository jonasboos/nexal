#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Upload .env variables as GitHub Secrets to the current repository
.DESCRIPTION
    Reads a .env file and uploads variables to the current repository using the GitHub CLI (gh).
.PARAMETER EnvFile
    Path to the .env file (default: .env)
.PARAMETER Force
    Force overwrite existing secrets without confirmation
.EXAMPLE
    .\upload-env-secrets.ps1
.EXAMPLE
    .\upload-env-secrets.ps1 -EnvFile .env.production -Force
#>

param(
    [string]$EnvFile = ".env",
    [switch]$Force
)

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Error: GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path $EnvFile)) {
    Write-Host "Error: $EnvFile file not found!" -ForegroundColor Red
    exit 1
}

# Get current repository info
$repoInfoRaw = gh repo view --json nameWithOwner 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not in a git repository or no remote configured." -ForegroundColor Red
    Write-Host $repoInfoRaw -ForegroundColor Yellow
    exit 1
}
$repoInfo = $repoInfoRaw | ConvertFrom-Json
$repo = $repoInfo.nameWithOwner
Write-Host "Repository: $repo" -ForegroundColor Cyan

# Parse .env file
$envVars = @{}
$lineNumber = 0

Get-Content $EnvFile | ForEach-Object {
    $lineNumber++
    $line = $_.Trim()

    # Skip empty lines and comments
    if ($line -eq "" -or $line.StartsWith("#")) { return }

    # Parse KEY=VALUE
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()

        # Remove surrounding quotes if present
        if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
            $value = $matches[1]
        }

        $envVars[$key] = $value
    } else {
        Write-Host "Warning: Line $lineNumber has invalid format: $line" -ForegroundColor Yellow
    }
}

if ($envVars.Count -eq 0) {
    Write-Host "No valid environment variables found in $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($envVars.Count) environment variables:" -ForegroundColor Green
$envVars.Keys | Sort-Object | ForEach-Object {
    $value = $envVars[$_]
    if ($value -and $value.Length -gt 10) {
        $maskedValue = $value.Substring(0,3) + "..." + $value.Substring($value.Length - 3)
    } else {
        $maskedValue = "***"
    }
    Write-Host "  $_ = $maskedValue"
}

# Confirm upload
if (-not $Force) {
    Write-Host "\nThis will upload these secrets to: $repo" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Cancelled by user." -ForegroundColor Red
        exit 0
    }
}

# Upload secrets
Write-Host "\nUploading secrets..." -ForegroundColor Cyan
$successCount = 0
$failCount = 0

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    # Upload secret using gh CLI and check exit code
    $value | gh secret set $key --repo $repo 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ${key}: OK" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ${key}: FAILED" -ForegroundColor Red
        $failCount++
    }
}

# Summary
$sep = ''.PadLeft(50,'=')
Write-Host "\n$sep" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Success: $successCount" -ForegroundColor Green
if ($failCount -gt 0) { Write-Host "  Failed:  $failCount" -ForegroundColor Red }
Write-Host "$sep" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "\nAll secrets uploaded successfully!" -ForegroundColor Green
    Write-Host "\nNote: You may still need to add these manually:" -ForegroundColor Yellow
    Write-Host "  SERVER_IP" -ForegroundColor Yellow
    Write-Host "  SSH_PRIVATE_KEY" -ForegroundColor Yellow
    Write-Host "Add them with: gh secret set <NAME> --repo $repo" -ForegroundColor Gray
} else {
    Write-Host "\nSome secrets failed to upload. Please check the errors above." -ForegroundColor Red
    exit 1
}
