# Moth

CLI tool for managing and composing config files.

## Moth Dir Resolution

By default, the tool root is resolved as `~/.moth`.

`src/shared/moth-dir/index.ts` supports build-time overrides only:

- `__MOTH_DIR_NAME__`
- `__MOTH_DIR_PATH__`

Resolution order:

1. `__MOTH_DIR_PATH__` (if replaced at build time)
2. `__MOTH_DIR_NAME__` (if replaced at build time, then joined with `homedir()`)
3. Default `.moth` (joined with `homedir()`)

Notes:

- Runtime `process.env` is intentionally not used for this.
- For test builds, inject/replace these constants in your build pipeline.

## Tests

Unit tests live under `tests/unit`.

- Run unit tests once:
  - `bun run test:unit`
- Run unit tests in watch mode:
  - `bun run test:unit:watch`
