# Slash commands

Slash commands let you change settings and run actions from the keyboard. Type <kbd>/</kbd> at the start of the composer in Chat, Code, or IDE to open the command menu.

## Using the menu

- Type <kbd>/</kbd> to see every command for the current surface. Keep typing to narrow the list, for example `/eff` finds `/effort`.
- Use <kbd>↑</kbd> and <kbd>↓</kbd> to move through the list.
- Press <kbd>Tab</kbd> to fill in the highlighted command, so you can add its argument.
- Press <kbd>Enter</kbd> to fill in the highlighted command. Press <kbd>Enter</kbd> again to run it.
- Press <kbd>Esc</kbd> to close the menu.

Once you have typed a space after a command, the menu suggests values for its argument. For example, `/effort h` suggests `high` and `xhigh`.

A command only works at the start of the composer line. If you type a name that is not a command, such as `/foo`, Bouncer shows an error. Press <kbd>Enter</kbd> again to send that text as an ordinary message.

To put a space in an argument, wrap it in double quotes, for example `/system "You are a patient tutor"`.

## Commands

The **Surfaces** column shows where each command works. Chat, Code, and IDE are the three surfaces that accept slash commands.

| Command | Arguments | What it does | Surfaces |
| --- | --- | --- | --- |
| `/new` (alias `/n`) | none | Starts a new conversation. | Chat, Code, IDE |
| `/clear` | none | Clears this conversation's messages from view and starts fresh. | Chat, Code, IDE |
| `/model` | `<model>` | Switches the loaded model. The menu lists the models you have installed. | Chat, Code, IDE |
| `/effort` | `<level>`: `low`, `medium`, `high`, `xhigh`, or `max` | Sets how hard the model thinks for this chat. | Chat |
| `/preset` | `<name>` | Switches the preset for this chat. | Chat |
| `/search` (alias `/find`) | `<query>` | Searches your conversations for the text. | Chat |
| `/tools` | `<tool>`: `web` or `thinking` | Toggles web search or thinking for this chat. | Chat |
| `/system` | `<text>` | Sets this conversation's system prompt. Use quotes for more than one word. | Chat |
| `/export` | none | Exports this conversation as Markdown. | Chat, Code, IDE |
| `/mode` | `<mode>`: `plan`, `manual`, `accept-edits`, or `autopilot` | Sets the mode. | Code, IDE |
| `/compact` | none | Summarizes older turns to free up context. | Code, IDE |
| `/init` | none | Writes a `BOUNCER.md` file for the open folder. | Code, IDE |
| `/help` (alias `/?`) | none | Lists the commands. | Chat, Code, IDE |

### Modes

`/mode` takes the same four modes as the mode chip and <kbd>Shift</kbd> <kbd>Tab</kbd>:

- **plan** is read-only. It replies with a plan.
- **manual** asks before every edit and command.
- **accept edits** applies edits, and asks before running commands.
- **autopilot** runs everything in the open folder.

## Related

- [Chat](chat.md) for the settings these commands change
- [Code](code.md) for Bouncer Code and its modes
- [Keyboard shortcuts](keyboard-shortcuts.md)
- [IDE](ide.md)
