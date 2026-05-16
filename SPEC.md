CLI config management tool `moth` provides a single interface for managing all the config files on the PC by utilizing a versatile templates rendering system and symlinks similar to GNU Stow.

# Key features

A lot of things listed here are plans and not yet implemented, so a lot can change.

## Core Logic
Tool operates with `~/.moth/` dir, where it stores all the modules and a config file.
Each directory in `~/.moth/` is a separate module (explained later). `~/.moth/config.yaml` contains information about the target locations where each module has to be "stowed" to (in terms of GNU Stow). It is also supposed to contain conflict resolution rules and other configs, which for now are not defined yet.

Also `~/.moth/` contains a `.compiled/` dir, that is created after compiling any module (and persists after that). It combines compiled files from all the modules that are currently enabled for syncing with already calculated paths (using info from `config.yaml`).

After `.compiled` is prepared, `moth` creates synlinks in the target dirs to compiled files in a GNU Stow fashion, but **without** stashing entire dirs -- only specific files. If file with the same name already exists in the target direction, error is thrown. More details in "Conflict Resolution" section.
Compiled files must be read only to prevent accidental editing of compiled file directly.

Also `~/.moth/` should store some "state" file about what symlinks are currently "controlled" by the tool (basically it's a serialized state of the `~/.moth/.compiled` dir before the last sync). It's needed to remove "zombie" symlinks from the system that do not point to any file anymore. 
**Important!**: some other logic without explicit "tracking" file can be used, probably smth like deleting existing symlinks before the syncing and recreating only needed ones after recocmpiling.

## Modules

Modules are isolated and independent sets of configs and variables, that can be managed as standalone repos. Repos contain their own sets of templates, variables and groups, and cannot communicate with other modules in any way.

We strictly forbid 2 moduless to override the same file and we prevent any sync operations if such conflict is detected (details in the respective section)

Each module has the following structure:

- `templates/`
- `variables/`
    - `variables/main.yaml`
- `snippets/`
- `presets/`
    - optional group dirs inside
    - yaml files with variables
- `manifest.yaml` — description of the module, like types of templates (housing/tenant)

Technical files:

- `.compiled` — compiled templates
- `.config.yaml` — all temporary values, like currently enabled presets

## Templates

Any target source file in the module is called a template. Templates allow to:

- Have conditional parts basing on the variables currently set in the module
- Import snippets as text parts

Templates are further compiled into read-only files in `.compiled` within the module, then those compiled templates used to compose final files in root `.compiled`, and then from there symlinked to their target directions.

## Conflict resolution

Naturally several modules may compete over the same bottleneck resources, like `.zshrc`, `.gitconfig`, etc.

Conflict resolution approach is critical in such cases and tool provides a definitive way to deal with them.

All templates fall under the one of 2 categories:

- “housing” templates — default
- “tenant” templates
    - probably add tenant type, like “append-only”

Several modules may have “tenant” templates of the same file. For example, modules A, B and C may have tenant-template of `.zshrc`, but out of all modules only one can have “housing” type.

When final file is compiled from templates, out of all modules housing-template content is always added first, and all the tenant templates then stacked on top of it (appended to the end, order is not defined and can’t be relied on).

Important! There may be no module with housing template of a certain file. In that case all tenant templates will be just stacked one upon another. However, by default all templates by design are considered housing-type to avoid unexpected stacking of configs that can’t be stacked

## Snippets

Snippets are reusable text parts that can be imported in templates, but snippers themselves are not transformed to final stow-ready entries (because they are not stowed anywhere, but only used for imports).

The key feature of snippers are arguments that can be passed during the importing. Thise arguments are used in the same way as variables in templates.

Snippets allow for everything that templates do (probably forbid to use variables).

## Variables

Variables allow to make templates and snippets dynamic depending on the environment.

Variables are set on the module level and can be used inside templates and snippets in conditionals or just like a text.

Variable files support importing as well, that can be used, for example, for storing secrets in a separate file that is not being commited

## Presets & Groups

Presets allow to override default module variables and define new ones. Presets are defined on the module level and can be enabled independently.

Important! If several presets override the same variable, the result is unpredictable and undefined

Presets can be grouped, with only one preset in the group being active. If another preset in group is enabled, the previously enabled one disabled automatically.

Groups and presets allow for granular “profiles” implementations, for example for setups for different OS, secrets configs, etc.

