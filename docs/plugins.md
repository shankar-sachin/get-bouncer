# Plugins

A **plugin** is a bundle of things Bouncer already has. One plugin can hold any of these:

- **Skills**: instructions a model reads when a task needs them. See [Skills](skills.md).
- **Slash commands**: `/name some text` sends a prompt with your text in it.
- **Presets**: a system prompt and sampling settings you pick in the composer.
- **Workflows**: [workflows](workflows.md) that are added to your library.
- **Recommended packages**: [bcr packages](bcr.md) the plugin suggests. They are never installed on their own.
- **MCP servers**: programs that give a model more tools. See [MCP servers](#mcp-servers).

**No plugin code runs inside Bouncer.** A plugin is one JSON file of text. The only thing in it that can run a program is an MCP server, and each one stays off until you read its command and turn it on.

## Install a plugin

### From the index

The **plugin index** is the list of official plugins, at https://bouncer-ai.pages.dev/plugins/. In the app:

1. Open **Settings › Plugins**.
2. Look under **From the plugin index**, or type in **search plugins**.
3. Click **what it holds** to see its skills, commands, presets and MCP server commands, then click **Install**.

In the terminal:

```sh
bouncer plugin search                      # every plugin in the index
bouncer plugin search review               # plugins whose name, description or tags match
bouncer plugin info bouncer/code-review    # what it holds, before you install it
bouncer plugin install bouncer/code-review
bouncer plugin install bouncer/code-review@1.0.0   # a version
```

### From a URL

Paste an https address into **Install from URL** in Settings › Plugins, or run `bouncer plugin install https://example.com/my.bplugin`. Bouncer fetches plugins only over https.

### From a `.bplugin` file

Click **Install from a file** in Settings › Plugins and choose the file. From the terminal, give the path: `bouncer plugin install ./my.bplugin`. A path starts with `./`, `/` or `~`, or ends in `.bplugin` or `.json`.

You can also double-click a `.bplugin` file, open it with **Open file** in the command palette, or drop it on Settings › Plugins. Bouncer shows what the plugin holds and asks before installing it.

### Import what you already have

Bouncer also turns two kinds of existing files into a plugin. The plugin is filed under the owner `local`, with version `1.0.0` unless a folder says otherwise, and it installs, turns off and removes like any other.

- **A file of MCP servers.** The `mcpServers` list that Claude Desktop, Claude Code (`.mcp.json`) and Cursor use, or VS Code's `servers`. Choose it with **Install from a file**, drop it on Settings › Plugins, or give its path to `bouncer plugin install`. The plugin is named after the file, or `local/mcp-servers` for `mcp.json`.
- **A Claude Code plugin folder.** Click **Import a folder** in Settings › Plugins, drop the folder there, or give its path to `bouncer plugin install`. Bouncer reads `skills/<name>/SKILL.md`, the Markdown files in `commands/`, `.mcp.json`, and `.claude-plugin/plugin.json` (or `plugin.json`) for the name, version, description and license. A folder of skills, or one skill's own folder, works too.

Bouncer never drops something silently. Whatever it leaves out is listed as notes when the import finishes. What gets left out, and why:

| Left out | Why |
| --- | --- |
| MCP servers reached over the network (a `url`, no `command`) | Bouncer runs servers that a command starts. |
| MCP servers with no command | There is nothing to run. |
| Hooks, agents and output styles | Bouncer runs no plugin code and has no features of those kinds. |
| Files beside a skill's `SKILL.md` | Only a skill's instructions are taken. |
| Skills with a bad name or description, and commands with an empty or too long prompt | They would not be valid in Bouncer. |
| Numbered arguments (`$1`), shell lines and `@file` references in a command | Bouncer fills in `$ARGUMENTS` only and sends the rest as written. The command is kept, with a note. |
| Servers past the 10th, skills past the 50th and commands past the 50th | The plugin limits. |

An MCP server that runs files from a Claude Code plugin's own folder keeps pointing at that folder, so keep it where it is. If an import leaves nothing Bouncer can use, it says so and installs nothing.

## Use a plugin

- **Skills** of a plugin that is on show up in Chat, Rebound and Bouncer Code like your own.
- **Slash commands** appear in the slash menu. Type `/review` and your text after it. If a plugin command has the name of one of Bouncer's own, or of an earlier plugin's, you type it as `plugin-name:command`, like `/code-review:review`. In the terminal chat, the commands are listed under **From your plugins** in `/help`.
- **Presets** are added to your presets. Workflows are added to your workflow library.
- **Recommended packages** are shown, not installed. Install one with `bcr install <name>`, or find it in **Marketplace › Packages**.

## Turn a plugin on and off

In Settings › Plugins, **Use this plugin** turns a whole plugin on or off. In the terminal:

```sh
bouncer plugin enable bouncer/code-review
bouncer plugin disable bouncer/code-review
```

Off, the plugin's skills, slash commands and MCP servers are not offered. The presets and workflows it added are now your own copies and stay until you remove the plugin.

### MCP servers

An MCP server is a program that gives a model extra tools, such as reading files or keeping notes. A plugin lists each server as a command, its arguments and the names of the environment variables it sets.

**An MCP server's command runs on your computer, with your user account's access to your files and network. A server is off until you turn it on.** Read its command first. Installing a plugin, or updating one, never starts a server.

In Settings › Plugins, each server shows its command under **MCP server**. **Run this server** turns it on or off. Once running, it shows how many tools it gives to Chat, Rebound bots and Bouncer Code. If it fails to start, the error shows with a **start again** button.

In the terminal:

```sh
bouncer plugin mcp                           # every installed server, with its command
bouncer plugin mcp bouncer/memory            # one plugin's servers
bouncer plugin mcp on bouncer/memory memory  # turn a server on: plugin, then server
bouncer plugin mcp off bouncer/memory memory
```

The desktop app runs the servers that are on. A server stops when you turn it off or turn its plugin off.

When a plugin updates, a server stays on only if its command, arguments and environment are exactly what you read and turned on. If they changed, it is off again until you read the new command.

## Update and remove

An update appears in Settings › Plugins as **update to vX** on a plugin that came from the index. Plugins you installed from a file or a URL don't update by themselves; install the new file or URL again. An update keeps the presets and workflows you didn't change, along with any edits you made to them, and removes the ones the new version no longer has.

```sh
bouncer plugin list                          # installed plugins
bouncer plugin update --check                # what has a newer version
bouncer plugin update                        # update everything from the index
bouncer plugin update bouncer/code-review    # update one
bouncer plugin remove bouncer/code-review
```

**Remove** takes away the plugin and the presets and workflows it added. See [Terminal](cli.md#plugins) for every subcommand and flag.

## Write your own

A plugin is a single `.bplugin` file: JSON, in UTF-8. This is a complete one:

```json
{
  "format": "bouncer.plugin",
  "schema": 1,
  "name": "yourname/standup",
  "version": "1.0.0",
  "description": "Turns rough notes into a short standup update.",
  "license": "MIT",
  "commands": [
    {
      "name": "standup",
      "description": "Write a standup update from your notes",
      "prompt": "Turn these notes into a standup update with three parts: yesterday, today and blockers. Keep it under 80 words.\n\n$ARGUMENTS"
    }
  ]
}
```

Install it with `bouncer plugin install ./standup.bplugin`, then type `/standup` followed by your notes.

### Fields

Every field not marked required has a default. A plugin must add at least one thing. Bouncer refuses a file with unknown fields, and says which field is wrong.

| Field | What it holds |
| --- | --- |
| `format` | Required. Always `"bouncer.plugin"`. |
| `schema` | Required. Always `1`. A newer schema is refused rather than half read. |
| `name` | Required. `owner/name`. The owner is 1 to 39 characters: lowercase letters, digits and `-`, starting with a letter or digit. The name is 1 to 64 characters: lowercase letters, digits, `-`, `.` and `_`, starting with a letter or digit. |
| `version` | Required. `major.minor.patch`, like `1.0.0`, each part a number up to 999999. |
| `description` | Up to 500 characters. |
| `license` | The plugin file's own license, such as `MIT`. Up to 100 characters. |
| `skills` | Up to 50. Each has `name` (lowercase letters, digits and hyphens, up to 64), `description` (required, up to 1024) and `instructions` (up to 50000 characters). |
| `commands` | Up to 50. Each has `name` (lowercase letters, digits and single hyphens, up to 32), `description` (one line, up to 200) and `prompt` (required, up to 20000). Put `$ARGUMENTS` where the user's text goes. Without it, the text is added after the prompt. |
| `presets` | Up to 20. Each has `name` (up to 80), `systemPrompt` (up to 20000) and `sampling`, which may set `temperature` (0 to 2), `topP` (0 to 1), `topK` (0 to 1000), `minP` (0 to 1), `repeatPenalty` (0 to 4) and `maxTokens`. |
| `workflows` | Up to 20. Each is a [`.bflow`](file-formats.md#bouncer-workflow-bflow) workflow, written inline. |
| `packages` | Up to 20 bcr packages to recommend, as `owner/name` or `owner/name@1.0.0`. |
| `mcpServers` | Up to 10. Each has `name` (lowercase letters, digits, `-` and `_`, up to 32), `description` (one line, up to 200), `command` (one line, up to 500), `args` (up to 50 one-line strings) and `env` (up to 50 variables). Lines have no line breaks. |

Names of skills, commands, presets and servers must be unique inside a plugin. Test a plugin by installing it from a file and running `bouncer plugin info ./my.bplugin`, which reads it and shows what it holds without installing.

Write MCP servers so anyone can read what they will run. Name the exact package, never put a secret in `env`, and say in the `description` what the server can reach.

## Publish to the index

The index lives in the `site/plugins/` folder of [get-bouncer](https://github.com/shankar-sachin/get-bouncer). To add a plugin or a new version, send a pull request that adds its file and updates `index.json`. [plugins/README.md](../plugins/README.md) has the layout and the checks. A published version never changes: a change is a new version.

You don't need the index to share a plugin. Host the `.bplugin` file at an https address, or send the file itself.

## Related

- [Skills](skills.md): what a plugin's skills are.
- [Workflows](workflows.md): what a plugin's workflows are.
- [Packages (bcr)](bcr.md): the packages a plugin can recommend.
- [Terminal](cli.md#plugins): every `bouncer plugin` command.
- [File formats](file-formats.md): Bouncer's other files.
