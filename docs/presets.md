---
title: Presets
---

# Presets

Presets are optional variable files that can be enabled or disabled per module.

Use presets when most of a module is shared, but some values change between machines, users, operating systems, or environments.

## How Presets Work

Base variables come from:

```text
~/.moth/<module>/variables/*.yaml
```

Presets come from:

```text
~/.moth/<module>/presets
```

When a preset is enabled, Moth merges its variables after the base variables. That means preset values override base values.

Enabled presets are stored in:

```text
~/.moth/<module>/.state.local.yaml
```

## Ungrouped Presets

Create a preset file:

```text
~/.moth/git/presets/work.yaml
```

Example content:

```yaml
user:
  email: user@company.com
```

Enable it:

```sh
moth module git preset enable work
```

Disable it:

```sh
moth module git preset disable work
```

## Grouped Presets

Grouped presets are useful when only one choice in a category should be active.

Example:

```text
~/.moth/shell/presets/os/macos.yaml
~/.moth/shell/presets/os/linux.yaml
```

Enable one option:

```sh
moth module shell preset enable os/macos
```

If `os/linux` was enabled before, Moth replaces it with `os/macos`.

Only one preset from the same group can be enabled at a time.

## Presets and Compilation

Changing enabled presets does not directly update target files.

After changing presets, run:

```sh
moth sync
```

This recompiles templates with the currently enabled presets and applies the new result.
