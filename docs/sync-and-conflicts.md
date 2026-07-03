---
title: Sync and Conflicts
---

# Sync and Conflicts

Sync is the workflow that turns modules into real config files.

## The Full Workflow

`moth sync` does three things:

1. Compiles each module's templates into that module's `.compiled` directory.
2. Combines all module `.compiled` directories into the root `~/.moth/.compiled` directory.
3. Applies symlinks from real target paths to files in the root `.compiled` directory.

This means the generated files remain owned by Moth, while your system sees them at their normal locations.

## Compile

Compile one module:

```sh
moth compile git
```

Compile all modules:

```sh
moth compile --all
```

Compilation renders templates with variables, enabled presets, and snippets.

Output example:

```text
~/.moth/git/.compiled/.gitconfig
```

Compiling does not create or change target symlinks.

## Prepare

Prepare without applying symlinks:

```sh
moth sync --prepare-only
```

This writes the root compiled tree:

```text
~/.moth/.compiled
```

Use this when you want to inspect generated files before changing target paths.

Skip recompilation and use existing module `.compiled` directories:

```sh
moth sync --no-compile
```

## Apply

Apply an already prepared root `.compiled` tree:

```sh
moth apply
```

`apply` creates symlinks at the target paths.

Example:

```text
~/.gitconfig -> ~/.moth/.compiled/<absolute-home-path>/.gitconfig
```

The exact path inside root `.compiled` mirrors the absolute target path.

## Target State

Moth records managed symlinks in:

```text
~/.moth/.targets.local.yaml
```

This lets Moth remove obsolete symlinks later, but only when they still point to the source Moth previously managed.

## Conflict Behavior

Moth is conservative.

It refuses to overwrite:

- Existing regular files.
- Existing directories.
- Symlinks pointing somewhere unexpected.
- Previously managed symlinks that were changed outside Moth.

If a conflict is found, Moth reports it instead of guessing what to delete.

The usual fix is to inspect the target path, move or remove the conflicting file yourself, and run `moth sync` again.
