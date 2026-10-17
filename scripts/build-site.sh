#!/bin/sh
# Builds the website for Cloudflare Pages into dist/: the site itself, the user docs the docs page
# reads (docs/*.md and docs/images), and the two installers at the root of the site, so
# https://getbouncer.pages.dev/install.sh and /install.ps1 keep working.
#
# Cloudflare Pages settings: build command `sh scripts/build-site.sh`, build output directory `dist`.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist
cp -R site/. dist/
cp -R docs dist/docs
cp scripts/install.sh scripts/install.ps1 dist/
echo "site built in dist/"
