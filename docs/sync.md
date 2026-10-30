# Sync

Sync keeps your settings, presets and chosen chats the same on every computer signed in to your [account](account.md). It's optional and off until you turn it on. Everything is encrypted on your computer before it leaves, so Bouncer's server stores only data it can't read.

## What syncs

| Kind | What goes along | What stays on each computer |
| --- | --- | --- |
| **Settings** | Theme, accent, contrast, editor preferences, agent mode, model loading and autocomplete preferences. | API keys, your Hugging Face token, folders, GPUs, which models are installed and loaded. |
| **Presets** | Your own presets and the built-in ones you edited, and deletions. | |
| **Chats** | Only chats you turn sync on for, with every branch and their Relics. | Attached files, Bouncer Code sessions and checkpoints. |

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
