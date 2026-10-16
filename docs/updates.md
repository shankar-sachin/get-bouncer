# Updates

Bouncer looks for new releases on its own and tells you when one is ready. How the update is applied depends on how you installed it. This page explains each case, where to see the status, and how to check by hand.

## How updates work on each system

| Installed as | What Bouncer does | What you do |
| --- | --- | --- |
| Windows (installer) | Downloads the update in the background. | Restart when the status says it is ready, or quit Bouncer and it installs on quit. |
| Linux AppImage | Downloads the update in the background. | Same as Windows. |
| macOS (`Bouncer.app`) | Downloads the update for your processor, checks its SHA-256 checksum, and unpacks it. | Restart to swap in the new version. |
| Linux `.deb` (Debian and Ubuntu) | Checks for a newer release and links to its release page. | Download the new `.deb` (or run the installer again). |

### Windows and AppImage

Bouncer downloads the new version in the background. Its status moves from *checking* to *downloading*, then to *ready to install*. Choose **Restart to update** in **Settings → About**, or click the **Update ready · restart** pill in the status bar. If you quit without restarting, Bouncer installs the update when it quits.

### macOS

Bouncer finds the newest release, downloads the zip for your Mac's processor (Apple silicon or Intel), and checks it against the release's `SHA256SUMS` file. A download that does not match its checksum is discarded, and Bouncer tries again at the next check. When the update is ready, choose **Restart to update**, or click the **Update ready · restart** pill. Bouncer quits, replaces `Bouncer.app` with the new version, clears the quarantine flag, and opens the app again.

Bouncer updates the app where it is installed. The folder that holds `Bouncer.app` must be writable by your user. If it is not, the status says *can't update* and suggests reinstalling with the installer. The [install page](install.md) shows the commands.

### Linux `.deb`

A `.deb` install is managed by apt, and Bouncer cannot replace it. When a newer release exists, the status bar shows an **Update available** pill. Clicking it, or **Open download page** in **Settings → About**, opens the release page. Download the new `.deb` and install it, or run the installer again.

## Where to see update status

**Settings → About** shows the current version and an update line in plain words:

| Status line | Meaning |
| --- | --- |
| not checked yet | Bouncer has not checked since launch. |
| checking for updates… | A check is running. |
| version X is available | A newer release was found. |
| downloading X · 40% | The update is downloading. |
| version X is ready to install | Choose **Restart to update** to apply it. |
| up to date · checked 10:42 | No newer release was found at that time. |
| couldn't update: … | The last check or download failed. The message says why. |
| updates are off: … | Updates are turned off, or this is a development build. |

The buttons next to the status depend on the state:

- **Check for updates** runs a check now. It is greyed out when updates are off.
- **Restart to update** applies a ready update on Windows, AppImage and macOS.
- **Open download page** opens the release page for a `.deb` install.

**The status bar** shows a pill at the bottom of the window when there is something to do:

- **Update available** (Linux `.deb`): click to open the release page.
- **Update ready · restart**: click to apply the update.

## When Bouncer checks

- Once, about 30 seconds after launch.
- Every 6 hours while Bouncer is running.
- Each time you choose **Check for updates**.

Prereleases count as releases. Every release so far is a prerelease, so Bouncer follows them. Bouncer compares version numbers using semantic versioning, so `0.4.4` is newer than `0.4.3`.

Checks are skipped while a download is already running or an update is already ready.

## Turn updates off

Set the environment variable `BOUNCER_UPDATES=0` before you start Bouncer. Settings → About then shows *updates are off*. Development builds do not check for updates.

## Related

- [Install](install.md)
- [Troubleshooting](troubleshooting.md#updates-are-stuck)
- [System requirements](system-requirements.md)
- [Getting started](getting-started.md)
