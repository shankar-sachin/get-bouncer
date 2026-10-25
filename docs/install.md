# Install Bouncer

Bouncer installs in one command on macOS, Linux and Windows, or from an installer you download yourself. The installers fetch the newest release, prereleases included, and check it against the release's `SHA256SUMS` file.

## One-line install

**macOS and Linux** (in Terminal):

```sh
curl -fsSL https://getbouncer.pages.dev/install.sh | sh
```

**Windows** (PowerShell 5.1 or 7):

```powershell
irm https://getbouncer.pages.dev/install.ps1 | iex
```

When the script finishes, open Bouncer from your Applications folder, your application menu or the Start menu.

## Installer options

### macOS and Linux: `install.sh`

Pass options after `-s --` when you pipe the script to `sh`:

```sh
curl -fsSL https://getbouncer.pages.dev/install.sh | sh -s -- --dry-run
```

| Option | What it does |
| --- | --- |
| `--version <tag>` | Install a specific release, for example `--version v0.4.4`. The default is the newest release. `BOUNCER_VERSION` does the same. |
| `--dry-run` | Find the release and print what would happen. Nothing is downloaded or installed. |
| `--user` | On macOS, install into `~/Applications` even when `/Applications` is writable. |
| `--appimage` | On Linux, use the AppImage even where a `.deb` is available. |
| `-h`, `--help` | Show the help text. |

What the script does on each system:

- **macOS:** downloads the `.zip` for your Mac's processor (Apple silicon or Intel), verifies it, and installs `Bouncer.app` into `/Applications`. If `/Applications` is not writable, it installs into `~/Applications`. It then removes the quarantine flag that macOS adds to downloads, and links `~/.local/bin/bouncer` to the app so the [`bouncer` command](cli.md) works in a terminal.
- **Debian and Ubuntu:** offers to install the `.deb` system-wide with `sudo`. Answer `y` to install it, or press Enter to install the AppImage for your user instead. Without a terminal to ask in, the script installs the AppImage.
- **Other Linux systems:** installs the AppImage to `~/.local/bin/bouncer.AppImage`, and adds a desktop entry and file type associations for `.bcn`, `.bml` and `.bproj` files. If `~/.local/bin` is not on your `PATH`, the script says so.

### Windows: `install.ps1`

Run these in PowerShell. To see what the script would do without changing anything, run it with `-DryRun`:

```powershell
& ([scriptblock]::Create((irm https://getbouncer.pages.dev/install.ps1))) -DryRun
```

| Option | What it does |
| --- | --- |
| `-Version <tag>` | Install a specific release, for example `-Version v0.4.4`. The default is the newest release. `BOUNCER_VERSION` does the same. |
| `-DryRun` | Find the release and print what would happen. Nothing is downloaded or run. |
| `-Silent` | Run the installer with no wizard. Without it, the normal installer wizard opens. |

For example, to install a specific version without the wizard:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 -Version v0.4.4 -Silent
```

## Download an installer yourself

Every release is at [Releases](https://github.com/shankar-sachin/get-bouncer/releases). Pick the file for your system. Names include the version, shown here as `<version>`, for example `0.4.4`.

| System | File | Notes |
| --- | --- | --- |
| macOS, Apple silicon | `Bouncer-<version>-arm64.dmg` | Or `Bouncer-<version>-arm64-mac.zip` |
| macOS, Intel | `Bouncer-<version>.dmg` | Or `Bouncer-<version>-mac.zip` |
| Windows, 64-bit | `Bouncer-Setup-<version>.exe` | Runs the installer wizard |
| Linux, 64-bit, any distribution | `Bouncer-<version>.AppImage` | Make it executable first (see below) |
| Linux, Debian and Ubuntu | `bouncer_<version>_amd64.deb` | Install with `sudo apt install ./bouncer_<version>_amd64.deb` |

There are no ARM64 Linux builds and no native ARM64 Windows build. See [System requirements](system-requirements.md).

## Verify the download

Each release includes a `SHA256SUMS` file. To check your download against it:

- **macOS:** `shasum -a 256 -c SHA256SUMS --ignore-missing`
- **Linux:** `sha256sum -c SHA256SUMS --ignore-missing`
- **Windows (PowerShell):** `Get-FileHash .\Bouncer-Setup-<version>.exe -Algorithm SHA256`, then compare the hash with the matching line in `SHA256SUMS`.

Run the check in the folder where you saved both files. If a file's hash does not match, delete it and download it again.

If a release has no `SHA256SUMS` file, the installers print a warning and skip the check.

## Unsigned builds

Bouncer builds are not signed or notarized yet, so your operating system may stop the first launch. This is expected for now. Only install builds from the releases page linked here.

### macOS

The one-line installer removes the quarantine flag, so Bouncer opens normally. If you installed from the `.dmg` yourself, the first launch may be blocked. Then:

1. Open **System Settings → Privacy & Security**.
2. Scroll to the **Security** section and click **Open Anyway** next to Bouncer.
3. Confirm with your password if asked.

On older macOS versions, you can right-click Bouncer in Applications and choose **Open** instead.

You can also remove the quarantine flag in Terminal:

```sh
xattr -dr com.apple.quarantine /Applications/Bouncer.app
```

### Windows

Windows SmartScreen may show *Windows protected your PC* on the first run. Click **More info**, then **Run anyway**. The one-line installer runs the same installer and unblocks the file first. SmartScreen may still warn you.

### Linux

- **AppImage:** make the file executable, then run it:

  ```sh
  chmod +x Bouncer-<version>.AppImage
  ./Bouncer-<version>.AppImage
  ```

  Some newer distributions need the FUSE 2 library to run AppImages. If the AppImage does not start, install `libfuse2` with your package manager.

- **`.deb`:** install it with `sudo apt install ./bouncer_<version>_amd64.deb`. Apt resolves the dependencies for you.

## Uninstall

Uninstalling removes the app, not your models and chats. To delete those too, remove the data folder listed in the [FAQ](faq.md#where-is-my-data-stored).

- **macOS:** quit Bouncer, then move `Bouncer.app` from Applications (or `~/Applications`) to the Trash. Delete the `~/.local/bin/bouncer` link too.
- **Windows:** open **Settings → Apps → Installed apps**, choose Bouncer, and select **Uninstall**. This also takes the `bouncer` command off your `PATH`.
- **Debian and Ubuntu:** `sudo apt remove bouncer`.
- **AppImage:** delete `~/.local/bin/bouncer.AppImage`, `~/.local/share/applications/bouncer.desktop` and `~/.local/share/mime/packages/bouncer.xml`. Then run `update-desktop-database ~/.local/share/applications` and `update-mime-database ~/.local/share/mime` if you have them.

## Related

- [Getting started](getting-started.md)
- [System requirements](system-requirements.md)
- [Updates](updates.md)
- [Troubleshooting](troubleshooting.md)
