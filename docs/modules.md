---
title: Modules
---

# Modules

A module is one independent group of config files.

Use modules to split configs by responsibility. For example:

- `git` for Git config.
- `shell` for shell config.
- `nvim` for Neovim config.

Each non-hidden directory directly inside the Moth root is treated as a module.

## Create a Module

```sh
moth module init shell
```

Created layout:

```text
~/.moth/shell/
  manifest.yaml
  templates/
  variables/
  presets/
  snippets/
```

## Module Directories

`templates/` contains source files that become real config files.

`variables/` contains YAML files used while rendering templates.

`presets/` contains optional YAML files that can override variables when enabled.

`snippets/` contains reusable template fragments.

`manifest.yaml` contains module metadata. Currently it is used to configure template roles.

## Generated Files

Moth may create these files inside a module:

```text
~/.moth/shell/
  .compiled/
  .state.local.yaml
```

`.compiled/` contains rendered output for that module.

`.state.local.yaml` stores local module state, such as enabled presets.

## List Modules

```sh
moth module list
```

This lists non-hidden directories in the Moth root.

## Inspect Module Variables

```sh
moth module shell vars
```

This prints the variables Moth would use for the module after merging base variables and enabled presets.

## Inspect Module Templates

```sh
moth module shell templates tree
```

This prints the templates Moth sees in the module.
