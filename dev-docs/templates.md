[NOT FINISHED]

# Templates

Any target source file in the module is called a template. On sync stage templates are compiled into actual files which are later symlinked to their target locations. 

Main features of templates:

- Certain templates can be enabled or disabled for the compilation depending on module current variables values
- Templates can have conditional parts based on the variables currently set in the module
- Import snippets as text parts

All templates of the module are stored under `templates/` dir of this module, for example, at `~/.moth/<MODULE_NAME>/templates/`.

Templates are implemented using `nunjucks` package and therefore support all the nunjucks syntax.
**Important!** In context of our CLI tool we do not officially support all the features of `nunjucks` templating. For now, only variables interpolating, piping and conditionals are supported.

`~/.moth/<MODULE_NAME>/templates/` directory reflects a local structure of the location this module is supposed be linked to, similar to how GNU Stow modules work. 

Templates are further compiled into read-only files in `.compiled` within the module, then those compiled templates used to compose final files in root `.compiled`, and then from there symlinked to their target directions.

[TODO: MOVE TO A SEPARATE DOC, AND REFERENCE IN modules.md and this file]
For example
- `~/.moth/<MODULE_NAME>/templates/` contains dirs `A` and `B`, dir `B` has an internal dir `C`
- `<MODULE_NAME>` consists of three templates -- `alpha` inside `A`, `beta` inside `B` and `charlie` inside `C`
- After compilation, this relative structure of the dir is preserved in `~/.moth/<MODULE_NAME>/.compiled/`.
- When module is synced to `~/.../TARGET/`, the absolute path to compiled templates are created in `~/.moth/.compiled/`, with root of `.compiled` considered a home dir:
    - `~/.moth/.compiled/.../TARGET/A/alpha`
    - `~/.moth/.compiled/.../TARGET/B/beta`
    - `~/.moth/.compiled/.../TARGET/B/C/charlie`
- After that those compiled files from `~/.moth/.compiled` are symlinked to their locations in the actual filesystem.

