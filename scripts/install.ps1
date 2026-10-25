<#
.SYNOPSIS
Installs Bouncer on Windows from the public releases at github.com/shankar-sachin/get-bouncer.

.DESCRIPTION
Downloads Bouncer-Setup-<version>.exe from the latest release (prereleases included), or from
-Version, unblocks it and runs the installer. The installer is unsigned, so Windows SmartScreen
may warn on first run: choose More info, then Run anyway.

The installer also adds the bouncer command (bin\bouncer.cmd in the install folder) and puts
its folder on the user PATH. This script reports where it is and adds it to this session's PATH.

No login needed. GH_TOKEN or GITHUB_TOKEN, when set, raises GitHub's API rate limit.
Version: -Version or BOUNCER_VERSION, otherwise the latest release.

.PARAMETER Version
Install a specific version, e.g. v0.3.0. Defaults to the latest release.

.PARAMETER DryRun
Resolve the release and print what would happen. Nothing is downloaded or run.

.PARAMETER Silent
Run the installer with /S (no wizard). Without it, the normal installer wizard opens.

.EXAMPLE
irm https://getbouncer.pages.dev/install.ps1 | iex

.EXAMPLE
& ([scriptblock]::Create((irm https://getbouncer.pages.dev/install.ps1))) -DryRun

.EXAMPLE
powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 -Version v0.3.0 -Silent
#>
[CmdletBinding()]
param(
    [string]$Version = $env:BOUNCER_VERSION,
    [switch]$DryRun,
    [switch]$Silent
)

$ErrorActionPreference = 'Stop'
$Repo = 'shankar-sachin/get-bouncer'
$Api = 'https://api.github.com'

function Write-Step([string]$Message) {
    Write-Host "==> $Message"
}

# Runs a native command without PowerShell turning its stderr into a terminating error (Windows PowerShell 5.1).
function Invoke-Native([string]$File, [string[]]$Arguments) {
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & $File @Arguments 2>$null
        return [pscustomobject]@{ Code = $LASTEXITCODE; Output = $output }
    }
    finally {
        $ErrorActionPreference = $previous
    }
}

# GET repos/<repo>/<path> and return the parsed JSON. The token, when there is one, only raises the rate limit.
function Get-Api([string]$Path) {
    $headers = @{ Accept = 'application/vnd.github+json' }
    if ($Token) { $headers.Authorization = "Bearer $Token" }
    try {
        return Invoke-RestMethod -Uri "$Api/repos/$Repo/$Path" -Headers $headers
    }
    catch {
        throw "GitHub API request failed: $Path (no such release, or the API rate limit; set GH_TOKEN to raise it)."
    }
}

function Save-Asset($Asset, [string]$Destination) {
    # curl.exe ships with Windows 10 1803 and later. It drops the token when GitHub redirects to storage.
    if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
        throw 'curl.exe is needed to download Bouncer (it ships with Windows 10 1803 and later).'
    }
    $url = "$Api/repos/$Repo/releases/assets/$($Asset.id)"
    $curlArgs = @('-fsSL', '-H', 'Accept: application/octet-stream', '-o', $Destination, $url)
    if ($Token) { $curlArgs = @('-H', "Authorization: Bearer $Token") + $curlArgs }
    $result = Invoke-Native 'curl.exe' $curlArgs
    if ($result.Code -ne 0) {
        throw "download failed: $($Asset.name)"
    }
    Write-Step "downloaded $($Asset.name)"
}

# The bouncer command the installer wrote: the first user PATH folder holding bouncer.cmd, else the default folder.
function Find-BouncerCommand {
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    foreach ($dir in @($userPath -split ';' | Where-Object { $_ })) {
        $candidate = Join-Path ([Environment]::ExpandEnvironmentVariables($dir)) 'bouncer.cmd'
        if (Test-Path -LiteralPath $candidate) {
            return [pscustomobject]@{ Path = $candidate; OnPath = $true }
        }
    }
    $default = Join-Path $env:LOCALAPPDATA 'Programs\Bouncer\bin\bouncer.cmd'
    if (Test-Path -LiteralPath $default) {
        return [pscustomobject]@{ Path = $default; OnPath = $false }
    }
    return $null
}

function Test-Checksum($Release, $Installer, [string]$InstallerPath, [string]$WorkDir) {
    $sums = $Release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
    if (-not $sums) {
        Write-Warning "$Tag has no SHA256SUMS asset, so $($Installer.name) is not checksum-verified."
        return
    }
    $sumsPath = Join-Path $WorkDir 'SHA256SUMS'
    Save-Asset $sums $sumsPath
    $line = Get-Content -LiteralPath $sumsPath | Where-Object { $_ -match "\s\*?$([regex]::Escape($Installer.name))\s*$" } | Select-Object -First 1
    if (-not $line) {
        throw "SHA256SUMS has no entry for $($Installer.name)"
    }
    $expected = ($line -split '\s+')[0]
    $actual = (Get-FileHash -LiteralPath $InstallerPath -Algorithm SHA256).Hash
    if ($expected -ne $actual) {
        throw "checksum mismatch for $($Installer.name) (expected $expected, got $actual)"
    }
    Write-Step "sha256 verified for $($Installer.name)"
}

if ($env:OS -ne 'Windows_NT') {
    throw 'install.ps1 runs on Windows only. On macOS or Linux, use install.sh.'
}
if ($env:PROCESSOR_ARCHITECTURE -notin @('AMD64', 'ARM64')) {
    throw "unsupported processor architecture: $($env:PROCESSOR_ARCHITECTURE)"
}

# Optional token: public releases need none.
$Token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } else { $null }
$Auth = if ($Token) { 'token' } else { 'none' }
Write-Step "repository: $Repo (auth: $Auth)"

