# Bouncer in the terminal

The `bouncer` command runs Bouncer from a terminal: download and manage models, chat with one, and run Bouncer Code in a folder. It comes with the desktop app and shares everything with it: the same model library, engine, keys, chats and Bouncer Code sessions. A model the desktop app has loaded is the one `bouncer` uses, so nothing loads twice.

If you use Ollama or Claude Code, most of what you type already works. See [Coming from Ollama](#coming-from-ollama) and [Coming from Claude Code](#coming-from-claude-code).

## Set up the command

**macOS.** The [install script](install.md) adds `~/.local/bin/bouncer`, a small script that runs the app. If you installed Bouncer another way, open Bouncer and choose **Bouncer > install command line tool…** in the menu bar. Both tell you when `~/.local/bin` isn't on your `PATH` yet, and give you the line to add to `~/.zprofile`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

**Windows.** The installer adds `bouncer.cmd` to a `bin` folder in the install folder (by default `%LOCALAPPDATA%\Programs\Bouncer\bin`) and puts that folder on your user `PATH`. Open a new terminal after installing. `install.ps1` prints where the command is, and it works in the same window right away. Uninstalling removes the folder from your `PATH`.

Check that it works:

```sh
bouncer --version
bouncer --help
```

`bouncer` on its own prints the help. `bouncer desktop` opens the desktop app, or brings it to the front; give it Bouncer files (`.bcn`, `.bml`, `.bproj`) to open them there.

## Models

```sh
bouncer pull Qwen/Qwen3-8B-GGUF            # download, picking the quant that fits this machine
bouncer pull Qwen/Qwen3-8B-GGUF:Q4_K_M     # or name the quant
bouncer list                               # or: bouncer ls
bouncer show Qwen3-8B-GGUF                 # architecture, context, quant and template
bouncer ps                                 # models loaded by the app, the daemon and other terminals
bouncer stop Qwen3-8B-GGUF                 # unload
bouncer rm Qwen3-8B-GGUF                   # delete from the library
```

A model can be named by its full library name, its repo, or just the repo's name when only one quant of it is downloaded, with or without `:quant`. Case doesn't matter. `bouncer pull` resumes when you run it again after Ctrl+C. `list`, `show` and `ps` take `--json`.

## Chat

```sh
bouncer run Qwen3-8B-GGUF                       # a chat, full screen
bouncer run Qwen3-8B-GGUF "Explain mmap in two lines."   # print one reply and exit
git diff | bouncer run Qwen3-8B-GGUF "Write a commit message for this."
bouncer chat                                    # continue your last terminal chat
bouncer                                         # a chat with no model yet; /load picks one
```

`bouncer run` with a prompt, or with piped input, prints the reply and exits, so it works in scripts. Without one it opens a chat. If the model isn't downloaded yet, it asks whether to pull it. In the full-screen chat the mouse wheel scrolls the conversation; to select text, hold Fn (Terminal) or Option (iTerm2) while you drag.

Flags: `--system <prompt>`, `--effort low|medium|high|xhigh|max`, `--think`, `--nothink`, `--hidethinking`, `--verbose` (tokens and speed after each reply), `-c`/`--continue`, `-p`/`--print` and `--inline` (draw in the scrollback instead of full screen).

In the chat, type `/` for commands: `/model`, `/load`, `/clear`, `/resume`, `/retry`, `/rewind`, `/set`, `/show`, `/effort`, `/think`, `/nothink`, `/system`, `/context`, `/cost`, `/copy`, `/save`, `/export` and `/bye`.

Cloud models work too, once the provider is turned on in Settings: `bouncer run cloud:anthropic/claude-sonnet-5-5`. See [Cloud providers](providers.md). In Windows terminals, keys come from `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` and `OPENROUTER_API_KEY`, because the keychain isn't reachable there.

## Bouncer Code

```sh
cd my-project
bouncer code                                   # a session in this folder
bouncer code "Add a --json flag to the CLI."    # send this first
bouncer code -p "Why does the build fail?"      # print the reply and exit
bouncer code -c                                # continue the latest session here
bouncer code -r                                # pick a session here to continue
bouncer code --model Qwen3-8B-GGUF --permission-mode plan
```

It is the same agent as [Bouncer Code](code.md) in the app, with the same four modes, and the sessions show up there too. Shift+Tab cycles the mode. When a step needs your OK, an approval box asks; `-p` declines anything that needs approval and says so.

Keys: `@` mentions a file (Tab completes it), `!` runs a shell command whose output goes with your next message, Esc stops the model, Esc twice on an empty line rewinds, `\` then Enter starts a new line, and Ctrl+C or Ctrl+D quits. Type `/` for commands: `/model`, `/mode`, `/clear`, `/resume`, `/rewind`, `/compact`, `/init`, `/ultracode`, `/diff`, `/context`, `/cost`, `/status`, `/export` and `/exit`.

## Workflows

```sh
bouncer workflow list                        # or: bouncer workflow ls
bouncer workflow run Digest "space news"     # the words after the name are the input
cat notes.txt | bouncer workflow run Digest  # or pipe it in
bouncer workflow run Digest --json           # the whole run, with every step's log
```

`bouncer workflow run` runs a [workflow](workflows.md) from the desktop app's library, named by its name (any case) or id. The output goes to stdout and each step is reported on stderr as it ends (`-q` turns that off), so you can redirect the output to a file. With no input, the workflow's default input is used. Ctrl+C stops the run. The run shows in the app's history, marked "from the terminal".

## Packages

```sh
bcr search code                      # or: bouncer bcr search code
bcr install bouncer/qwen2.5-coder-7b
bcr list
bcr update
bcr remove bouncer/qwen2.5-coder-7b
```

`bcr` installs [packages](bcr.md): a model with its load options and preset. `bcr` is the same as `bouncer bcr`; on Linux, use `bouncer bcr`.

## Plugins

```sh
bouncer plugin search review                  # plugins in the index
bouncer plugin info bouncer/code-review       # what one holds, before you install it
bouncer plugin install bouncer/code-review
bouncer plugin list
bouncer plugin update --check
bouncer plugin mcp bouncer/memory             # the command an MCP server would run
bouncer plugin mcp on bouncer/memory memory   # turn that server on
```

`bouncer plugin` installs [plugins](plugins.md): skills, slash commands, presets, workflows and MCP servers. `bouncer plugins` works too. A plugin is `owner/name` or `owner/name@1.0.0` from the plugin index, an https URL, or the path to a `.bplugin` file, a file of MCP servers, or a Claude Code plugin folder.

| Subcommand | What it does |
| --- | --- |
| `search [words]` | Lists the plugins in the index whose name, description or tags hold every word. |
| `info <plugin>` | Shows what a plugin holds, with each MCP server's command, without installing it. Also `show`. The plugin can be a name, a file or a URL. |
| `install <plugin>` | Installs it, and lists any recommended packages and the MCP servers that are off. Also `add`. |
| `list` | Lists installed plugins with their state (on or off), what each holds and when it was installed. Also `ls`. |
| `update [plugin]` | Updates plugins from the index to their newest version, all of them or the one you name. A server whose command changed is off again. Also `upgrade`. |
| `remove <plugin>` | Removes a plugin and the presets and workflows it added. Also `rm`. |
| `enable <plugin>` | Turns a plugin on. |
| `disable <plugin>` | Turns a plugin off: its skills, slash commands and MCP servers aren't offered. Its presets and workflows stay. |
| `mcp [plugin]` | Lists MCP servers with their state, command and the environment variables they set. |
| `mcp on <plugin> <server>` | Turns an MCP server on. Its command then runs on this computer; the desktop app runs it. |
| `mcp off <plugin> <server>` | Turns it off. |

Flags:

- `--json` prints `search`, `info`, `list` and `mcp` as JSON.
- `--force` installs a version that is already installed again.
- `--check` with `update` lists the plugins that have a newer version, without installing.

The terminal chat lists the slash commands of plugins that are on under **From your plugins** in `/help`.

Set `BOUNCER_PLUGIN_INDEX` to read the index from another address, for example while you test your own.

## Account

```sh
bouncer login                   # GitHub in your browser
bouncer login google            # Google in your browser
bouncer login passkey           # a passkey, on the account page in your browser
bouncer login email ada@example.com   # a code sent by email
bouncer whoami                  # who this computer is signed in as (--json for scripts)
bouncer logout                  # sign this computer out; --everywhere signs out every device
```

The terminal and the desktop app share one sign-in. An account is optional; every other command works signed out. See [Account](account.md).

## The local API server

`bouncer serve` runs Bouncer's local API server in the foreground, with OpenAI-compatible and Anthropic-compatible endpoints, and prints their addresses. Ctrl+C stops it.

### Ollama's API

The local server also answers Ollama's API, so an app made for Ollama can use the models in your library. It answers on the server's own port (3133 unless you changed it), in Ollama's shapes. Streamed answers are one JSON object per line, as Ollama sends them.

| Endpoint | What it does |
| --- | --- |
| `GET /api/version` | Says the version Ollama would. |
| `GET /api/tags` | Lists your downloaded models. |
| `GET /api/ps` | Lists the loaded models. |
| `POST /api/show` | Shows one model: its family, size, quant, context length and what it can do (completion, tools, vision, embedding). |
| `POST /api/chat` | Chat, with streaming, tools, images, `format` (`"json"` or a JSON schema) and `think`. |
| `POST /api/generate` | A prompt, with `system`, images, `format`, `think`, and `raw` with `suffix`. |
| `POST /api/embed` | Embeddings for `input`, a string or a list of strings. |
| `POST /api/embeddings` | The older embeddings request, for one `prompt`. |
| `POST /api/pull` | Downloads a model from Hugging Face. See below. |

**Turn on Ollama's port.** Apps made for Ollama look for it at `127.0.0.1:11434`. In **Settings › Local server**, turn on **Also answer on Ollama's port (11434)**. It is off until you do. While it is on, and the local server is on, Bouncer listens on `127.0.0.1:11434` and `::1` too, and `GET /` answers `Ollama is running`, which apps check for. It is for this computer only, whatever the network setting says. If you set the server's own port to 11434, there is nothing more to open.

If Ollama itself holds the port, the setting stays on and says so. Quit Ollama, then turn it on again. It also says when another Bouncer window or the background service already answers there, or another app holds the port. The setting is shared: the desktop app, `bouncer serve` and the background service all open the port when it is on.

**Point an app at Bouncer.** If the app reads Ollama's usual address, turn on the port and you're done. Otherwise set its Ollama host to `http://localhost:11434`, or to `http://localhost:3133` without the port switch. A key isn't needed on this computer unless you turned on **Require a key on this computer too**; then send it as `Authorization: Bearer <key>`. Test it with:

```sh
curl http://localhost:11434/api/tags
curl http://localhost:11434/api/chat -d '{"model": "qwen3", "messages": [{"role": "user", "content": "Hello"}], "stream": false}'
```

**Model names.** Name a model as Ollama does or as your library does. Bouncer tries, in order: the library id, the id without `:latest`, `hf.co/owner/repo:quant`, then the model's own name, so `qwen2.5-coder:7b` finds `Qwen2.5-Coder-7B-Instruct-GGUF`. A loaded model wins when several match. A name that matches nothing answers `model 'name' not found`. Models are listed under their library ids.

**What isn't supported.**

- Models come from Hugging Face, not Ollama's library. `POST /api/pull` finishes at once for a model you already have, and downloads a name like `hf.co/owner/repo:Q4_K_M`. A name from Ollama's library is refused.
- `/api/create`, `/api/copy`, `/api/delete`, `/api/push` and the blob endpoints answer `404`. Use Bouncer to manage models.
- Of `options`, Bouncer uses `temperature`, `top_p`, `top_k`, `min_p`, `seed`, `stop`, `repeat_penalty`, `presence_penalty`, `frequency_penalty` and `num_predict`. `num_ctx` and the rest are ignored: the context size is a load setting of the model.
- An empty `/api/generate` or `/api/chat` loads the model. `keep_alive: 0` doesn't unload it, because Bouncer unloads models on its own schedule. `expires_at` in `/api/ps` is only an estimate, and `context` in an answer is always empty.
- `/api/show` has no Modelfile `template` or `parameters`.
- `/api/embed` needs a model that is set as the embedding model in Bouncer, and answers `400` otherwise.

## The background service

```sh
bouncer daemon start                         # start it, with the last model you used
bouncer daemon start --model Qwen3-8B-GGUF   # or name the model to keep loaded
bouncer daemon status                        # running or not, its models and the API address (--json for scripts)
bouncer daemon logs -n 100 -f                # the last 100 lines, then new ones until Ctrl+C
bouncer daemon stop
bouncer daemon enable                        # start it when you log in; disable stops that
```

`bouncer daemon` runs Bouncer in the background, with no window. It keeps a model loaded, serves the local API (port 3133 unless you changed it) and runs your [Rebound](rebound.md) routines. The desktop app and the terminal app use its models, so a model loaded once is shared, and closing the app's window doesn't unload it. `bouncer ps` lists the daemon's models with the others.

The desktop app has the same controls in Settings › Local server › Background service: start, stop, and start at login.

## Coming from Ollama

| Ollama | Bouncer |
| --- | --- |
| `ollama run llama3.2` | `bouncer run <model>` |
| `ollama run llama3.2 "prompt"` | `bouncer run <model> "prompt"` |
| `ollama pull llama3.2` | `bouncer pull <owner/repo-GGUF>[:quant]` |
| `ollama list`, `ollama ls` | `bouncer list`, `bouncer ls` |
| `ollama ps` | `bouncer ps` |
| `ollama stop llama3.2` | `bouncer stop <model>` |
| `ollama rm llama3.2` | `bouncer rm <model>` |
| `ollama show llama3.2` | `bouncer show <model>` |
| `ollama serve` | `bouncer serve` |
| `--verbose`, `--think`, `--hidethinking` | the same flags |
| `/bye`, `/set`, `/show`, `/clear`, `/load` | the same commands (`/load` is `/model`) |

Two differences: models come from Hugging Face as GGUF files, so you name a repo (`Qwen/Qwen3-8B-GGUF`) instead of an Ollama library tag, and Bouncer doesn't read the models Ollama downloaded. See [Models from other apps](other-providers.md).

## Coming from Claude Code

| Claude Code | Bouncer |
| --- | --- |
| `claude` | `bouncer code` |
| `claude "prompt"` | `bouncer code "prompt"` |
| `claude -p "prompt"` | `bouncer code -p "prompt"` |
| `claude -c`, `claude -r` | `bouncer code -c`, `bouncer code -r` |
| `--model` | `--model <model>` (a library name, or `cloud:<provider>/<model>`) |
| `--permission-mode default`, `acceptEdits`, `plan`, `bypassPermissions` | the same names, or Bouncer's: `manual`, `accept-edits`, `plan`, `autopilot` |
| `--dangerously-skip-permissions` | the same flag (autopilot) |
| Shift+Tab, Esc, Esc Esc, `@`, `!` | the same keys |
| `/compact`, `/init`, `/rewind`, `/clear`, `/resume`, `/model`, `/context`, `/cost`, `/status`, `/export` | the same commands |
| `CLAUDE.md` | `BOUNCER.md` (`/init` writes one) |

The model runs on your machine unless you pick a cloud model, and autopilot still stays inside the folder you started in.

## Troubleshooting

- **`bouncer: command not found` on macOS.** Add `~/.local/bin` to your `PATH` (see [Set up the command](#set-up-the-command)) and open a new terminal.
- **`bouncer` isn't found on Windows.** Open a new terminal: open ones keep the old `PATH`. If it is still missing, add the `bin` folder in the install folder to your user `PATH` by hand.
- **Windows asks "Terminate batch job (Y/N)?"** after Ctrl+C. That is cmd's question for `bouncer.cmd`; answer Y.
- **Less motion.** Set `BOUNCER_REDUCED_MOTION=1` and the bouncing ball pulses in place instead. `--inline` draws in the scrollback instead of taking over the screen.
