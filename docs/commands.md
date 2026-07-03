---
title: Command Reference
---

# Command Reference

## `moth module list`

Lists modules in the Moth root.

## `moth module init <moduleName>`

Creates a module skeleton with `manifest.yaml`, `templates/`, `variables/`, `presets/`, and `snippets/`.

## `moth module <moduleName> vars`

Prints the merged variables for a module as YAML.

This includes base variables and currently enabled presets.

## `moth module <moduleName> templates tree`

Prints the module template tree as YAML.

## `moth module <moduleName> preset enable <presetName>`

Enables a preset for a module.

Preset name formats:

- `<preset>` for ungrouped presets.
- `<group>/<preset>` for grouped presets.

## `moth module <moduleName> preset disable <presetName>`

Disables a preset for a module.

## `moth compile <moduleName>`

Compiles one module into:

```text
~/.moth/<moduleName>/.compiled
```

## `moth compile --all`

Compiles all modules.

## `moth sync`

Runs the full workflow: compile modules, prepare root `.compiled`, and apply symlinks.

Options:

- `--prepare-only`: prepare `~/.moth/.compiled` without applying symlinks.
- `--no-compile`: use existing module `.compiled` directories.

## `moth apply`

Applies symlinks from the already prepared root `.compiled` directory.
