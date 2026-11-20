# Teams

A team shares presets, model lists and packages between people. Each member sees what the team shares in **Settings › Teams** and can copy any of it into their own Bouncer. Teams need an [account](account.md) and [sync](sync.md), and they're optional.

What a team shares is end-to-end encrypted with a team key that only members' computers hold. Bouncer's server stores the members and the encrypted items, never what's in them.

## Make a team

1. Open the account page at [bouncer-ai.pages.dev/account](https://bouncer-ai.pages.dev/account#teams), or choose **Create or invite** in **Settings › Teams**.
2. Under **Teams**, type a name and choose **Create team**.
3. Open Bouncer with sync on. Your computer makes the team key; you don't have to do anything.

You own the team. You can own up to 20 teams, each with up to 50 members.

## Invite people

1. On the account page, under your team, type the person's email and choose **Invite**.
2. Send them the link it shows: **Copy link**, or **Email it** to open your mail app. The link is shown once.

The link works for 7 days, and only for an account with that email. Open invites show under the team; **Cancel** one to stop it working.

## Join a team

1. Open the invite link and sign in with the account the invite was sent to.
2. Choose **Join**.
3. Open Bouncer with sync on, and go to **Settings › Teams**.

The team key reaches you the next time another member's Bouncer is open, usually within a minute. Until then the team shows **Waiting for the team key**.

## Share something

In **Settings › Teams**, choose **Share** on a team, then pick what to share:

| Kind | What goes along |
| --- | --- |
| **Preset** | Its name, system prompt and sampling. |
| **Model list** | A name, an optional description, and the downloaded models you tick, each with its build (the repo and the quant, or MLX). Models imported from a file can't be listed. |
| **Package** | An installed [package](bcr.md), with the model build and settings it holds. |

Everyone in the team sees it, with your name. You can **Remove** what you shared; the owner can remove anything. Copies members already made stay with them.

## Copy into your library

Each shared item has a button:

- **Add to presets** adds the preset to your preset list.
- **Download models** queues each model in the list in **Downloads**. Models you already have are skipped.
- **Install** installs the package, as **Models › Packages** would.

A copy is yours: it doesn't change when the team's item changes, and it stays if you leave the team.

## Members

Choose **Members** under a team to see who's in it and whether each person's Bouncer has the team key:

- **Has the team key**: they see what the team shares.
- **Waiting for the team key**: their Bouncer asked for it. It arrives the next time another member's Bouncer is open.
- **Hasn't opened Bouncer with sync on yet**: they joined on the web but haven't opened the app with sync on.

Each member also shows a six-digit **key code**. It comes from their public key. If you want to be sure the server didn't swap a key, compare the code with what they see on their own computer.

## Remove someone or leave

- **The owner removes a member** with **Remove**, in the app or on the account page.
- **A member leaves** with **Leave team**.
- **The owner deletes the team** on the account page, with **Delete team**. That removes its members, invites and everything it shares.

When someone leaves or is removed, the team key changes. The owner's Bouncer makes the new key and seals every shared item again with it, the next time it's open. Until then members can still read what's shared but can't share anything new. Copies the removed person made stay with them.

## How the team key works

- Each account has a key pair made from its [sync key](sync.md), so every computer that syncs holds it. Only the public half goes to the server.
- The team key is a random key. It's sealed separately to each member's public key, so only that member's computers can open it.
- Shared items are sealed with the team key on the computer that shares them.
- If you [start sync over](sync.md), your account gets a new key pair, and another member's Bouncer seals the team key to it again.

## Related

- [Account](account.md)
- [Sync](sync.md)
- [Packages (bcr)](bcr.md)
