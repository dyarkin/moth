[NOT FINISHED]

## Templates

Any target source file in the module is called a template. Templates allow to:

- Have conditional parts basing on the variables currently set in the module
- Import snippets as text parts

Templates are further compiled into read-only files in `.compiled` within the module, then those compiled templates used to compose final files in root `.compiled`, and then from there symlinked to their target directions.

