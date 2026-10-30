# Account

An account is optional. Bouncer works fully signed out and offline: chats, models, Bouncer Code and everything else on your computer need no account.

## Sign in

Click the profile button in the title bar and choose a way to sign in:

- **GitHub**
- **Google**
- **An emailed code**: enter your email address, then type the code Bouncer sends you.

GitHub and Google open your browser to confirm, then return to Bouncer. Your sign-in is kept in your system keychain.

## Profile

Open **Settings › Account** to add a profile photo and a display name.

## Devices

**Settings › Account › devices** lists every computer signed in to your account: its name, system, Bouncer version and when it was last seen. Choose **Sign out** next to another device to end its session there. Each Bouncer data folder counts as one device.

## Sync

Sync keeps your settings, presets and the chats you choose the same on every computer you sign in on. It's off until you turn it on. See [Sync](sync.md).

## Sign out

Choose **Sign out** to sign out on this device, or **Sign out on all devices** to end every session at once. Signing out never deletes your local chats or models.

## In the terminal

```sh
bouncer login            # GitHub in your browser (or: google, email)
bouncer whoami           # the signed-in account
bouncer logout           # this computer; add --everywhere for all devices
```

The desktop app and the `bouncer` command share one sign-in. See [Bouncer in the terminal](cli.md#account).

## Website

The Bouncer website is now at https://bouncer-ai.pages.dev.
