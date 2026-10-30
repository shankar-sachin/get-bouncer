# Account

An account is optional. Bouncer works fully signed out and offline: chats, models, Bouncer Code and everything else on your computer need no account.

## Sign in

Click the profile button in the title bar and choose a way to sign in:

- **GitHub**
- **Google**
- **An emailed code**: enter your email address, then type the code Bouncer sends you.
- **A passkey**: Touch ID, Windows Hello, your phone or a security key. Add one on the [account page](#on-the-web) first.

GitHub, Google and passkeys open your browser to confirm, then return to Bouncer. Your sign-in is kept in your system keychain.

## Profile

Open **Settings › Account** to add a profile photo and a display name.

## Devices

**Settings › Account › devices** lists every computer signed in to your account: its name, system, Bouncer version and when it was last seen. Choose **Sign out** next to another device to end its session there. Each Bouncer data folder counts as one device.

## On the web

The account page at [bouncer-ai.pages.dev/account](https://bouncer-ai.pages.dev/account) lets you:

- **Add or remove passkeys.** Sign in there with GitHub, Google or email, then choose **Add a passkey**. After that, choose **Continue with a passkey** in Bouncer.
- **See and sign out devices**, or sign out everywhere.
- **See whether sync is on**, how many items it holds and when they last changed. It can't show what they are: they're encrypted with a key only your computers hold. **Start sync over** deletes them from the server.
- **Delete your account.** Type `delete` to confirm. This removes the account, its passkeys, devices and everything synced. Chats, models and settings on your computers stay.

Open it from Bouncer with **Settings › Account › Open account page**.

## Sync

Sync keeps your settings, presets and the chats you choose the same on every computer you sign in on. It's off until you turn it on. See [Sync](sync.md).

## Sign out

Choose **Sign out** to sign out on this device, or **Sign out on all devices** to end every session at once. Signing out never deletes your local chats or models.

## In the terminal

```sh
bouncer login            # GitHub in your browser (or: google, passkey, email)
bouncer whoami           # the signed-in account
bouncer logout           # this computer; add --everywhere for all devices
```

The desktop app and the `bouncer` command share one sign-in. See [Bouncer in the terminal](cli.md#account).

## Website

The Bouncer website is now at https://bouncer-ai.pages.dev.
