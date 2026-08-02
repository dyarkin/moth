# Contributing

## Moth Dir Resolution

By default, the tool root is resolved as `~/.moth`.

`src/shared/moth-dir/index.ts` supports both build-time and runtime overrides:

- `__MOTH_DIR_NAME__`
- `__MOTH_DIR_PATH__`
- `MOTH_DIR_NAME`
- `MOTH_DIR_PATH`

Resolution order:

1. `__MOTH_DIR_PATH__` (if replaced at build time)
2. `MOTH_DIR_PATH` (runtime environment variable)
3. `__MOTH_DIR_NAME__` (if replaced at build time)
4. `MOTH_DIR_NAME` (runtime environment variable)
5. Default `.moth`

Notes:

- Runtime `MOTH_DIR_PATH` should be an absolute path.
- `~` is not expanded automatically when read from `.env`.
- `MOTH_DIR_PATH` has higher priority than `MOTH_DIR_NAME`.
- For test builds, inject/replace these constants in your build pipeline.

## Building

- `bun run build` — compiles a binary for the current platform into `dist/moth`.
  Its `--version` reports `dev`.
- `bun run build:release` — compiles all four published targets, packs them into
  `dist/release/*.tar.gz`, and writes `dist/release/checksums.txt`.

## Releases

```sh
bun run release minor   # or patch / major
git push --follow-tags
```

`release` bumps the version in `package.json`, commits, and creates the matching
`v*` tag. Pushing the tag runs `.github/workflows/release.yml`, which typechecks,
lints, tests, builds the four targets, publishes the GitHub Release, and updates
the Homebrew formula in `dyarkin/homebrew-tap`.

The tag drives the version compiled into the binary; the build fails if it
disagrees with `package.json`.

## Tests

Unit tests live under `tests/unit`.

- Run unit tests once:
  - `bun run test:unit`
- Run unit tests in watch mode:
  - `bun run test:unit:watch`
