# Cloud providers

Bouncer runs models on your computer. If you also want a large hosted model, you can add one from **Anthropic**, **OpenAI** or **OpenRouter** and use it next to your local models. Cloud providers are optional and off until you turn one on. Nothing leaves your machine unless you turn a provider on, save its API key and pick one of its models.

## Turn on a provider

1. Make an API key on the provider's site: console.anthropic.com, platform.openai.com or openrouter.ai/keys.
2. In Bouncer, open **Settings > Cloud providers**.
3. Turn on the provider's switch. Bouncer asks you to confirm, because prompts sent to its models go to that company.
4. Paste the key into **API key** and click **Save key**.
5. Click **Test**. Bouncer asks the provider for its model list and shows how many models it found.

To stop using a provider, turn its switch off. Its models leave the menu, and nothing more is sent to it. **Remove key** deletes the saved key.

## Pick a cloud model

Open the model pill at the top of Chat or Bouncer Code and choose **Cloud models…**. The list shows the models of every provider that is on and has a key. Search it, then click a model to use it. OpenRouter models also show their price per million prompt and reply tokens.

A cloud model always carries a **cloud** chip, in the model pill and next to the model's name, so you can tell at a glance that requests leave your machine. There is nothing to download or load: a cloud model is ready as soon as you pick it.

Cloud models work in:

- **Chat**.
- **Bouncer Code**, where a cloud model runs at effort high, and **ultracode**, which runs up to 4 parts at a time on a cloud model.
- **Studio**: the AI features in Docs, Deck, Grid and Design.

These always stay on your local models: the [local server](settings.md), the codebase index, inline autocomplete and the helper models.

## What is sent

When you use a cloud model, Bouncer sends the provider what the model needs to reply:

- your messages and the conversation so far, including the system prompt or bot personality;
- attached files and images;
- in Bouncer Code, the files the agent reads, the output of the commands it runs, and the changes it proposes;
- web search results, when web search is on for the chat.

The provider's own terms and privacy policy apply to what it receives. Bouncer adds no tracking, and it doesn't send anything to a provider you haven't picked a model from, apart from the model list when you click **Test** or open **Cloud models…**.

OpenRouter also receives Bouncer's name and website (bouncer-ai.pages.dev) with each request, which it uses to label the app in your OpenRouter activity.

## Where keys are kept

- Each key is encrypted with your operating system's keychain and stored in Bouncer's data folder. It is never shown again after you save it, and Bouncer's windows never see it.
- A key is sent only to its own provider: api.anthropic.com, api.openai.com or openrouter.ai.
- Keys are never written to a `.bcn`, `.bml` or `.bproj` file, so you can share those files safely.
- If your system has no usable keychain (some Linux setups), Settings says so, and saved keys last only until Bouncer quits.

## Costs

Cloud models are billed by the provider, to your account, at its own prices. Bouncer doesn't charge anything or add a markup.

- **OpenRouter** reports what each reply cost, and Bouncer shows it in the statistics under the reply, for example `$0.0012`. The model list shows each model's prices.
- **Anthropic** and **OpenAI** don't report a cost with each reply. See your usage in their consoles.

Long Bouncer Code sessions and ultracode send a lot of context, so they cost more than a chat. Watch the context meter, and start a new session when it gets full.

## When something goes wrong

Bouncer turns provider errors into plain messages:

- **Rejected the API key**: the key is wrong or was revoked. Save a new one.
- **Out of credit**: add credit or a payment method on the provider's site.
- **Rate limited**: the provider is limiting requests. Wait a moment, then try again.
- **Doesn't have this model any more**: the provider removed it or your account can't use it. Pick another one.
- **Overloaded** or **server error**: a problem on the provider's side. Try again in a moment.
- **Refused the request**: the provider refused the request. Rephrase it, or use another model.

## Related

- [Settings](settings.md): the Cloud providers section.
- [Privacy](privacy.md): what stays on your machine and what connects to the internet.
- [Chat](chat.md#speed-and-token-counts): the statistics under each reply.
