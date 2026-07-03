[NOT FINISHED]

# Modules

Modules are isolated and independent sets of configs and variables, that can be imported as standalone repos by the user. Our `moth` tool is supposed manage those modules and convert them to real files in the filesystem.

Modules contain their own sets of templates, variables, presets and groups, and cannot communicate with other modules in any way.

Each module has the following structure:

[TODO: probably make manifest TOML to differentiate from variables files?]
- `manifest.yaml` -- description of the module, like types of templates (housing/tenant), whether certain files should be disabled with certain variables values, default enabled presets, etc.
- `templates/` -- directory with templates (for more details refer to `dev-docs/templates.md`)
- `variables/` -- directory with variables `.yaml` files (for more details refer to `dev-docs/variables.md`). This directory must **always** contain `main.yaml` file.
- `presets/` -- directory with presets `.yaml` files, which store variables and are meant to override variables imported from `variables/`. Each preset can be independently enabled/disabled, and the state of presets is stored at [WHERE?]. Preset names are defined my their file names.
- `presets/<GROUP_NAME>/` -- presets can be combined in groups under `presets` dir. In each group several presets can't be enabled simultaneosly, if one preset is enabled we disable the rest of presets in the same group automatically. It allows to build versatile configs for different environments, OS-s and other conditions where two presets can't be enabled at the same time. For more detailes refer to `dev-docs/presets-and-groups.md`.
- `snippets/` -- snippets are reused text parts of the templates, that can be imported in them. Unlike templates, snippets are not compiled into standalone final files. Snippets also can take some input arguments that can be used as regular variables. For more details refer to `dev-docs/snippets.md`
- `.state.local.yaml` — all temporary values, like currently enabled presets. **Note!**: This file is designed to store temporal local variables about the state of the module, however it's up to the user if this file should be commited. Default settings should be saved at `manifest.yaml`.

Technical files:

- `.compiled` -- final compiled templates of the module, before they are copied to the tool's root dir `.compiled` (refer to `dev-docs/templates.md` for more details).

## `manifest.yaml`
[TODO]

## Structure Validation
[TODO]
