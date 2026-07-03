---
title: Getting Started
---

# Getting Started

This guide creates one module that manages `~/.gitconfig`.

## 1. Create a module

```sh
moth module init git
```

This creates:

```text
~/.moth/git/
  manifest.yaml
  templates/
  variables/
  presets/
  snippets/
```

The module name is `git` because this module owns Git-related config.

## 2. Tell Moth where the module applies

Create `~/.moth/config.yaml`:

```yaml
moduleRoots:
  git: ~
```

`moduleRoots.git` means: files produced by the `git` module should be placed under the home directory.

With this root, a template named `.gitconfig` becomes the target path `~/.gitconfig`.

## 3. Create a template

Create `~/.moth/git/templates/.gitconfig`:

```ini
{% raw %}
[user]
  name = {{ user.name }}
  email = {{ user.email }}
{% endraw %}
```

This is almost the final config file, except `{% raw %}{{ user.name }}{% endraw %}` and `{% raw %}{{ user.email }}{% endraw %}` are placeholders.

## 4. Create variables

Create `~/.moth/git/variables/main.yaml`:

```yaml
user:
  name: Example User
  email: user@example.com
```

When Moth compiles the template, it replaces placeholders with these values.

## 5. Compile the module

```sh
moth compile git
```

This writes the rendered file to:

```text
~/.moth/git/.compiled/.gitconfig
```

At this point, no real config file has been changed yet.

## 6. Prepare the root compiled tree

```sh
moth sync --prepare-only
```

This combines all module outputs into one tree under:

```text
~/.moth/.compiled
```

For the example above, Moth prepares a file that corresponds to the final target `~/.gitconfig`.

## 7. Apply symlinks

```sh
moth apply
```

`apply` creates symlinks from target paths to files in `~/.moth/.compiled`.

You can also run the full workflow in one command:

```sh
moth sync
```

`moth sync` compiles modules, prepares the root `.compiled` tree, and applies symlinks.

## Safety

Moth does not overwrite existing files, directories, or unexpected symlinks. If `~/.gitconfig` already exists and is not managed by Moth, `apply` reports a conflict instead of replacing it.
