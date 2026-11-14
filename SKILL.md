---
name: qtdao-entity-generator
description: Generate QtDao entity C++ code from a qtdao entity XML configuration (root element <dao db="sqlite|mysql|sqlserver|psql">). Use whenever context confirms a file is a qtdao entity config and its entity classes are needed — invoke this skill and run the bundled CLI instead of writing entity .h/.cpp class code by hand.
---

# QtDao entity generator

Generates QtDao entity sources from an entity XML configuration. The
generator logic and EJS templates come from the vscode-qtdao extension with
its UI layer replaced by a small console notifier (`src/notifier.ts`); a
bundled self-contained CLI (`dist/cli.js`) runs them.

## When to use

Use this skill as soon as the context establishes that a file is a qtdao
entity XML: the root element is `<dao>` with a `db` attribute of `sqlite`,
`mysql`, `sqlserver` or `psql`, containing `<tb name="...">` tables of
`<item name="..." type="..."/>` fields. Then generate the entity code with the
CLI instead of writing or editing entity class files manually. If the file
turns out not to be a valid qtdao config, the CLI fails with exit code 1 and
an `[error]` message — report that failure rather than producing entity code
by hand.

## Generate

```bash
node "<skill-dir>/dist/cli.js" "<path-to-entity.xml>"
```

Only Node.js is required; `dist/cli.js` bundles all dependencies. The XML
stays where it is and all output is written next to it, exactly like the
extension command "create entity for qtdao":

- `<table>.h` / `<table>.cpp` — one pair per `<tb>` table
- `<db>entityinclude.h/.cpp` — delegate registration (`EntityDelegate_<hash>`)
- `entity.pri` and `entity.cmake` — shared build file lists, overwritten by
  the most recent generation, regardless of database type

Console output classifies every outcome:

- `[info] Generated successfully!` — generation ran, files were written
- `[warning] No changed!` — output files already match, nothing written (the
  writer compares MD5 hashes first)
- `[error] XML Error:<message>` — malformed XML; the message carries `Line:`
  and `Column:` of the syntax error
- `[error] Parse Error:<context><message>` — semantic problem in the XML; the
  context names the exact element, e.g. `Parse Error:table 'User', item #3:
  attribute not found:default`. Structural gaps are reported as
  `no 'tb' element found in dao!`, `no 'item' element found in tb!`,
  `no 'field' element found in index!`,
  `no 'field' element found in foreignkey!`, `tb name is empty!`,
  `item name is empty!` — an `tb`/`item` without a name is rejected, not
  silently skipped
- `[error] Template Error:<message>` — internal template failure, not caused
  by the XML

Exit codes: `0` generated or up to date, `1` any XML/template error reported,
`2` usage error (missing file, missing argument). Generated files carry a
UTF-8 BOM and CRLF line endings by design — do not strip or "fix" them, and
do not reformat generated files in any way.

When an error must be diagnosed against the XML, read
[xml-format.md](references/xml-format.md) for the element and attribute
reference.

## Constraints

- Never hand-write entity class code or patch generated files; regenerate
  them with the CLI instead.
- Do not edit `templates/` or the generator logic in `src/`: they come from
  the vscode-qtdao extension and must stay consistent with that version, or
  generated output drifts from what the extension produces. The only
  intended differences from the extension sources are the `notifier.ts`
  reporting module, richer XML error reporting and the removed UI plumbing.
  When the extension changes, re-apply the same adaptations to its `src/`
  and copy its `templates/` over again, then rebuild with
  `npm install && npm run build` (output goes to `dist/cli.js`).
- `--templates <dir>` can point the CLI at another template directory; leave
  it unset to use the bundled ones.
