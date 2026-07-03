[NOT FINISHED]

# Snippets

Snippets are reusable text parts that can be imported in templates, but snippets themselves are not compiled into the final stow-ready entries (because they are not stowed anywhere, but only used for imports).

Snippets are defined at the module level in `~/.moth/<MODULE_NAME>/snippets/`, and name of the file is considered to be the snippet's name.

[TODO: in this case we would allow `search-prompt.md` and `search-prompt.txt` to co-exist, but `search-prompt` name would be ambigous]
For example, `~/.moth/<MODULE_NAME>/snippets/search-prompt.md` defines a snippet with a name `search-prompt`.

The key feature of snippets are arguments that can be passed during the importing. These arguments are used in the same way as variables in templates.

Snippets allow for everything that templates do [TODO: probably forbid to use variables].

[TODO: example of using inside the template]
