# Bouncer Studio

Studio is where you make things with the model on your computer: documents, slide decks, spreadsheets and designs. Each one is a **Relic**. It opens beside a chat, and the model can read it and change it as you talk. Nothing leaves the computer.

Open Studio from the activity bar (<kbd>⌘</kbd> <kbd>5</kbd>, <kbd>Ctrl</kbd> <kbd>5</kbd> on Windows and Linux). The home page has **New Relic**, **Import file** (a `.md` or `.txt` document, or a `.csv` or `.xlsx` spreadsheet), your recent Relics and the four apps.

Each card in **recent** has a menu with **rename**, **duplicate** and **delete**. A document's card also has **make a deck**.

## Docs

Long-form writing. Select text to rewrite, shorten, expand, fix the grammar or change its tone, or ask the model to continue or draft. Export a document as Markdown, Word or PDF.

## Deck

Slide decks with four layouts (title, title and bullets, two columns, quote), speaker notes and five themes: **Graphite**, **Paper**, **Obsidian**, **Ember** and **Glacier**. Present full screen, or export as PowerPoint, PDF or Markdown.

### A deck from a document

Turn a Docs document into a deck: choose **New Relic** › **Deck from a document**, or **make a deck** in a document's card menu.

1. Pick the document and a theme.
2. Click **Make slides**.

With a model loaded, the model writes the slides: a title slide, then short points that follow the document's headings, with speaker notes. The dialog counts the slides as they arrive. **stop** keeps the slides written so far.

With no model loaded, the slides follow the document's headings: the title and first sentence make the title slide, each top-level heading makes a slide, and its list items and first sentences become the points.

The new deck opens when it's ready. The document isn't changed.

## Grid

Spreadsheets with formulas, CSV and XLSX files, and a model that fills, cleans and charts columns.

## Design

Pages and graphics made from a prompt, or from a chat's Relic with **Open in Studio**. Each change is a new version; step through them with the arrows. **Preview** shows the page live and **Code** shows its source. **Copy** and **Download** work on the version shown.

### Export to code

**Export to code** turns the version shown into source files in the folder open in the [IDE](ide.md).

- **React component**: a `.jsx` component and its `.css` file. The page's script runs in an effect after the component mounts. The default folder is `src/components/<Name>`.
- **HTML and CSS**: `index.html` with `styles.css` and `script.js` beside it.

Images embedded in the page become files in an `assets` folder next to the code. Fonts or scripts the page loads from the web, such as Google Fonts, are listed when the export finishes; add them to your project yourself.

If no folder is open in the IDE, the dialog offers to open one. Bouncer writes only inside that folder. If a file it would write already exists, it lists the file and asks before replacing it. **Open in the IDE** opens the component, or `index.html`, in a tab.

## Related

- [Chat](chat.md): Relics that open beside a chat
- [IDE](ide.md): where exported code goes
- [Models](models.md): load a model for Studio's writing actions
