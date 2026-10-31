# Skills

A skill is a set of instructions a model reads when a task needs it, like "write release notes from a list of changes". Chat, Rebound bots and Bouncer Code see the name and description of every skill, and read a skill's instructions only when they decide to use it. Skills need a model that can use tools.

## Make a skill

Open **Settings › Skills** and click **New skill**:

- **name**: lowercase letters, digits and hyphens, like `release-notes`.
- **description**: what it does and when to use it. The model picks skills by this line, so make it specific.
- **instructions**: the steps, in Markdown.
- **save to**: **my skills**, or the project open in Bouncer Code.

The list in **Settings › Skills** shows each skill with buttons to edit it, show it in its folder, or delete it. **open skills folder** opens your skills folder.

## Skill files

Each skill is a folder with a `SKILL.md` file: front matter with the name and description, then the instructions.

```markdown
---
name: release-notes
description: Writes release notes from a list of merged pull requests.
---
1. Group the changes by area.
2. One line per change, starting with a verb.
```

Skills are found in two places:

- **Your skills**, in the `skills` folder of Bouncer's data folder. Every chat, bot and coding session can use them.
- **Project skills**, in `.bouncer/skills` inside a folder you open in Bouncer Code. Only sessions in that folder use them, and they can be shared with the project.

You can also add, edit or copy skill folders by hand: Bouncer reads the folders again on every message.

## Related

- [Chat](chat.md), [Rebound](rebound.md) and [Bouncer Code](code.md): where skills are used.
- [Settings](settings.md): every section of Settings.
