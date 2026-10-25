#!/bin/sh
# Builds the website for Cloudflare Pages into dist/: the site itself, the user docs the docs page
# reads (docs/*.md and docs/images), and the two installers at the root of the site, so
# https://bouncer-ai.pages.dev/install.sh and /install.ps1 work.
#
# Cloudflare Pages settings: build command `sh scripts/build-site.sh`, build output directory `dist`.
#
# With REDIRECT_TO set (a site's old address, getbouncer.pages.dev, sets it to https://bouncer-ai.pages.dev
# in its Pages environment variables), the build is only a redirect: every path goes to the same path
# there, so old links and `curl … | sh` / `irm … | iex` (both follow redirects) keep working.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist

if [ -n "${REDIRECT_TO:-}" ]; then
  target="${REDIRECT_TO%/}"
  case "$target" in
    https://*) ;;
    *) echo "REDIRECT_TO must be an https:// address, got: $target" >&2; exit 1 ;;
  esac
  printf '/* %s/:splat 301\n' "$target" > dist/_redirects
  echo "redirect site built in dist/ (everything goes to $target)"
  exit 0
fi

cp -R site/. dist/
cp -R docs dist/docs
cp scripts/install.sh scripts/install.ps1 dist/
echo "site built in dist/"
