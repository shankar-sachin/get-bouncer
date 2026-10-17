<p align="center">
  <img src="assets/brand/orb.png" width="160" alt="Bouncer orb logo" />
</p>

# Bouncer

Bouncer is a local-first AI app for macOS, Windows and Linux. It runs open models on your own computer for chat, for coding in your folders, and for your own bots in Rebound. Models come from Hugging Face and run with llama.cpp.

<p align="center">
  <img src="assets/screens/hero-obsidian.jpg" width="800" alt="Bouncer Chat with a reply from a local model" />
</p>

This repository hosts the installers, the install scripts, the documentation and the website at https://getbouncer.pages.dev. Bouncer itself is closed source.

## Get started

**macOS and Linux**

```sh
curl -fsSL https://getbouncer.pages.dev/install.sh | sh
```

**Windows** (PowerShell 5.1 or 7)

```powershell
irm https://getbouncer.pages.dev/install.ps1 | iex
```

The installers pick the newest release (all current releases are prereleases) and verify its `SHA256SUMS`. Add `--dry-run` (`| sh -s -- --dry-run`) or `-DryRun` to see what would happen first, or choose a version with `--version v0.3.0` / `-Version v0.3.0`.

To download an installer yourself, see the [releases page](https://github.com/shankar-sachin/get-bouncer/releases). Once installed, Bouncer updates itself.

## What is in the app

- **Bouncer Chat**: talk with a model you have loaded, with effort levels, presets and slash commands.
- **Bouncer Code**: describe a change in a folder. The model reads, edits and runs commands, and each edit waits for your approval, depending on the mode you choose.
- **Bouncer IDE**: a file tree, editor tabs, a terminal, search and git in one window.
- **Rebound**: make your own bots, each with a name, a personality, a face and its own chats.
- **Marketplace**: find GGUF models from Hugging Face, with an estimate of whether each one fits your machine.

## Unsigned builds

Builds are not signed or notarized yet.

- **macOS:** the installer removes the quarantine flag. If you downloaded the `.dmg` yourself and macOS blocks it, right-click Bouncer and choose Open, or run `xattr -dr com.apple.quarantine /Applications/Bouncer.app`.
- **Windows:** SmartScreen may warn on first run. Choose More info, then Run anyway.
- **Linux:** a `.deb` for Debian and Ubuntu, or an AppImage for everything else.

## Documentation

- [Documentation site](https://getbouncer.pages.dev/docs)
- [Documentation source in docs/](docs/README.md)
- [Wiki](https://github.com/shankar-sachin/get-bouncer/wiki), synced from `docs/`

## Plugins

Plugins are coming. The [plugins/](plugins/README.md) folder will hold official plugins and the plugin authoring guide. See [docs/plugins.md](docs/plugins.md) for the current status.

## Reporting bugs

Open an issue at [github.com/shankar-sachin/get-bouncer/issues](https://github.com/shankar-sachin/get-bouncer/issues/new/choose) and pick a template. Include your Bouncer version (**Settings → About**), your system, and the engine log lines around the error. Remove any private text from logs first. For security problems, see [SECURITY.md](SECURITY.md) and do not open a public issue.

## Data and privacy

Bouncer is local-first. Your chats, models, and files stay on your computer, and a chat with a local model is processed by the model on your machine. Bouncer connects to the internet only for these tasks:

- **Hugging Face:** model listings, files and model cards for the Marketplace, and the model files you choose to download. Your Hugging Face token is sent only to Hugging Face.
- **GitHub:** llama.cpp releases when you install or update the engine, and a check for the latest Bouncer release.
- **DuckDuckGo:** web search, only when you turn it on for a chat. It is off by default.

Bouncer has no analytics or telemetry. See the [privacy policy](PRIVACY.md) and [docs/privacy.md](docs/privacy.md) for the full list.

## License

Bouncer is free to download and use, and its source code is private. See the [license](LICENSE.md) for the terms.

---

© Sachin Shankar. All rights reserved.
