# Sync

Sync keeps your settings, presets, chosen chats and chosen Rebound bots the same on every computer signed in to your [account](account.md). It's optional and off until you turn it on. Everything is encrypted on your computer before it leaves, so Bouncer's server stores only data it can't read.

## What syncs

| Kind | What goes along | What stays on each computer |
| --- | --- | --- |
| **Settings** | Theme, accent, contrast, editor preferences, agent mode, model loading and autocomplete preferences. | Folders, GPUs, which models are installed and loaded. |
| **Presets** | Your own presets and the built-in ones you edited, and deletions. | |
| **Chats** | Only chats you turn sync on for, with every branch and their Relics. | Attached files, Bouncer Code sessions and checkpoints. |
| **Rebound bots** | Only bots you turn sync on for: the bot, its chats, its memories and its routines. See [Rebound bots](#rebound-bots). | Connected folders and calendars, the bot's place in the list, routine run history. |
| **API keys** | Only when [API key sync](#api-keys) is on for your account: the OpenAI, Anthropic and OpenRouter keys and your Hugging Face token, and their removal. | Your account's own sign-in. |

Turn each kind on or off per computer in **Settings › Account › sync**.

## Turn it on

1. Sign in, then open **Settings › Account**.
2. Under **sync**, choose **Turn on sync**.
3. Save the **recovery code** Bouncer shows, for example in a password manager. You can see it again later with **Show recovery code** on any computer that syncs.

## Sync a chat

In the chat list, hover a chat and choose the sync button (two arrows). A small sync mark shows next to the title. Choose it again to stop syncing that chat. The chat stays on your other computers; it just stops updating.

## Add another computer

Sign in on the new computer and open **Settings › Account**. Then either:

- **Ask another device.** The new computer shows six digits. On a computer that already syncs, open **Settings › Account**: it shows the request with six digits. If they match, choose **Approve**. If they don't, choose **Deny**.
- **Use your recovery code.** Type it in and choose **Use code**. Case, spaces and dashes don't matter.

## Rebound bots

A [Rebound](rebound.md) bot can follow you to your other computers, with its chats, its memories and its routines. It's off for every bot until you turn it on.

**What syncs**

- The bot: its name, tagline, personality, traits, avatar, greeting, model choice, creativity and memory switch.
- Its chats, with every branch.
- Its memories.
- Its routines: the title, the prompt, the schedule and whether it's on.

**What stays on each computer**

- Connected folders and calendars. Paths differ from one computer to the next, so a synced bot asks for its own folder and calendar on each one.
- The bot's place in the list.
- Routine run history: when a routine last ran, what it said, and its chat.

**Sync a bot**

1. Turn on sync, and make sure **Rebound bots** is on in **Settings › Account**. It's on by default.
2. Open the bot's menu, choose **Edit**, and turn on **sync this bot**.

A synced bot shows a sync mark on its card, and **syncs** in its room. If account sync or **Rebound bots** is off, the switch tells you which to turn on first.

- **Chats need their own category.** A synced bot's chats sync only while **Chats** is on in **Settings › Account**. **Rebound bots** doesn't cover them.
- **Turning a bot off** stops syncing it and its chats. Nothing is deleted: the bot and its chats stay on your other computers, they just stop updating.
- **Deleting a synced bot** deletes it everywhere, with its chats, its memories and its routines.

**A model this computer doesn't have**

A bot remembers the model you picked. If this computer doesn't have it, the bot says **Its model isn't on this device** and offers **Find it in the Marketplace**. A model you imported from a file on another computer can't be found there; import it here too. Until then, choose another model or **Whatever is loaded**.

**Older versions**

Computers on Bouncer v0.17 or older keep syncing settings, presets, chats and keys as before. They don't see synced bots, their memories or their routines until you update them.

## API keys

API key sync puts your cloud provider keys and Hugging Face token on every computer signed in to your account. It's off until you turn it on, for the whole account, on the [account page](https://bouncer-ai.pages.dev/account#api-keys) under **API keys**. Bouncer offers it once with a small card at the bottom left; **Turn on** opens that page and **Not now** closes the card.

- Keys move only between computers where sync is on, and they're encrypted like everything else that syncs: the account page and Bouncer's server never see them.
- Removing a key on one computer removes it on the others.
- Turning it off stops keys moving. Each computer keeps the keys it has.
- **Settings › Account › sync** shows whether it's on, with a link to the account page.

## Status

The status bar shows **synced**, **syncing** or **sync offline**. Changes made offline wait and go out when you're back online. Click it to open **Settings › Account**.

## Turn it off

**Turn off on this device** stops syncing on this computer and forgets its key. Your other computers keep syncing, and nothing is deleted.

If you lost every computer that synced and your recovery code, choose **Lost every device and the code? Start over** on a signed-in computer. This deletes the synced copies from the server and starts again with a new key. What's on each computer stays.

## How it's protected

- Each record is encrypted with AES-256-GCM using a key that's made on your computer and kept in your system keychain. The server only ever sees the encrypted bytes.
- A new computer gets the key straight from one of yours, sealed with a one-time key exchange (X25519). The six digits let you check nobody else is in the middle.
- The server keeps a fingerprint of the key, never the key, so a computer can tell whether its key is current.
- Without one of your computers or the recovery code, nobody can read the synced copies, Bouncer's author included.
