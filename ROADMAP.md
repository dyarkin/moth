## M1: Basic compiling functionality [CURRENT]

- CLI core
- Modules with templates, compiling inside the module
- Simple module-level variables in a single file
- Interpolating variables in templates

## M2: Symlink engine

- Symlinking files to their target locations
- Checking for conflicts during symlinking (when file already exists)
- Updating existing symlinks, removing already not existing ones

## M3: Multimodules support

- Combining compiled templates of several modules into a single `.compiled` collection
- Housing/tenants templates support
- Single resource conflicts resolution

## M4: Advanced variables support

- Multiple variables files in a module, with ability to import one file in another
- Identify cyclical imports
- Presets
- Presets groups

## M5: Snippets
