[NOT FINISHED]

# Presets & Groups

Presets allow to override default module variables and define new ones. Presets are defined on the module level and can be enabled independently.

**Important!** If several presets override the same variable, the result is unpredictable and undefined

Presets are stored under `~/.moth/<MODULE_NAME>/presets/` as YAML files, with file name considered preset's name.
For example, `~/.moth/<MODULE_NAME>/presets/macos-env.yaml` defines a preset with name `macos-env`.

Preset files are structured in the exact same way as variable files, refer to `docs/variables.md` for more information.

Presets can be grouped, with only one preset in the group being active. If another preset in group is enabled, the previously enabled one disabled automatically.

Groups and presets allow for granular “profiles” implementations, for example for setups for different OS, secrets configs, etc.

For example, here is how user can create a group of presets for different OS:
- `~/.moth/<MODULE_NAME>/presets/os/windows.yaml`
- `~/.moth/<MODULE_NAME>/presets/macos-arm.yaml`
- `~/.moth/<MODULE_NAME>/presets/macos-x86.yaml`
- `~/.moth/<MODULE_NAME>/presets/linux.yaml`
Our presets logic guarantees that no more than one preset in this group can be active at any moment.

[TODO: what to do with preset names across groups? when all presets are located within a single `presets/` dir, it's guaranteed by the OS that names are unique, but in 2 different groups we may have 2 files with the same name. So probably we should include group name into preset name, and in example name of the first preset would be `os/windows`]
