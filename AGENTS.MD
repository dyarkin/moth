# Context
CLI config management tool `moth` provides a single interface for managing all the config files on the PC by utilizing a versatile templates rendering system and symlinks similar to GNU Stow.

It features the following functionality (not all of that may be yet implemented):
- Splitting all configs into independant "modules"
- Compiling config files from "templates", with variables interpolation
- Saving module variables in dedicated `.yaml` files.
- "Presets" that allow to switch between different sets of variables and values.
- "Preset groups" that allow to enabled only one preset in group, disabling another already enabled one, which brings an ability to create multi-layer and versatile configs, usable between machines and environments.

For more information on project purpose, ideas and features, refer to `docs/`, however, not everything there may be implemented at this point, so use it as description of our intent.

You may also refer to `ROADMAP.md` to see the development milestones and their goals.

# Project structure
Project is split into several layers:
- `core`
- `lib`
- `shared`

## `core`
`core` layer is meant to all the main logic of the tool, related to the main features. Ideally, we should have a module pear each significant and somewhat independant part of the logic.
For example, separate module for the templates processing, separate one for the variables logic, another one for symlinks engine and yet another one for working with tool's main `.moth` dir.

## `lib`
`lib` is supposed to be a layer with project-agnostic code, like helpers, util, etc. Ideally, it should be maintained in the way that it can be just moved to a different project without breaking any logic.

## `shared`
`shared` is supposed for the code that is not project-agnostic, but rather simple and can be reused across many places of the codebase. For example, custom errors, logging etc.


# Project Code Style Rules
This rules are non-negotiables and must be followed all the time:
- **KISS**: Keep It Simple, Stupid. Implementation must be simple and straight to the point
- **No bloat**: Do not overcomplicate code with excessive checks, validations, fallbacks, etc., especially when data in the piece of code in question is already clean.
- In imports use aliases from `tsconfig` instead of using `../`

# Non-Negotiable Rules
- **Never** change any files from `docs/` dir. If you fine errors or inconsistensies in it, let the user know, but never change anything without a direct command to do that.
