#!/bin/sh
# Bouncer installer for macOS and Linux. POSIX sh: works with sh, bash, zsh and dash.
#
# Releases are public in github.com/shankar-sachin/get-bouncer (the source stays private):
#   curl -fsSL https://getbouncer.pages.dev/install.sh | sh
#   curl -fsSL https://getbouncer.pages.dev/install.sh | sh -s -- --dry-run
# or run a local copy: sh install.sh [--dry-run] [--version v0.3.0]
#
# No login needed. GH_TOKEN or GITHUB_TOKEN, when set, is sent to avoid GitHub's API rate limit.
# Version: the latest release (prereleases included), or --version / BOUNCER_VERSION.
set -eu

REPO="shankar-sachin/get-bouncer"
API="https://api.github.com"

DRY_RUN=0
USER_INSTALL=0
FORCE_APPIMAGE=0
VERSION="${BOUNCER_VERSION:-}"
AUTH=""
TOKEN=""
TMP=""
TAG=""
VER=""
OS=""
ZIP_NAME=""
DEB_NAME=""
APPIMAGE_NAME=""

usage() {
  cat <<'EOF'
Usage: install.sh [options]

Installs the latest Bouncer release (prereleases included) or a given version from the
public releases at shankar-sachin/get-bouncer.

  macOS   Downloads the .zip for this Mac's architecture and installs Bouncer.app into
          /Applications (or ~/Applications with --user), then removes the quarantine flag.
  Linux   On Debian and Ubuntu, offers the .deb (asks first, installs with sudo). Otherwise
          installs the AppImage to ~/.local/bin with a desktop entry and MIME types.

Options:
  --version <tag>  Install a specific version, e.g. v0.3.0 (default: latest).
                   BOUNCER_VERSION does the same.
  --dry-run        Resolve the release and print what would happen. Nothing is downloaded or installed.
  --user           macOS: install into ~/Applications even when /Applications is writable.
  --appimage       Linux: use the AppImage even where a .deb is available.
  -h, --help       Show this help.

No login needed: releases are public. GH_TOKEN or GITHUB_TOKEN, when set, raises the API rate limit.

Piped usage passes options after -s --:
  curl -fsSL https://getbouncer.pages.dev/install.sh | sh -s -- --dry-run
EOF
}

die() {
  echo "install.sh: error: $*" >&2
  exit 1
}

warn() {
  echo "install.sh: warning: $*" >&2
}

info() {
  echo "==> $*"
}

cleanup() {
  if [ -n "$TMP" ] && [ -d "$TMP" ]; then
    rm -rf "$TMP"
  fi
}

parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
      --dry-run) DRY_RUN=1 ;;
      --user) USER_INSTALL=1 ;;
      --appimage) FORCE_APPIMAGE=1 ;;
      --version)
        [ $# -ge 2 ] || die "--version needs a value, e.g. --version v0.3.0"
        VERSION="$2"
        shift
        ;;
      --version=*) VERSION="${1#--version=}" ;;
      -h | --help)
        usage
        exit 0
        ;;
      *) die "unknown option: $1 (see --help)" ;;
    esac
    shift
  done
}

setup_auth() {
  command -v curl >/dev/null 2>&1 || die "curl is needed to download Bouncer"
  TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
  if [ -n "$TOKEN" ]; then AUTH="token"; else AUTH="none"; fi
}

# curl against the GitHub API, with the token when there is one. $1 Accept header, then curl args.
gh_curl() {
  accept=$1
  shift
  if [ "$AUTH" = "token" ]; then
    curl -fsSL -H "Authorization: Bearer $TOKEN" -H "Accept: $accept" "$@" </dev/null
  else
    curl -fsSL -H "Accept: $accept" "$@" </dev/null
  fi
}

# GET repos/$REPO/<path>, printing the JSON on stdout.
api_get() {
  gh_curl application/vnd.github+json "$API/repos/$REPO/$1" \
    || die "GitHub API request failed: $1 (no such release, or the API rate limit; set GH_TOKEN to raise it)"
}

resolve_release() {
  if [ -n "$VERSION" ]; then
    case "$VERSION" in
      v*) TAG="$VERSION" ;;
      *) TAG="v$VERSION" ;;
    esac
    api_get "releases/tags/$TAG" >"$TMP/release.json"
  else
    api_get "releases?per_page=1" >"$TMP/release.json"
    TAG=$(grep -o '"tag_name": *"[^"]*"' "$TMP/release.json" | head -n 1 | sed 's/.*"\([^"]*\)"$/\1/')
    [ -n "$TAG" ] || die "no releases found in $REPO"
  fi
  VER="${TAG#v}"

  # Release JSON lists each asset's id (in its url) and name in the same order.
  grep -o 'releases/assets/[0-9][0-9]*' "$TMP/release.json" | sed 's#.*/##' >"$TMP/ids.txt"
  grep -o '"name": *"[^" ]*"' "$TMP/release.json" | sed 's/.*"\([^"]*\)"$/\1/' >"$TMP/names.txt"
  paste -d' ' "$TMP/ids.txt" "$TMP/names.txt" >"$TMP/assets.txt"
}

