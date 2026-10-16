# Frequently asked questions

Short answers to the questions people ask most. For setup steps, see [Getting started](getting-started.md).

## Is Bouncer free?

Bouncer is a prerelease, so pricing has not been announced. This page will say so here when it is.

## Is Bouncer open source?

No. Bouncer is closed source. The public repository [get-bouncer](https://github.com/shankar-sachin/get-bouncer) hosts the installers, the install scripts and these docs. It does not contain the app's source code.

## Does anything leave my machine?

Your prompts, chats, files, and the model's replies stay on your computer. Bouncer contacts the internet only for the following:

| What | When | What is sent |
| --- | --- | --- |
| **Hugging Face: browsing models** | The Marketplace syncs its offline catalog once a day while you are online, and the first time it runs. Searches and model pages also query Hugging Face. | Search and page requests. If you added a Hugging Face token, it is sent with these requests. |
| **Hugging Face: downloads** | When you click **Download** on a model file. | The request for that file, with your token if you added one. |
| **llama.cpp releases on GitHub** | When you install or update the engine. | A request for the llama.cpp release list, then the download of the build for your backend. |
| **Bouncer updates on GitHub** | About 30 seconds after launch, then every 6 hours while Bouncer runs. | A request for the latest release, then the download of an update if you apply one. |
| **Web search (optional)** | Only when you turn on **Web search** for a chat. It is off by default. | Your search query goes to DuckDuckGo's HTML search. The model can also open web pages that appear in the results. |

Bouncer has no analytics or telemetry code. It does not report usage, crashes or your activity to the developer.

To stop all of this, disconnect from the internet. Everything else keeps working, as long as the engine and a model are already installed. You can also turn off updates with `BOUNCER_UPDATES=0` (see [Updates](updates.md#turn-updates-off)).

## Does it work offline?

Yes, once the engine and at least one model are installed. Chats, the loaded model and the tools that do not use the web keep working without a connection. The status bar says **offline-ready** when Bouncer is in this state.

These need a connection: downloading models, installing or updating the engine, browsing the live Hugging Face catalog, checking for updates and web search. The Marketplace keeps the last catalog it synced, so you can still browse it offline.

## Which models can I run?

Any GGUF model that llama.cpp can run. GGUF is the file format llama.cpp uses. The Marketplace lists GGUF builds from Hugging Face, and it shows which quantized files will run on your machine. Models that llama.cpp does not support will not load. See [Models](models.md).

## Where is my data stored?

Bouncer keeps its data in one folder per user:

| System | Folder |
| --- | --- |
| macOS | `~/Library/Application Support/Bouncer` |
| Windows | `%APPDATA%\Bouncer` |
| Linux | `~/.config/Bouncer` |

Inside it, Bouncer keeps your settings, your chats, the downloaded models with their library list, the llama.cpp engines, and the offline copy of the Marketplace catalog. A Hugging Face token is encrypted with your operating system's keychain. If the keychain is unavailable, the token is kept in memory only, and you will need to add it again after a restart.

To remove your data as well as the app, delete this folder after you uninstall. See [Install](install.md#uninstall).

## Can I use Bouncer with my own files?

Yes. Attach files and folders in Bouncer Chat, or open a folder in Bouncer Code and the IDE. Bouncer reads and edits those files on your computer. Bouncer Code shows each change as a diff, so you can review it. See [Bouncer Code](code.md) and [Bouncer IDE](ide.md).

## Where do I report a problem?

Start with [Troubleshooting](troubleshooting.md). Include your system, Bouncer version (shown in **Settings → About**), and the relevant engine logs. Remove any private text from the logs before you share them.

## Related

- [Getting started](getting-started.md)
- [Install](install.md)
- [Privacy](privacy.md)
- [Troubleshooting](troubleshooting.md)
