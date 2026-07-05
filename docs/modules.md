---
title: Modules
---

# Modules

A module is one independent group of config files.

Use modules to split configs by responsibility. For example:

- `git` for Git config.
- `shell` for shell config.
- `nvim` for Neovim config.

Each non-hidden directory directly inside the Moth root is treated as a module. Modules are isolated: a module uses only its own templates, variables, presets, snippets, and manifest.

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

`variables/` contains YAML files used while rendering templates and snippets.

`presets/` contains optional YAML files that override variables when enabled.

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

## Manifest

`manifest.yaml` can be empty. The implemented manifest feature is template roles.

Example for a module that owns `.zshrc`:

```yaml
templates:
  .zshrc:
    role: base
```

Example for a module that contributes text to a `.zshrc` owned by another module:

```yaml
templates:
  .zshrc:
    role: fragment
```

Template paths are relative to the module `templates/` directory.

Supported roles:

- `base`: default role. Only one base template can target the same final file.
- `fragment`: appended after the base when multiple modules contribute to the same final file.

Use fragments only for files that are safe to compose by appending text, such as shell startup files.

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

This prints the templates Moth sees in the module as YAML.

## Practical Module Boundaries

Keep a module responsible for one area of configuration. If two tools share one target file, such as `.zshrc`, keep one module as the base owner and use fragment templates from other modules only when appending is intentional.
