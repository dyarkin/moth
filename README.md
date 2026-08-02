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

## Docs

For user-facing usage docs, see `docs/`.

Design and development docs live in `dev-docs/`.

Building, releasing, and other contributor topics live in `CONTRIBUTING.md`.
