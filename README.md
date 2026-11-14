# qtdao-entity-generator

Agent skill wrapping the [vscode-qtdao](../vscode-qtdao) entity generator as
a standalone CLI (this repository, `vscode-qtdao-skill`). A qtdao entity XML
configuration describes database tables; the skill generates the matching
QtDao entity C++ sources next to the XML. The generator logic is reused from
the extension with only its UI layer replaced.

## Layout

- `SKILL.md` — agent skill definition: trigger conditions, usage, error taxonomy
- `dist/cli.js` — self-contained CLI bundle (Node.js only, no dependencies to install)
- `src/`, `templates/` — the extension's TypeScript sources and EJS
  templates; `src/notifier.ts` replaces the extension's VS Code UI layer
  with console reporting
- `cli.ts` — CLI entry (argument parsing, exit codes)

## Build

```bash
npm install
npm run build
```

Webpack bundles the generator with `ejs` and `xml2js` into `dist/cli.js`.

## Usage

```bash
node dist/cli.js <entity.xml>
```

Generates the entity files next to the XML. See `SKILL.md` for exit codes and
the error classification.
