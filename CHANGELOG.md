# Changelog

## v0.9.0

- The `bouncer` command: Bouncer in the terminal, shaped like the Ollama CLI and Claude Code.
- `bouncer pull`, `list`, `rm`, `show`, `ps`, `stop`, `serve` and `engine` for models and the engine.
- `bouncer run <model>` for a chat in the terminal, one reply with a prompt, or a pipe; `bouncer chat` continues the last one.
- `bouncer code` runs Bouncer Code in the current folder, with the four modes, approvals, rewind, `@` mentions, `/` commands and ultracode.
- The bouncing ball and the blob in every terminal screen.
- Installed with the app: on macOS, `install.sh` and **install command line tool…** in the app menu add `~/.local/bin/bouncer`; on Windows, the installer adds `bouncer.cmd` to the user PATH.
- Same models, engine, keys, chats and sessions as the desktop app. See [Terminal](docs/cli.md).
- Fixed: the Intel Mac and Windows builds of v0.8.0 could not start, because their file search tool was missing.

## Unreleased

- New orb logo across the app, the website and the installers.
- Replies stream with a bouncing ball that lands as the orb.
- Model replies use a serif reading face.
- Rebound starts with a starter bot named Rebound.
- Quieter design across the app.
- Installers and install commands are at getbouncer.pages.dev.

## v0.4.x

- Bouncer Code sessions in a folder, with four modes: plan, manual, accept edits and autopilot.
- Approve or deny each edit and command, and review every change as a diff.
- Rewind a session to an earlier point, restoring files, the conversation or both.
- Scheduled tasks: run a prompt in a folder later, and review what it changed.
- Rebound bots with a name, a personality, a face and their own chats.
- Open and save `.bcn`, `.bml` and `.bproj` files for settings, models and projects.
- One-line installers for macOS, Windows and Linux, and automatic updates.

## v0.3.0

- Bouncer IDE: a file tree, editor tabs, search, a terminal and source control in one window.
- The Marketplace works offline from its last catalog, which syncs once a day, with company filters in the sidebar.
- The chats sidebar can be collapsed.
- A model badge and rotating greetings on the Chat and Code start screens.

## v0.2.0

- Bouncer Chat: talk with a loaded model, with chat modes and tools.
- Code and IDE surfaces, themes and accents, and slash commands.
- Marketplace ranking and filters, company chips and shelves.

## v0.1.0

- Engine and model hub: download GGUF models from Hugging Face, load and unload them, and run them with llama.cpp.
- Fit estimate for each model, so you see whether it will run on your machine before you download it.
- First-run onboarding to choose a theme and a first model.
