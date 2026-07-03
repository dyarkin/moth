---
title: Moth Usage Docs
---

# Moth

Moth manages configuration files from one central directory.

Instead of editing files directly in many places like `~/.gitconfig` or `~/.config/nvim/init.lua`, you describe those files in Moth modules. Moth renders templates, prepares the final files, and symlinks them into their real target locations.

These docs describe the functionality currently implemented in the codebase.

## Mental Model

The basic flow is:

1. Put modules in the Moth root, usually `~/.moth`.
2. Put templates inside each module.
3. Put variables and presets beside those templates.
4. Compile templates into final files.
5. Combine compiled module files into one root `.compiled` tree.
6. Apply that tree by creating symlinks at the real target paths.

## Main Concepts

- Moth root: the directory where Moth stores all modules and state. Default: `~/.moth`.
- Module: one independent config package, for example `shell`, `git`, or `nvim`.
- Template: a source file that becomes a real config file after variables are rendered.
- Variable: YAML data used inside templates.
- Preset: optional YAML data that overrides module variables when enabled.
- Snippet: reusable template text that can be inserted into other templates.
- Sync: the operation that compiles, combines, and applies config files.

## Read Next

- [Getting started](getting-started.md): build one complete module from scratch.
- [Configuration](configuration.md): configure where modules are applied.
- [Modules](modules.md): understand module layout and commands.
- [Templates, variables, and snippets](templates.md): understand how files are generated.
- [Presets](presets.md): switch variable sets for different machines or environments.
- [Sync and conflicts](sync-and-conflicts.md): understand compile, prepare, apply, and safety rules.
- [Command reference](commands.md): quick command list.

## Command Notation

Examples use `moth` as the command name. This repository does not currently define packaged installation instructions, so local execution depends on your development setup.
