# Packages (bcr)

A **package** is a model with the settings it runs best with. Installing one downloads the model into your library like any other, saves its load options (context size, GPU layers, flash attention, KV cache) for that model, and adds its preset (a system prompt and sampling) if it has one. `bcr` is the package manager, in the app and in the terminal.

Packages come from the **bcr index** at https://bouncer-ai.pages.dev/bcr/, or from a `.bcr.json` file or an https URL someone shares.

## In the app

1. Open the **Marketplace** (⌘8 or Ctrl+8), then **Discover**.
2. Pick **packages** in the switch above the results (next to GGUF and, on Apple silicon, MLX).
3. Search with the search box, then click **install** on a package.

The model downloads in the background; its progress shows on the package and in **Downloads**. When it finishes, the package shows its version, its model and its preset. Load the model as usual: its load options are already set, and the preset is in the composer's preset menu.

- **update to vX** appears when the index has a newer version. Updating swaps in the new model and preset and removes the old ones.
- **remove** takes away the preset, and the model too if the package downloaded it. A model you had before installing the package stays.
- **install from file** opens a `.bcr.json` file. Packages installed from files are listed under **from files**.
- **refresh** reads the index again.

## In the terminal

`bcr` is the same as `bouncer bcr`. The command-line tool (`install.sh`, the macOS menu item, the Windows installer) sets up both. On Linux, use `bouncer bcr`.

```sh
bcr search                          # every package in the index
bcr search code                     # packages whose name, description or tags match
bcr info bouncer/qwen2.5-coder-7b   # its model, load options and preset
bcr install bouncer/qwen2.5-coder-7b
bcr install bouncer/qwen3-8b@1.0.0  # a version
bcr install ./my-model.bcr.json     # a file
bcr install https://example.com/my-model.bcr.json
bcr list                            # installed packages
bcr update --check                  # what has a newer version
bcr update                          # update everything from the index
bcr remove bouncer/qwen3-8b         # add --keep-model to keep the model
```

`--json` prints `search`, `info` and `list` as JSON. `--force` installs a version that is already installed again. Ctrl+C pauses a download; run the same command to resume it.

## The package file

A package is a small JSON file, `.bcr.json`:

```json
{
  "format": "bouncer.package",
  "schema": 1,
  "name": "bouncer/qwen2.5-coder-7b",
  "version": "1.0.0",
  "description": "Qwen2.5 Coder 7B for code.",
  "license": "Apache-2.0",
  "model": { "engine": "gguf", "repo": "unsloth/Qwen2.5-Coder-7B-Instruct-GGUF", "quant": "Q4_K_M" },
  "load": { "ctxSize": 32768, "flashAttn": "on", "cacheTypeK": "q8_0", "cacheTypeV": "q8_0" },
  "preset": {
    "name": "coder",
    "systemPrompt": "You are a careful coding assistant.",
    "sampling": { "temperature": 0.2 }
  }
}
```

- `name` is `owner/name`, in lowercase letters, digits, `-`, `.` and `_`. `version` is `major.minor.patch`.
- `model` is a Hugging Face repo. For GGUF, `engine` is `"gguf"` and `quant` names a file's quant (leave it out, or `null`, to get the one that suits the computer best). For MLX, `engine` is `"mlx"` and there is no quant.
- `load` may set `ctxSize`, `gpuLayers` (`"auto"`, `"all"` or a number), `flashAttn` (`"auto"`, `"on"`, `"off"`), `cacheTypeK` and `cacheTypeV` (`"f16"`, `"q8_0"`, `"q4_0"`), `parallel` and `cacheReuse`. Anything left out stays as it was. Threads, memory mapping and draft models belong to your computer, so packages can't set them.
- `preset` is optional. Its `sampling` may set `temperature`, `topP`, `topK`, `minP`, `repeatPenalty` and `maxTokens`; the rest are Bouncer's defaults.
- `license` is the package file's own license. The model keeps its own license, shown on its Hugging Face page.

Bouncer refuses a package with unknown fields or a newer `schema`, and says which field is wrong.

## Add a package to the index

The index lives in the `site/bcr/` folder of [get-bouncer](https://github.com/shankar-sachin/get-bouncer):

- `site/bcr/index.json` lists every package: its name, description, newest version (`latest`), all `versions`, and `tags`.
- `site/bcr/packages/<owner>/<name>/<version>.json` is one version's package file.

To add a package or a new version, add its file and update `index.json` in a pull request. A published version never changes: a change is a new version.

## Related

- [Models](models.md): load options, presets and the Marketplace.
- [Terminal](cli.md): every `bouncer` command.
- [File formats](file-formats.md): Bouncer's other files.
