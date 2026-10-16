# Troubleshooting

Start here when Bouncer will not open, an install or download fails, a model will not load, or replies are slow. Most problems have a short fix. When you need more detail, open the engine logs (see [Where are the logs?](#where-are-the-logs)).

## Gatekeeper or SmartScreen blocks the first launch

Unsigned builds trigger a warning from macOS or Windows the first time you open them.

- **macOS:** open **System Settings → Privacy & Security**, then click **Open Anyway** next to Bouncer. On older macOS versions, right-click Bouncer and choose **Open**.
- **Windows:** in the SmartScreen dialog, choose **More info**, then **Run anyway**.

The [install page](install.md#unsigned-builds) has the full steps.

## The engine download fails

The engine is llama.cpp. You install it from **Marketplace → this machine → engine**, or from **Settings → Engine**.

- **Check your connection.** Installing the engine needs internet access. The install card shows an error with a **Retry** button.
- **Wait a few minutes and retry.** The engine list comes from GitHub, which limits how often a machine can ask. Retrying later usually works.
- **Switch to the CPU backend.** The message *No llama.cpp build available for …* means that backend has no build for your system. In **Settings → Engine**, choose **CPU** and install again.
- **Free disk space.** The engine is extracted into Bouncer's data folder.
- **Cancel and start again.** Use **Cancel** on the progress bar, then install again.

If the install still fails, copy the engine logs and include them in a report.

## A model will not load

When you load a model, Bouncer checks the memory it needs against your machine. The message depends on the guardrail setting.

**Strict guardrails** stop the load with a message like:

> *<model> needs about <N> GB at a <N>-token context, which is more than this machine can hold.*

**Relaxed guardrails**, the default, warn you and let you load the model anyway. A model that is too large can still crash or slow the system down.

Try these, in order:

1. **Pick a smaller file.** In the Marketplace, choose a quantized file marked **Runs well** or **Tight fit**. A smaller quantization uses less memory.
2. **Lower the context window.** Open the model's Load settings and choose a smaller context. The context window is the amount of conversation the model keeps in memory.
3. **Close other apps.** Browsers and editors with many tabs or large projects use a lot of memory.
4. **Check the guardrail.** In **Settings → Hardware → guardrails**, choose **Strict** to be stopped before a model that will not fit loads, or **Relaxed** to be warned first.

The guardrail options are:

| Option | What happens |
| --- | --- |
| **Off** | Bouncer never stops a load. Models that do not fit may crash or swap heavily. |
| **Relaxed** (default) | Warns before loading a model that will not fit, but lets you continue. |
| **Strict** | Bouncer blocks loading a model that will not fit this machine. |

### The model shows *Load failed*

When the model pill in the title bar shows **Load failed**, click it and choose **View logs**. The error message also includes the last lines of the engine's output.

### Access denied or gated models

Some Hugging Face models need you to accept a license first. The error says so. Accept the license on huggingface.co with your account, add a Hugging Face access token in **Settings → Hugging Face**, and try again.

### Downloads are disabled

The **Download** button is disabled and its tooltip reads *Downloads need a connection*. Downloads and Marketplace catalog updates need an internet connection. Finished models keep working offline.

## Replies are slow

The speed shows as tokens per second in the status bar while a reply streams. If it is lower than you expect:

- **Check the backend.** A CPU backend is much slower than a GPU backend. Open **Settings → Engine** and make sure the backend matches your hardware. If you have an NVIDIA or Apple silicon GPU and see CPU, reinstall the engine with the recommended backend.
- **Use a smaller model or quantization.** A file marked **Tight fit** can run partly from system memory, which is slow. Pick one marked **Runs well**.
- **Lower the context window.** Long conversations make every reply slower.
- **Check GPU offload.** In the model's Load settings, set **GPU offload** to max so the engine uses the GPU for every layer it can.
- **Close other heavy apps**, especially ones that use the GPU.

## Scheduled tasks do not run

Scheduled tasks run only while Bouncer is open. If you quit during a run, that run is marked **stopped** in the inbox.

- **The run failed.** Its detail says why. A common reason is that no model was loaded, so load a model and use **Run again**.
- **Merge will not apply.** Bouncer names a file that has unstaged edits. Stage, commit or stash those edits in your folder, then click **Merge** again. A conflict leaves conflict markers in the file for you to resolve.
- **Nothing to review.** A run marked **no changes** finished without editing any file.

See [Scheduled tasks](scheduled-tasks.md) for the states and the merge rules.

## Updates are stuck

If the update status does not move:

1. Open **Settings → About** and choose **Check for updates**. Checks are not repeated while a download is already running.
2. Read the status line. *couldn't update* followed by a message tells you why. For example, *has no checksum yet; Bouncer will try again later* means the release was published before its checksum file. Bouncer checks again on its own.
3. On macOS, *can't update … is not writable* means the folder that holds Bouncer is locked for your user. Reinstall Bouncer with the [installer](install.md), or move it to a folder you can write to.
4. On a Linux `.deb` install, updates are not applied in the app. Use **Open download page** and install the new `.deb`.
5. Quit Bouncer and open it again. The next check runs about 30 seconds after launch.

See [Updates](updates.md) for what each status means.

## Where are the logs?

The engine logs show the output of llama.cpp, the program that runs your model. Open them in one of these ways:

- **Settings → Engine → View logs.**
- **The model pill** in the title bar: click it and choose **Engine logs**, or **View logs** when a load has failed.

In the logs window, the title shows the model the logs belong to. Lines in red are errors. Click **Copy all** to copy everything for a report, or **Jump to latest** if you scrolled up. If no model has loaded yet, the window says so.

## Still stuck

Before you report a problem, note your system, Bouncer version (**Settings → About**), the model and file you used, and the lines from the engine logs around the error. Remove any private text from the logs first.

## Related

- [Install](install.md)
- [System requirements](system-requirements.md)
- [Updates](updates.md)
- [FAQ](faq.md)