asset_exists() {
  awk -v n="$1" '$2 == n { found = 1 } END { exit !found }' "$TMP/assets.txt"
}

asset_id() {
  awk -v n="$1" '$2 == n { print $1; exit }' "$TMP/assets.txt"
}

asset_list() {
  awk '{ printf "%s ", $2 }' "$TMP/assets.txt"
}

download_asset() {
  # $1 asset name, $2 destination path
  id=$(asset_id "$1")
  gh_curl application/octet-stream -o "$2" "$API/repos/$REPO/releases/assets/$id" || die "download failed: $1"
  info "downloaded $1"
}

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{ print $1 }'
  else
    shasum -a 256 "$1" | awk '{ print $1 }'
  fi
}

# Download an asset and check it against SHA256SUMS when the release has one.
fetch_verified() {
  download_asset "$1" "$TMP/$1"
  if ! asset_exists SHA256SUMS; then
    warn "$TAG has no SHA256SUMS asset, so $1 is not checksum-verified"
    return 0
  fi
  download_asset SHA256SUMS "$TMP/SHA256SUMS"
  expected=$(awk -v n="$1" '$2 == n || $2 == ("*" n) { print $1; exit }' "$TMP/SHA256SUMS")
  [ -n "$expected" ] || die "SHA256SUMS has no entry for $1"
  actual=$(sha256_of "$TMP/$1")
  [ "$expected" = "$actual" ] || die "checksum mismatch for $1 (expected $expected, got $actual)"
  info "sha256 verified for $1"
}

checksum_note() {
  if asset_exists SHA256SUMS; then
    echo "checksums: SHA256SUMS present, will verify"
  else
    echo "checksums: no SHA256SUMS in $TAG, verification skipped"
  fi
}

ask_yes_no() {
  # $1 is the question. Needs a terminal; without one the answer is no.
  if { : </dev/tty; } 2>/dev/null; then
    printf '%s [y/N] ' "$1" >/dev/tty
    reply=""
    read -r reply </dev/tty || reply=""
    case "$reply" in
      y | Y | yes | YES) return 0 ;;
    esac
  fi
  return 1
}

is_apple_silicon() {
  [ "$(uname -m)" = "arm64" ] && return 0
  # Under Rosetta, uname reports x86_64. The hardware flag still shows Apple silicon.
  [ "$(sysctl -n hw.optional.arm64 2>/dev/null || echo 0)" = "1" ]
}

install_macos() {
  if is_apple_silicon; then
    ZIP_NAME="Bouncer-$VER-arm64-mac.zip"
  else
    ZIP_NAME="Bouncer-$VER-mac.zip"
  fi
  asset_exists "$ZIP_NAME" || die "$TAG has no macOS build named $ZIP_NAME. Available: $(asset_list)"

  DEST_DIR="/Applications"
  if [ "$USER_INSTALL" -eq 1 ] || [ ! -w /Applications ]; then
    DEST_DIR="$HOME/Applications"
  fi
  TARGET="$DEST_DIR/Bouncer.app"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "would download: $ZIP_NAME"
    checksum_note
    echo "would unzip and install: $TARGET (replacing any existing copy)"
    echo "would remove quarantine: xattr -dr com.apple.quarantine"
    return 0
  fi

  fetch_verified "$ZIP_NAME"
  mkdir -p "$TMP/mac"
  ditto -x -k "$TMP/$ZIP_NAME" "$TMP/mac" || die "could not unzip $ZIP_NAME"
  [ -d "$TMP/mac/Bouncer.app" ] || die "Bouncer.app not found inside $ZIP_NAME"

  mkdir -p "$DEST_DIR"
  if [ -e "$TARGET" ]; then
    if pgrep -x Bouncer >/dev/null 2>&1; then
      warn "Bouncer is running. Quit it first, or the old copy keeps running until you relaunch."
    fi
    info "replacing $TARGET"
    rm -rf "$TARGET"
  fi
  mv "$TMP/mac/Bouncer.app" "$TARGET"
  xattr -dr com.apple.quarantine "$TARGET" 2>/dev/null || true

  info "installed $TARGET"
  echo "launch with: open \"$TARGET\""
  echo "If macOS still blocks the first launch (unsigned build): right-click Bouncer, choose Open."
}

