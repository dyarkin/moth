# CLI Commands

## Module Commands

### `moth module list`

Lists module directories in moth dir.

Behavior:
- Prints one module name per line.
- Ignores hidden directories.
- If moth dir does not exist or has no modules, prints `No modules found in <MOTH_DIR_PATH>`.

Example:

```sh
bun src/main.ts module list
```

### `moth module init <moduleName>`

Creates a new module scaffold in moth dir.

Creates:
- `<moduleName>/manifest.yaml`
- `<moduleName>/templates/`
- `<moduleName>/variables/`

Behavior:
- Ensures moth dir exists.
- Throws an error if a module with the same name already exists.

Example:

```sh
bun src/main.ts module init zsh
```

### `moth module <moduleName> vars`

Reads and prints merged module variables including enabled presets.

Example:

```sh
bun src/main.ts module zsh vars
```

### `moth module <moduleName> preset enable <presetName>`

Enables a preset for a module.

Example:

```sh
bun src/main.ts module zsh preset enable work
```

### `moth module <moduleName> preset disable <presetName>`

Disables a preset for a module.

Example:

```sh
bun src/main.ts module zsh preset disable work
```

### `moth module <moduleName> templates tree`

Prints the module `templates/` tree as YAML.

Example:

```sh
bun src/main.ts module zsh templates tree
```

## Compilation Commands

### `moth compile <moduleName>`

Compiles one module into its `.compiled` directory.

Example:

```sh
bun src/main.ts compile zsh
```

### `moth compile --all`

Compiles all modules into their `.compiled` directories.

Behavior:
- Cannot be combined with `<moduleName>`.

Example:

```sh
bun src/main.ts compile --all
```

## Apply And Sync Commands

### `moth apply`

Applies prepared root `.compiled` files to target paths.

Example:

```sh
bun src/main.ts apply
```

### `moth sync`

Compiles modules, prepares root `.compiled`, then applies it.

Example:

```sh
bun src/main.ts sync
```

### `moth sync --prepare-only`

Compiles modules and prepares root `.compiled`, but does not apply it.

Example:

```sh
bun src/main.ts sync --prepare-only
```

### `moth sync --no-compile`

Prepares and applies root `.compiled` without recompiling modules first.

Example:

```sh
bun src/main.ts sync --no-compile
```

### `moth sync --prepare-only --no-compile`

Prepares root `.compiled` without recompiling modules first, but does not apply it.

Example:

```sh
bun src/main.ts sync --prepare-only --no-compile
```

## Help Commands

### `moth --help`

Prints root help.

### `moth <command> --help`

Prints command-specific help.
