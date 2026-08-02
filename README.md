# Moth

CLI tool for managing and composing config files.

Your dotfiles live in one directory (`~/.moth`). Moth renders them from templates, fills in values that differ per machine, and symlinks the results into the places programs actually read them from.

## Why

Keeping dotfiles in a git repo and symlinking them works until the same file needs to differ per machine: work email in `.gitconfig`, a different shell prompt on the server, macOS vs Linux paths. You end up with forked copies, `if` blocks in shell scripts, or manual edits after every clone.

Moth splits each config into a template plus the values it needs. The template is shared; the values are swapped by enabling a *preset*.

## The main use case

One `.gitconfig` template:

```ini
[user]
  name = {{ user.name }}
  email = {{ user.email }}
```

Base values in `~/.moth/git/variables/main.yaml`:

```yaml
user:
  name: Example User
  email: user@personal.com
```

A preset in `~/.moth/git/presets/work.yaml` that overrides just the email:

```yaml
user:
  email: user@company.com
```

On the work laptop:

```sh
moth module git preset enable work
moth sync
```

`~/.gitconfig` is now a symlink to a file rendered with the work email. On the personal machine you skip that command and get the personal one. Same template, same repo, no branches.

Presets can also be grouped, so only one of them is active at a time — put `presets/os/macos.yaml` and `presets/os/linux.yaml` next to each other, and enabling one disables the other.

## Install

Install script (macOS and Linux):

```sh
curl -fsSL https://raw.githubusercontent.com/dyarkin/moth/main/install.sh | sh
```

It installs into `~/.local/bin`. Set `MOTH_INSTALL_DIR` to install elsewhere, or `MOTH_VERSION=v0.1.0` to pin a version.

Homebrew:

```sh
brew install dyarkin/tap/moth
```

Manual: download the archive for your platform from [Releases](https://github.com/dyarkin/moth/releases), unpack it, and move `moth` onto your `PATH`. The macOS binaries are not notarized, so a browser-downloaded copy is blocked by Gatekeeper until you clear the quarantine flag:

```sh
xattr -d com.apple.quarantine moth
```

To upgrade, re-run the install script or `brew upgrade moth`. To uninstall, `rm ~/.local/bin/moth` or `brew uninstall moth`.

## Quick start

Manage `~/.gitconfig` end to end:

```sh
moth module init git
```

That creates a module — one independent config package:

```text
~/.moth/git/
  manifest.yaml
  templates/
  variables/
  presets/
  snippets/
```

Tell Moth where this module's files land, in `~/.moth/config.yaml`:

```yaml
moduleRoots:
  git: ~
```

So `templates/.gitconfig` becomes `~/.gitconfig`. Write the template and the variables (as shown above), then:

```sh
moth sync
```

`sync` renders every template with the module's variables and enabled presets, collects the results into `~/.moth/.compiled`, and symlinks each one to its target path.

Nothing is overwritten: if `~/.gitconfig` already exists and Moth does not manage it, `sync` reports a conflict and leaves the file alone. Move your existing file into the module first.

## How it fits together

- **Moth root** — `~/.moth`, holds every module and Moth's own state.
- **Module** — one config package, e.g. `git`, `shell`, `nvim`. Enabled, compiled, and applied independently.
- **Template** — a source file that becomes a real config file once its placeholders are filled in.
- **Variables** — YAML values used by templates.
- **Preset** — extra YAML that overrides variables while it is enabled.
- **Snippet** — reusable template text that other templates include.
- **Sync** — render, collect, symlink.

## Commands

```text
moth module list                                 list modules
moth module init <module>                        create a module skeleton
moth module <module> vars                        print merged variables
moth module <module> templates tree              print the template tree
moth module <module> preset enable <preset>      enable a preset
moth module <module> preset disable <preset>     disable a preset
moth compile <module> | --all                    render templates only
moth sync                                        compile, prepare, apply
moth sync --prepare-only                         stop before symlinking
moth sync --no-compile                           reuse existing rendered files
moth apply                                       symlink an already prepared tree
```

## Docs

Full docs: [dyarkin.github.io/moth](https://dyarkin.github.io/moth/), or read the same pages in [`docs/`](docs/) — [getting started](docs/getting-started.md), [configuration](docs/configuration.md), [modules](docs/modules.md), [templates and variables](docs/templates.md), [presets](docs/presets.md), [sync and conflicts](docs/sync-and-conflicts.md), [command reference](docs/commands.md).

Design and development notes live in `dev-docs/`. Building, releasing, and other contributor topics live in [`CONTRIBUTING.md`](CONTRIBUTING.md).
