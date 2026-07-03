# Core Logic

Main tool's directory is `~/.moth/` dir, where it stores all the modules and configs.

Each directory in `~/.moth/` is considered a separate module (refer to `dev-docs/modules.md` for more information on the modules purpose). `~/.moth/config.yaml` contains an information about the target locations where each module has to be "stowed" to (in terms of GNU Stow). It is also supposed to contain the rules of conflict resolution between modules and other configs, which are not yet defined.

Also `~/.moth/` contains a `.compiled/` dir, that is created after compiling any module (and persists after that, though the content changes). It combines compiled files from all the modules that are currently enabled for syncing with already calculated paths (using info from `config.yaml`). In other words, `~/.moth/.compiled/` is a main target of all compiled modules before they are stowed, and `.compiled` replicates the structure of file system to preserve templates locations.

After `.compiled` is prepared, `moth` creates symlinks to the compiled files in the target locations in a GNU Stow fashion.
**Important**: we **do not** create symlinks entire dirs -- only specific files. It makes files management simpler and helps with conflict resolution if directory is already exists in the filesystem or if the other module also competes for this dir.

If file with the same name already exists in the target direction, error is thrown. More details in "Conflict Resolution" section.
Compiled files must be read only to prevent accidental editing of compiled file directly.

Also `~/.moth/` should store some "state" file about what symlinks are currently "controlled" by the tool (basically it's a serialized state of the `~/.moth/.compiled/` dir before the last sync). It's needed to remove "zombie" symlinks from the system that do not point to any file anymore before every sync.
**Important!**: some other logic without explicit "tracking" file can be used, probably smth like deleting existing symlinks before the syncing and recreating only needed ones after recocmpiling.
