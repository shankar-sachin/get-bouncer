# Why can't Bouncer find models from other providers?

Bouncer can add models that **LM Studio** or **Ollama** already downloaded, so you don't download them twice. In the Marketplace, **Import from LM Studio / Ollama** sits next to **Import .gguf…**. When it is greyed out, Bouncer looked in the usual places and found no models it can run. This page explains why that happens and how to add a model yourself.

## Where Bouncer looks

| App       | Folders                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LM Studio | The models folder set in LM Studio's settings, then `~/.lmstudio/models` and `~/.cache/lm-studio/models`                                                                                |
| Ollama    | The folder in the `OLLAMA_MODELS` environment variable, then `~/.ollama/models`. On Linux also `/usr/share/ollama/.ollama/models` and `/var/lib/ollama/.ollama/models` |

`~` is your home folder, for example `C:\Users\you` on Windows or `/Users/you` on macOS.

## Common reasons

- **Neither app has downloaded a model yet.** Bouncer only lists models that are already on disk.
- **The models are MLX, not GGUF.** Bouncer runs GGUF models with llama.cpp. LM Studio on a Mac often downloads MLX models instead: a folder of `.safetensors` files with a `config.json`, usually with "MLX" in the name. Bouncer can't run those yet, so it skips them. Download the GGUF version of the same model instead (LM Studio shows both).
- **The models live in a custom folder.** If you moved LM Studio's models folder, Bouncer reads the new location from LM Studio's settings. If you moved it by hand, or Ollama's folder is somewhere unusual without `OLLAMA_MODELS` set, Bouncer won't see it.
- **Ollama runs as another user or on another machine.** A system-wide Ollama service on Linux keeps models in a folder your account may not be allowed to read. Ollama in Docker or on a server keeps them inside that container or machine.
- **The files are incomplete.** A download that never finished, or an Ollama model whose files were removed, is skipped.

## Import a GGUF yourself

You can always add a GGUF file directly, from any folder:

1. Open **Marketplace**.
2. Click **Import .gguf…** at the top right.
3. Choose the `.gguf` file. For a model split into parts (`model-00001-of-00003.gguf` and so on), choose the first part. Bouncer finds the rest.
4. The model appears in **Library**. Click **Load** to use it.

Bouncer adds the file where it is and doesn't copy it, so it takes no extra space. If you later move or delete the file, the Library marks the model as missing.

### Finding the file

- **LM Studio:** open **Library**, select your model, click the **…** menu and choose **Reveal in Finder** (**Reveal in File Explorer** on Windows), then pick the whole model rather than a single file. The folder that opens holds the `.gguf` file. If it holds `.safetensors` files instead, it's an MLX model (see above).
- **Ollama:** models are stored as blobs without a `.gguf` name, which makes them hard to pick by hand. Use **Import from LM Studio / Ollama** when it finds them, or download the GGUF from Hugging Face in Bouncer's Marketplace.

## Related

- [Models](#/models): find, download, load and manage models
- [Troubleshooting](#/troubleshooting)
