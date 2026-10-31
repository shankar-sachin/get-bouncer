# Changelog

## Unreleased

- Voice recognition options: **System** (your computer's own, nothing to download), **Advanced** (downloads by itself the first time you use the mic, then runs on your computer) and **AI-powered** (online, with a sign-in and a clear warning). See [Rebound](docs/rebound.md#voice).
- Natural voices for reading replies aloud, on your computer: four English voices, with the download size and memory shown before anything downloads.
- Developer mode can turn off automatic engine updates (Settings › Engine).

## v0.12.0

Bouncer Lab and Skills. See [Lab](docs/lab.md) and [Skills](docs/skills.md).

- Lab, a new tab (⌘6 or Ctrl+6): send one prompt to two to six local or cloud models and compare the replies side by side, with speed, time to first token, memory and load time. Local models run one after another, so each is measured on its own.
- Blind rating: models show as model A, B, … until you rate every reply one to five stars, or click Reveal. The best-rated model is marked.
- Lab history on your computer, and export of a run to Markdown or CSV.
- Skills: reusable instructions in a `SKILL.md` that Chat, Rebound bots and Bouncer Code load when a task needs them. Make and edit them in Settings › Skills, or put them in a project's `.bouncer/skills`.
- Relics from Chat and Rebound: a model can make a doc, grid, deck or page, which opens in Studio.
- The composer's send button no longer wraps in narrow windows; Settings no longer jumps while scrolling; recording a hotkey works again.

## v0.11.0

Rebound extras. See [Rebound](docs/rebound.md).

- A global hotkey that brings up Rebound with your last bot, and a menu bar or tray icon with your bots. Both off by default, in Settings › Rebound.
- Bot memory: a bot remembers short facts about you across chats. Read, edit, add, delete or wipe them, or turn memory off.
- Routines: a bot runs a prompt daily, on an interval or on demand, and posts the reply in its own chat with a notification.
- Voice: replies read aloud with your computer's own voices, and a mic button that turns speech into text on your computer.
- Connectors, off by default and read-only: a folder a bot can read, and an `.ics` calendar file.
- Reply stats: click a reply's stats for a pop-up with input, output and total tokens, speed and timing.
- Copy buttons copy reliably again.

## v0.10.0

- Sync between your computers, optional and end-to-end encrypted: settings, presets and the chats you choose. Turn it on in Settings › Account and save the recovery code. See [Sync](docs/sync.md).
- Add a computer by approving it from one that already syncs (compare six digits), or with the recovery code.
- A sync switch for each chat in the chat list, and a quiet sync line in the status bar.
- Sign in with a passkey: Touch ID, Windows Hello, your phone or a security key.
- The account page at https://bouncer-ai.pages.dev/account: passkeys, devices, sync, and deleting your account. See [Account](docs/account.md).
- Settings › Account lists your signed-in devices and signs any of them out.
- `bouncer login`, `logout` and `whoami` in the terminal; `bouncer desktop` opens the app, and plain `bouncer` prints the help.

## v0.9.1

- Optional accounts: sign in with GitHub, Google or an emailed code from the title bar. Bouncer still works fully signed out and offline.
- Add a profile photo and display name in Settings › Account. Sign out on this device or on all devices. See [Account](docs/account.md).
- Docs links in the Rebound tab and in Settings › Docs.
- About now shows Bouncer's version, not Electron's.
- The website moved to bouncer-ai.pages.dev.

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