install_deb() {
  fetch_verified "$DEB_NAME"
  info "installing $DEB_NAME with sudo (you may be asked for your password)"
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get install -y "$TMP/$DEB_NAME" </dev/tty || die "apt-get could not install $DEB_NAME"
  else
    sudo dpkg -i "$TMP/$DEB_NAME" </dev/tty || die "dpkg could not install $DEB_NAME"
  fi
  info "installed $DEB_NAME. Launch Bouncer from your application menu, or run: bouncer"
}

install_appimage() {
  BIN_DIR="$HOME/.local/bin"
  APPS_DIR="$HOME/.local/share/applications"
  MIME_DIR="$HOME/.local/share/mime"
  BIN_PATH="$BIN_DIR/bouncer.AppImage"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "would download: $APPIMAGE_NAME"
    checksum_note
    echo "would install: $BIN_PATH (chmod +x)"
    echo "would write: $APPS_DIR/bouncer.desktop and $MIME_DIR/packages/bouncer.xml"
    return 0
  fi

  fetch_verified "$APPIMAGE_NAME"
  mkdir -p "$BIN_DIR" "$APPS_DIR" "$MIME_DIR/packages"
  mv "$TMP/$APPIMAGE_NAME" "$BIN_PATH"
  chmod +x "$BIN_PATH"

  cat >"$APPS_DIR/bouncer.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Bouncer
Comment=Run open models on your own machine
Exec="$BIN_PATH" %U
TryExec=$BIN_PATH
Terminal=false
Categories=Development;
MimeType=application/x-bouncer-config;application/x-bouncer-model;application/x-bouncer-project;
EOF

  cat >"$MIME_DIR/packages/bouncer.xml" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
  <mime-type type="application/x-bouncer-config">
    <comment>Bouncer configuration</comment>
    <glob pattern="*.bcn"/>
  </mime-type>
  <mime-type type="application/x-bouncer-model">
    <comment>Bouncer model</comment>
    <glob pattern="*.bml"/>
  </mime-type>
  <mime-type type="application/x-bouncer-project">
    <comment>Bouncer project</comment>
    <glob pattern="*.bproj"/>
  </mime-type>
</mime-info>
EOF

  if command -v update-mime-database >/dev/null 2>&1; then
    update-mime-database "$MIME_DIR" </dev/null || warn "update-mime-database failed"
  fi
  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$APPS_DIR" </dev/null || warn "update-desktop-database failed"
  fi

  info "installed $BIN_PATH"
  echo "launch with: $BIN_PATH   (or open Bouncer from your application menu)"
  case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *) echo "note: $BIN_DIR is not on your PATH" ;;
  esac
}

install_linux() {
  case "$(uname -m)" in
    x86_64 | amd64) ;;
    *) die "no Linux build for $(uname -m). Bouncer ships x86_64 Linux builds only." ;;
  esac
  DEB_NAME="bouncer_${VER}_amd64.deb"
  APPIMAGE_NAME="Bouncer-$VER.AppImage"

  has_deb=0
  if asset_exists "$DEB_NAME"; then has_deb=1; fi
  if [ "$has_deb" -eq 0 ] && ! asset_exists "$APPIMAGE_NAME"; then
    die "$TAG has no Linux build yet (wanted $APPIMAGE_NAME or $DEB_NAME). Available: $(asset_list)"
  fi

  use_deb=0
  if [ "$has_deb" -eq 1 ] && [ "$FORCE_APPIMAGE" -eq 0 ] && command -v dpkg >/dev/null 2>&1 && command -v sudo >/dev/null 2>&1; then
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "would ask whether to install $DEB_NAME with sudo; answering no installs the AppImage instead"
    elif ask_yes_no "Install $DEB_NAME system-wide with sudo? (no installs the AppImage for this user)"; then
      use_deb=1
    fi
  fi

  if [ "$use_deb" -eq 1 ]; then
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "would download: $DEB_NAME"
      checksum_note
      echo "would install with: sudo apt-get install ./$DEB_NAME"
      return 0
    fi
    install_deb
  else
    if [ "$has_deb" -eq 0 ] && [ "$DRY_RUN" -eq 0 ]; then
      warn "$TAG has no .deb, so the AppImage is installed"
    fi
    install_appimage
  fi
}

main() {
  parse_args "$@"

  case "$(uname -s)" in
    Darwin) OS="macos" ;;
    Linux) OS="linux" ;;
    *) die "unsupported OS: $(uname -s). On Windows, use scripts/install.ps1." ;;
  esac

  TMP=$(mktemp -d "${TMPDIR:-/tmp}/bouncer-install.XXXXXX")
  trap cleanup EXIT INT TERM

  setup_auth
  info "repository: $REPO (auth: $AUTH)"
  resolve_release
  info "release: $TAG"

  if [ "$OS" = "macos" ]; then
    install_macos
  else
    install_linux
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "dry run: nothing was downloaded or installed"
  fi
}

main "$@"
