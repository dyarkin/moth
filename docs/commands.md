---
title: Command Reference
---

# Command Reference

Examples use `moth` as the command name.

## `moth module list`

Lists modules in the Moth root.

```sh
moth module list
```

Only non-hidden directories directly inside the Moth root are listed.

## `moth module init <moduleName>`

Creates a module skeleton with `manifest.yaml`, `templates/`, `variables/`, `presets/`, and `snippets/`.

```sh
moth module init git
```

The command fails if a module with the same name already exists.

## `moth module <moduleName> vars`

Prints the merged variables for a module as YAML.

```sh
moth module git vars
```

This includes base variables and currently enabled presets.

## `moth module <moduleName> templates tree`

Prints the module template tree as YAML.

```sh
moth module git templates tree
```

Use this to confirm which template files Moth sees.

## `moth module <moduleName> preset enable <presetName>`

Enables a preset for a module.

```sh
moth module git preset enable work
moth module shell preset enable os/macos
```

Preset name formats:

- `<preset>` for ungrouped presets.
- `<group>/<preset>` for grouped presets.

The command fails if the preset file does not exist.

## `moth module <moduleName> preset disable <presetName>`

Disables a preset for a module.

```sh
moth module git preset disable work
moth module shell preset disable os/macos
```

Disabling a preset updates local module state. Run `moth sync` to apply generated file changes.

## `moth compile <moduleName>`

Compiles one module into:

```text
~/.moth/<moduleName>/.compiled
```

Example:

```sh
moth compile git
```

This renders templates with variables, enabled presets, and snippets. It does not apply symlinks.

## `moth compile --all`

Compiles all modules.

```sh
moth compile --all
```

`compile --all` cannot be combined with a module name.

## `moth sync`

Runs the full workflow: compile modules, prepare root `.compiled`, and apply symlinks.

```sh
moth sync
```

Options:

- `--prepare-only`: prepare `~/.moth/.compiled` without applying symlinks.
- `--no-compile`: use existing module `.compiled` directories.

Examples:

```sh
moth sync --prepare-only
moth sync --no-compile
moth sync --prepare-only --no-compile
```

## `moth apply`

Applies symlinks from the already prepared root `.compiled` directory.

```sh
moth apply
```

Use this after `moth sync --prepare-only` when you have inspected the prepared output and want to apply it.

## Help

Print root help:

```sh
moth --help
```

Print command-specific help:

```sh
moth <command> --help
```
