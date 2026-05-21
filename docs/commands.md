[NOT FINISHED]

## Implemented Commands

### `moth modules`

Lists module directories in moth dir.

Behavior:
- Prints one module name per line.
- Ignores hidden directories (names starting with `.`).
- If moth dir does not exist or has no modules, prints:
  - `No modules found in <MOTH_DIR_PATH>`

Example:

```sh
bun src/main.ts modules
```

### `moth module-init <moduleName>`

Creates a new module scaffold in moth dir.

Creates:
- `<moduleName>/manifest.yaml` (empty file)
- `<moduleName>/templates/` (empty directory)
- `<moduleName>/variables/` (empty directory)

Behavior:
- Ensures moth dir exists.
- Throws an error if a module with the same name already exists.

Example:

```sh
bun src/main.ts module-init zsh
```

### `moth module-vars <moduleName>`

Reads all variables files in the module and prints merged variables.

Behavior:
- Reads every `.yaml` file directly under `<moduleName>/variables/`.
- Merges all parsed YAML objects into one final variables object.
- Merge order is undefined.
- Prints merged variables as YAML to stdout.

Example:

```sh
bun src/main.ts module-vars zsh
```