# Release: the latest one (prereleases included), or the requested version.
if ($Version) {
    if ($Version.StartsWith('v')) {
        $Tag = $Version
    }
    else {
        $Tag = "v$Version"
    }
    $Release = Get-Api "releases/tags/$Tag"
}
else {
    # An empty JSON array can come back as a single $null, so drop nulls before counting.
    $list = @(Get-Api 'releases?per_page=1' | Where-Object { $_ -and $_.tag_name })
    if ($list.Count -eq 0) {
        throw "Bouncer has no published release yet. Watch https://github.com/$Repo/releases for the first one."
    }
    $Release = $list[0]
    $Tag = $Release.tag_name
}
Write-Step "release: $Tag"

$ver = $Tag.Substring(1)
$candidates = @("Bouncer-Setup-$ver.exe", "Bouncer Setup $ver.exe")
$Installer = $Release.assets | Where-Object { $candidates -contains $_.name } | Select-Object -First 1
if (-not $Installer) {
    $available = ($Release.assets | ForEach-Object { $_.name }) -join ' '
    throw "$Tag has no Windows installer ($($candidates[0])). Available: $available"
}

if ($DryRun) {
    Write-Output "would download: $($Installer.name)"
    if ($Release.assets | Where-Object { $_.name -eq 'SHA256SUMS' }) {
        Write-Output 'checksums: SHA256SUMS present, will verify'
    }
    else {
        Write-Output "checksums: no SHA256SUMS in $Tag, verification skipped"
    }
    if ($Silent) {
        Write-Output 'would unblock and run the installer silently (/S)'
    }
    else {
        Write-Output 'would unblock and run the installer (wizard)'
    }
    Write-Output 'would report the bouncer command (bin\bouncer.cmd, added to the user PATH by the installer)'
    Write-Output 'dry run: nothing was downloaded or run'
    return
}

$work = Join-Path ([IO.Path]::GetTempPath()) ('bouncer-install-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work | Out-Null
try {
    $installerPath = Join-Path $work $Installer.name
    Save-Asset $Installer $installerPath
    Test-Checksum $Release $Installer $installerPath $work

    Unblock-File -LiteralPath $installerPath
    Write-Step 'running the installer (SmartScreen may warn: choose More info, then Run anyway)'
    if ($Silent) {
        $process = Start-Process -FilePath $installerPath -ArgumentList '/S' -Wait -PassThru
    }
    else {
        $process = Start-Process -FilePath $installerPath -Wait -PassThru
    }
    if ($process.ExitCode -ne 0) {
        throw "the installer exited with code $($process.ExitCode)"
    }
    Write-Step 'installed Bouncer. Launch it from the Start menu.'

    $command = Find-BouncerCommand
    if (-not $command) {
        Write-Warning 'bouncer.cmd was not found, so the bouncer command is not set up. Reinstall, or see the CLI docs.'
    }
    else {
        $binDir = Split-Path -Parent $command.Path
        if (-not (($env:Path -split ';') -contains $binDir)) {
            $env:Path = "$env:Path;$binDir"
        }
        Write-Step "bouncer command: $($command.Path)"
        if ($command.OnPath) {
            Write-Output 'Run bouncer --help here, or in any new terminal.'
        }
        else {
            Write-Warning "$binDir is not on your user PATH. Add it in Settings, System, About, Advanced system settings, Environment Variables."
        }
    }
}
finally {
    if (Test-Path -LiteralPath $work) {
        Remove-Item -LiteralPath $work -Recurse -Force -ErrorAction SilentlyContinue
    }
}
