[TODO]

## Presets & Groups

Presets allow to override default module variables and define new ones. Presets are defined on the module level and can be enabled independently.

Important! If several presets override the same variable, the result is unpredictable and undefined

Presets can be grouped, with only one preset in the group being active. If another preset in group is enabled, the previously enabled one disabled automatically.

Groups and presets allow for granular “profiles” implementations, for example for setups for different OS, secrets configs, etc.


