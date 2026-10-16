# System requirements

Bouncer runs on 64-bit macOS, Windows and Linux. How much it can run depends on your memory and graphics hardware, and the size of the model you choose. Exact minimum operating system versions are not published yet.

## Supported systems

| System | Processor | Builds |
| --- | --- | --- |
| macOS | Apple silicon (arm64) | `.dmg` and `.zip` |
| macOS | Intel (x64) | `.dmg` and `.zip` |
| Windows | 64-bit (x64) | Installer (`Bouncer-Setup-<version>.exe`) |
| Linux | 64-bit (x86_64) | AppImage, and `.deb` for Debian and Ubuntu |

There are no ARM64 builds for Windows or Linux yet. On Intel Macs, Bouncer uses the CPU only.

## Memory

A model has to fit in memory while it runs, next to your operating system and your other apps. The memory a model needs is roughly the size of its file, plus room for the conversation (the context), plus some overhead. Longer conversations need more memory.

These are approximate file sizes for the quantized builds Bouncer suggests for coding work. They give a rough idea of what each model size needs:

| Model size | File size (approx.) | Comfortable memory |
| --- | --- | --- |
| About 4B parameters | 2.5 GB | 8 GB |
| About 8B parameters | 5 GB | 16 GB |
| About 14B parameters | 9 GB | 16 GB |
| About 30B parameters (mixture of experts) | 19 GB | 32 GB |
| About 120B parameters | 63 GB | 96 GB or more |

Bouncer checks each model against your machine before you download it, and labels every quantized file **Runs well**, **Tight fit** or **Too large**. Those labels use the memory your machine can give a model:

- **Apple silicon:** memory is shared between the CPU and GPU. Bouncer keeps part of it for the system, so the usable amount is smaller than the total.
- **Discrete graphics card:** the model is measured against the card's video memory. A model that does not quite fit can still run, with some layers on the CPU, but it is slower.
- **CPU only:** the model is measured against most of your RAM.

Trust the label for your machine over this table. For the exact figure, open a model in the Marketplace. Its page shows the estimate for each file, at the context size Bouncer uses.

Start with a small model. A 4 to 8 billion parameter model runs on most laptops. Coding work is best with models of 14 billion parameters and up.

## Graphics and the engine backend

Bouncer runs models with llama.cpp. It picks a backend for your hardware when you install the engine, and you can change it in **Settings → Engine**.

| Backend | Where it is used | Notes |
| --- | --- | --- |
| **Metal** | Apple silicon Macs | The default on Apple silicon. Uses the built-in GPU and shared memory. |
| **CUDA** | Windows and Linux, 64-bit, with an NVIDIA GPU | Needs a recent NVIDIA driver. Bouncer picks the newest CUDA build your driver supports. |
| **Vulkan** | Windows and Linux, 64-bit, with a GPU that has Vulkan drivers | Works with AMD, Intel and NVIDIA GPUs. |
| **CPU** | Every system | Always available. Slowest, but works without a GPU. |

Bouncer recommends CUDA when it finds an NVIDIA GPU and a CUDA-capable driver, Vulkan when it finds Vulkan support, and the CPU otherwise. On Apple silicon it recommends Metal. If a backend has no build for your system, choose CPU.

If you have more than one GPU, **Settings → Hardware** lets you choose which ones Bouncer may use. At least one has to stay on.

## Disk space

Plan for the model files on top of the app itself. Each download is stored in Bouncer's data folder. The llama.cpp engine takes additional space. See the [FAQ](faq.md#where-is-my-data-stored) for where the data folder is on each system.

## Internet

Bouncer works offline once the engine and a model are installed. You need an internet connection to browse Hugging Face, download models, install or update the engine, and check for updates. See the [FAQ](faq.md#does-anything-leave-my-machine) for the full list.

## Related

- [Install](install.md)
- [Getting started](getting-started.md)
- [Models](models.md)
- [Troubleshooting](troubleshooting.md)
