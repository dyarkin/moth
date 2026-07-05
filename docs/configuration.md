---
title: Configuration
---

# Configuration

Configuration tells Moth where its own data lives and where each module should apply files.

## Moth Root

The Moth root is the central directory containing modules, config, compiled output, and local state.

Default path:

```text
~/.moth
```

Runtime overrides:

- `MOTH_DIR_PATH`: path to the full Moth root.
- `MOTH_DIR_NAME`: directory name under the current user's home directory.

`MOTH_DIR_PATH` has higher priority than `MOTH_DIR_NAME`. Use an absolute path for `MOTH_DIR_PATH`; shell expansion of `~` depends on how you set the environment variable.

## Root Config

The root config file is:

```text
~/.moth/config.yaml
```

It currently defines `moduleRoots`:

```yaml
moduleRoots:
  git: ~
  nvim: ~/.config/nvim
```

Every module must have a `moduleRoots` entry before `moth sync` can prepare the root `.compiled` tree.

## Module Roots

A module root is the target directory where a module's compiled files are mapped.

Example:

```yaml
moduleRoots:
  git: ~
```

Template path:

```text
~/.moth/git/templates/.gitconfig
```

Target path:

```text
~/.gitconfig
```

Another example:

```yaml
moduleRoots:
  nvim: ~/.config/nvim
```

Template path:

```text
~/.moth/nvim/templates/init.lua
```

Target path:

```text
~/.config/nvim/init.lua
```

Module roots must resolve to absolute paths. In `config.yaml`, `~` and `~/...` are supported.

## Generated Root Files

Moth can create these files in the root:

```text
~/.moth/.compiled/
~/.moth/.targets.local.yaml
```

`.compiled/` contains the combined generated files before they are symlinked into target locations.

`.targets.local.yaml` records symlinks managed by Moth. This lets Moth remove obsolete symlinks safely when generated output changes.

## Minimal Config

A working config only needs one `moduleRoots` entry per module:

```yaml
moduleRoots:
  git: ~
  shell: ~
  nvim: ~/.config/nvim
```

Non-hidden directories directly inside the Moth root are treated as modules, so keep unrelated directories outside `~/.moth` or make them hidden.
