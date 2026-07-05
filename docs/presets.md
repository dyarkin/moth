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

Changing enabled presets changes local state only. Run `moth sync` to recompile and apply files with the new values.

## Ungrouped Presets

Ungrouped presets are independent. Multiple ungrouped presets can be enabled at the same time.

Create a preset file:

```text
~/.moth/git/presets/work.yaml
```

Example content:

```yaml
user:
  name: Example User
  email: user@company.com
```

Because merging is shallow, repeat sibling values you still need when a preset overrides an object.

Enable it:

```sh
moth module git preset enable work
```

Disable it:

```sh
moth module git preset disable work
```

Inspect the result:

```sh
moth module git vars
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

Only one preset from the same group can be enabled at a time. Presets from different groups can be enabled together.

Supported preset name formats:

- `work`
- `os/macos`

Nested groups such as `os/macos/arm` are not supported.

## Example: OS and Environment

Base variables:

```yaml
paths:
  shellPrefix: /usr/local/bin
profile:
  editor: vim
```

`presets/os/macos.yaml`:

```yaml
paths:
  shellPrefix: /opt/homebrew/bin
```

`presets/env/work.yaml`:

```yaml
profile:
  editor: nvim
```

Enable both dimensions:

```sh
moth module shell preset enable os/macos
moth module shell preset enable env/work
```

The enabled presets are recorded locally, and templates use the merged variables on the next compile or sync.

## Merge Rules

Preset files have the same YAML shape as variable files.

Merging is shallow. If two enabled presets define the same top-level key, the final value is not something you should rely on. Avoid enabling presets that compete for the same top-level variable unless they are in the same group and therefore mutually exclusive.

If a preset overrides an object, it replaces that top-level object. Repeat the whole object in the preset or keep independently overridden values under separate top-level keys.

Prefer clear ownership, for example:

- `os/*` owns `os` or `paths` variables.
- `env/*` owns `account` or `profile` variables.
- `theme/*` owns `theme` variables.

## Presets and Compilation

Changing enabled presets does not directly update target files.

After changing presets, run:

```sh
moth sync
```

This recompiles templates with the currently enabled presets and applies the new result.
