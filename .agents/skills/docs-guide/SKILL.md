---
name: docs-guide
description: Use this guide to navigate project docs with ease
---

Project's manually written docs are stored at `docs/`.

- `commands.md` -- describes all the commands of the CLI tool, their purpose and arguments.
- `condlict-resolution.md` -- describes rules of resolving conflicts that occur in CLI flows. For example, how this tools handled situation when 2 modules define their own version of certain file, or when some compiled file can't be synlinked to its target location because similar file already exists there.
- `core-logic.md` -- describes all the core logic and main flows of the CLI.
- `modules.md` -- describes what "modules" are, how they work and how they are implemented in this CLI tool.
- `presets-and-groups.md` -- describes presets and preset groups functionality, its rules and limitations.
- `snippets.md` -- describes "snippets" functionality, that allows to define reusable text parts that can be imported in templates.
- `templates.md` -- describes "templates", which are the heart of the tool. Templates are compiled to the files that are later synlinked across the host filesystem.
- `used-technologies.md` -- lists all the technologies used by our CLI tool and their purpose.
- `variables.md` -- describes "variables" functionality, which allows to defined module-scoped variables and use them inside templates.

**Important!**: Pay attention that not all the feature described in docs may be already implemented. `docs/` describes how the project *should* look and work like, not its current state.
Also, some of the docs may be yet unfinished.
