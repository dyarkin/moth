# Moth

CLI tool for managing and composing config files.

## Installation

Install script (macOS and Linux):

```sh
curl -fsSL https://raw.githubusercontent.com/dyarkin/moth/main/install.sh | sh
```

It installs into `~/.local/bin`. Set `MOTH_INSTALL_DIR` to install elsewhere, or
`MOTH_VERSION=v0.1.0` to pin a version.

Homebrew:

```sh
brew install dyarkin/tap/moth
```

Manual: download the archive for your platform from
[Releases](https://github.com/dyarkin/moth/releases), unpack it, and move `moth`
onto your `PATH`. The macOS binaries are not notarized, so a browser-downloaded
copy is blocked by Gatekeeper until you clear the quarantine flag:

```sh
xattr -d com.apple.quarantine moth
```

To upgrade, re-run the install script or `brew upgrade moth`. To uninstall,
`rm ~/.local/bin/moth` or `brew uninstall moth`.

## Commands

For user-facing usage docs, see `docs/`.

Design and development docs live in `dev-docs/`.

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
