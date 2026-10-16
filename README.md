<p align="center"><img src="logo.svg" width="72" alt="Bouncer logo" /></p>

# Bouncer

Website: https://shankar-sachin.github.io/get-bouncer/

Bouncer is a local-first AI app for macOS, Windows and Linux: chat with models that run on your own machine, a coding agent with an IDE, and Rebound, where you make your own bots. Everything runs locally with llama.cpp; models come from Hugging Face.

This repository only hosts the installers. Bouncer itself is closed source.

## Install

**macOS and Linux**

```sh
curl -fsSL https://raw.githubusercontent.com/shankar-sachin/get-bouncer/main/install.sh | sh
```

**Windows** (PowerShell 5.1 or 7)

```powershell
irm https://raw.githubusercontent.com/shankar-sachin/get-bouncer/main/install.ps1 | iex
```

The installers pick the newest release (all current releases are prereleases) and verify its `SHA256SUMS`. Add `--dry-run` (`| sh -s -- --dry-run`) or `-DryRun` to see what would happen first, or choose a version with `--version v0.4.4` / `-Version v0.4.4`. You can also download an installer directly from [Releases](https://github.com/shankar-sachin/get-bouncer/releases).

Once installed, Bouncer updates itself.

## Unsigned builds

Builds are not signed or notarized yet.

- **macOS:** the installer removes the quarantine flag. If you downloaded the `.dmg` yourself and macOS blocks it, right-click Bouncer and choose Open.
- **Windows:** SmartScreen may warn on first run. Choose More info, then Run anyway.
- **Linux:** a `.deb` for Debian and Ubuntu, or an AppImage for everything else.

## Documentation

- [Documentation index](docs/README.md)
- Getting started (placeholder)
- Models and the marketplace (placeholder)
- Bouncer Code and scheduled tasks (placeholder)
- Rebound bots (placeholder)

---

© Sachin Shankar. All rights reserved.
