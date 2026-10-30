<div align="center">

<img src="site/assets/brand/orb-ball.png" alt="" width="72" />

# Bouncer privacy policy

</div>

---

**Short version:** Bouncer runs on your computer and keeps your data there. It has no analytics, no telemetry and no crash reporting. An account is optional; without one, nothing about you leaves your computer. The author of Bouncer receives nothing about you or how you use it.

## What stays on your machine

Your models, your chats in Bouncer Chat, your Rebound bots and their chats, the folders and files you open in Bouncer Code and the IDE, Bouncer Code's checkpoints, and your settings. A chat with a local model is answered by the model on your computer; your messages are not sent to a server for a reply.

## What connects to the internet, and when

Bouncer only goes online for these tasks, and only when you use the feature that needs them:

| Feature | Who it contacts | What is sent |
| --- | --- | --- |
| Marketplace browsing and catalog sync | Hugging Face | Requests for model listings, files and model cards |
| Downloading a model | Hugging Face | A request for the model file you chose |
| Gated models | Hugging Face | Your Hugging Face token, only if you saved one, and only to Hugging Face |
| Installing or updating the engine | GitHub | Requests for llama.cpp releases and the engine download |
| Checking for Bouncer updates | GitHub | A request for the latest release in this repository |
| Signing in (optional) | Bouncer's account server (Supabase) | Your email and name from GitHub, Google or the email you type; the names and versions of your signed-in computers; a profile photo if you add one |
| Sync (optional, off by default) | Bouncer's account server (Supabase) | Your settings, presets and chosen chats, encrypted on your computer so the server can't read them |
| Web search in Chat (off by default) | DuckDuckGo, and the pages it opens | Your search query, and requests for the pages Bouncer reads |

These services receive the request the same way they would from a browser, so their own privacy policies apply to what they log. Bouncer adds no identifiers of its own.

## Your Hugging Face token

If you save a Hugging Face token, it is stored encrypted in your operating system's keychain and sent only to Hugging Face. **Settings > Hugging Face > Sign out** removes it.

## Your account

Signing in is optional. Your sign-in is stored in your keychain. **Settings › Account › Sign out on all devices** ends every session. Synced data is encrypted with a key only your computers and your recovery code hold; **Start over** in Settings › Account deletes it from the server. To delete your account, use the [account page](https://bouncer-ai.pages.dev/account).

## Deleting your data

Uninstalling Bouncer and deleting its data folder removes everything it stored. The [FAQ](docs/faq.md#where-is-my-data-stored) lists where that folder is on each system.

## Changes

If this policy changes, the new version will be published in this repository and noted in the [changelog](CHANGELOG.md).

## Contact

Questions go to [GitHub issues](https://github.com/shankar-sachin/get-bouncer/issues). The full technical details are in [docs/privacy.md](docs/privacy.md).
