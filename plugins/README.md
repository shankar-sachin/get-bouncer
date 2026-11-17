# Plugins

This folder explains how to add a plugin to the official plugin index. For what plugins are and how to use or write one, read [docs/plugins.md](../docs/plugins.md).

## How the index is laid out

The index is static JSON in the `site/plugins/` folder, served at https://bouncer-ai.pages.dev/plugins/:

```
site/plugins/
  index.json
  plugins/<owner>/<name>/<version>.json
```

- `index.json` lists every plugin: its `name`, `description`, newest version (`latest`), all `versions` and `tags`. Its `format` is `bouncer.plugin-index` and its `schema` is `1`.
- `plugins/<owner>/<name>/<version>.json` is one version of one plugin, a `.bplugin` file. For `bouncer/code-review` at `1.0.0`, that is `plugins/bouncer/code-review/1.0.0.json`.

Bouncer reads `index.json` first, then fetches only the version file it needs. The version file's `name` and `version` must match the entry and the path, or Bouncer refuses it.

The `bouncer` owner is for plugins the Bouncer team maintains. Use your own GitHub name or organization as the owner.

## Submit a plugin

1. Write your plugin as a `.bplugin` file. See [Write your own](../docs/plugins.md#write-your-own).
2. Fork this repository and add the file as `site/plugins/plugins/<owner>/<name>/<version>.json`.
3. Add an entry to `site/plugins/index.json`, or add your version to the entry that is there and move `latest` to it. A published version never changes: a change is a new version.
4. Open a pull request. Say what the plugin does and, if it has MCP servers, what each one can reach.

Before you open the pull request, check that:

- the plugin installs with `bouncer plugin install ./<version>.json` and `bouncer plugin info` shows what you expect;
- `license` is set, and the plugin's text is yours to share;
- every MCP server names the exact package it runs, comes from a source people can read, and sets no secrets in `env`;
- it asks for nothing it doesn't need: a plugin that only adds slash commands has no MCP server.

## The official plugins

| Plugin | Holds |
| --- | --- |
| `bouncer/code-review` | Two skills, two slash commands, a `reviewer` preset, and a recommended coding package. |
| `bouncer/writing-helper` | Two skills, three slash commands and an `editor` preset. |
| `bouncer/git-helper` | Four slash commands for commit messages, branch names, changelogs and explaining diffs. |
| `bouncer/memory` | A skill and the official MCP memory server, off until you turn it on. |
