# The bcr index

Packages for `bcr`, Bouncer's package manager for models (see [docs/bcr.md](../../docs/bcr.md)). The site serves this folder at https://bouncer-ai.pages.dev/bcr/.

- `index.json` lists every package: its name, description, newest version, all versions and tags.
- `packages/<owner>/<name>/<version>.json` is one version's manifest. A published version never changes; a change is a new version.

To add a package or a version, add its manifest, then add it to `index.json` (put the version in `versions` and set `latest`).
