# Privacy

Bouncer runs models on your own computer. Your chats, models, and files stay on your machine. Bouncer connects to the internet only for the specific tasks listed below, and only when you use the feature that needs them.

## What stays on your machine

These are stored locally and are never uploaded by Bouncer:

- **Models**: the model files you download or import, and your library.
- **Chats**: your plain conversations in Bouncer Chat, and the bots and their chats in Rebound.
- **Files**: the folders and files you open in Bouncer Code and the IDE.
- **Checkpoints**: snapshots Bouncer Code takes before each turn, so you can rewind its changes. They are stored in Bouncer's data folder, not in your project.
- **Settings**: your preferences, and presets.

A chat with a local model is processed by the model on your computer. Bouncer does not send your messages to a server to get a reply. The one exception is a cloud model you choose yourself (see below).

## What connects to the internet, and when

| Activity | What is sent | When it happens |
| --- | --- | --- |
| Browsing and searching the Marketplace | Requests to Hugging Face for model listings, files, and model cards. | When Bouncer syncs the catalog on launch, when you come back online, and about every hour while it runs. You can also press **Update the catalog now**. |
| Downloading a model | A request for the model file from Hugging Face. | Only when you click **Download**. |
| Signing in to Hugging Face | Your access token, sent only to Hugging Face. | Only when you open a gated model or raise rate limits with a saved token. Public models never need it. |
| Installing or updating the engine | A request to the GitHub API for llama.cpp releases, then the engine download. | On first launch, at each launch to look for a newer build (Developer mode can turn automatic updates off), and when you click **Check for updates** or **Update to** in **Settings > Engine**. |
| Voice downloads | Requests to GitHub and Hugging Face for the speech engine and models, or for the natural voices and their pronunciation dictionary. | The first time you use the mic with Advanced Voice Recognition, or pick a natural voice and click **download**. |
| AI-powered Voice Recognition (optional) | Your recordings, sent to an outside speech-to-text service with the sign-in token from your browser. | Only when you pick AI-powered Voice Recognition, sign in, and record. The other voice options keep your voice on your computer. |
| Checking for Bouncer updates | A request to github.com/shankar-sachin/get-bouncer for the latest release. | When Bouncer checks for updates. |
| Web search in chat | Your search query, sent to DuckDuckGo. When a page is opened, Bouncer fetches that page. | Only when you turn on **Web search** for a chat. It is off by default. |
| Signing in to a Bouncer account (optional) | Your email address and name from GitHub, Google or the email you type, sent to Bouncer's account server (Supabase). This computer's name, system and Bouncer version, for the device list. A profile photo, if you add one. Passkeys are kept as public keys only. | Only when you sign in, when Bouncer starts while signed in, and when you open **Settings › Account**. |
| Sync (optional, off by default) | Your settings, presets and the chats you choose, encrypted on your computer first. The server can't read them. | About every 30 seconds while sync is on, and soon after a change. See [Sync](sync.md). |
| Using a cloud model | Your messages, attachments and, in Bouncer Code, the files and command output the agent works with, sent to the provider whose model you picked (Anthropic, OpenAI or OpenRouter), with your API key. | Only after you turn the provider on in **Settings > Cloud providers**, save a key and pick one of its models. All providers are off by default. |

Hugging Face, GitHub, DuckDuckGo and the cloud providers receive these requests the same way they receive any request from a browser or downloader, so their own privacy policies apply to what they log.

## Your Hugging Face token

If you sign in to Hugging Face, Bouncer stores your access token encrypted in your operating system's keychain. It sends the token only to Hugging Face. The token is never written to a `.bcn`, `.bml`, or `.bproj` file, so you can share those files safely. To remove the token, open **Settings > Hugging Face** and click **Sign out**.

## Your cloud provider keys

API keys for cloud providers are kept the same way as the Hugging Face token: encrypted with your operating system's keychain, sent only to their own provider, and never written to Bouncer's files. **Remove key** in **Settings > Cloud providers** deletes one. See [cloud providers](providers.md).

## What Bouncer Code can access

Bouncer Code works only inside the folder you choose for a project. It does not read or change files outside that folder.

You control how much Bouncer Code can do with its mode:

- **plan** reads files and proposes changes. It makes no edits.
- **manual** asks before every edit and command.
- **accept edits** applies edits, but asks before it runs commands.
- **autopilot** runs everything in the project folder without asking.

Choose **manual** or **plan** for folders with sensitive files.

## Related

- [Models](models.md): downloading models and signing in to Hugging Face.
- [Settings](settings.md): the Hugging Face and Cloud providers sections, and About.
- [Cloud providers](providers.md): what is sent when you use a cloud model.
- [File formats](file-formats.md): what is and is not stored in Bouncer's files.
- [Updates](updates.md): how Bouncer gets new versions.
