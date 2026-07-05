---
title: Moth Usage Docs
---

# Moth

Moth is a CLI tool for managing config files from one central directory.

Instead of editing files directly in many target locations, such as `~/.gitconfig` or `~/.config/nvim/init.lua`, you keep source files in Moth modules. Moth renders those files, prepares final output, and symlinks it into the normal filesystem locations.

These docs describe the functionality currently implemented in the codebase.

## What Moth Does

Moth helps when you want to:

- Split configs into independent modules, such as `git`, `shell`, or `nvim`.
- Generate config files from templates and YAML variables.
- Reuse common template fragments with snippets.
- Switch values with presets, for example for `work`, `personal`, `macos`, or `linux`.
- Keep generated files in one managed tree and symlink them into real locations.

Moth is not a package manager. It does not install applications, dependencies, or plugins. It manages the config files you define.

## Mental Model

The basic flow is:

1. Create a Moth root directory, usually `~/.moth`.
2. Create modules inside it.
3. Put templates, variables, presets, and snippets inside each module.
4. Tell Moth where each module should apply files with `config.yaml`.
5. Compile module templates into module `.compiled` directories.
6. Combine module output into the root `.compiled` tree.
7. Apply that tree by creating symlinks at the real target paths.

## Main Concepts

Moth root: the directory where Moth stores modules, config, generated output, and local state. Default: `~/.moth`.

Module: one independent config package. A module cannot read variables, snippets, or presets from another module.

Template: a source file under `templates/` that becomes a real config file after rendering.

Variable: YAML data under `variables/` that templates and snippets can use.

Snippet: reusable template text under `snippets/` that can be inserted into templates.

Preset: optional YAML data under `presets/` that overrides base variables when enabled.

Preset group: a preset directory where only one preset can be enabled at a time, such as `os/macos` or `os/linux`.

Sync: the operation that compiles, prepares root output, and applies symlinks.

## Typical Directory Shape

```text
~/.moth/
  config.yaml
  git/
    manifest.yaml
    templates/
    variables/
    presets/
    snippets/
  shell/
    manifest.yaml
    templates/
    variables/
    presets/
    snippets/
```

Generated local files may also appear:

```text
~/.moth/.compiled/
~/.moth/.targets.local.yaml
~/.moth/<module>/.compiled/
~/.moth/<module>/.state.local.yaml
```

## Read Next

- [Getting started](getting-started.md): build one working module from scratch.
- [Configuration](configuration.md): configure the Moth root and module target roots.
- [Modules](modules.md): understand module layout and module commands.
- [Templates, variables, and snippets](templates.md): generate files and reuse template parts.
- [Presets](presets.md): switch variable sets for machines, environments, or operating systems.
- [Sync and conflicts](sync-and-conflicts.md): understand compile, prepare, apply, and safety rules.
- [Command reference](commands.md): quick command list.

## Command Notation

Examples use `moth` as the command name. This repository does not currently define packaged installation instructions, so local execution depends on your development setup.
