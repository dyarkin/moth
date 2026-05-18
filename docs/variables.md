[NOT FINISHED]

# Variables

**Variables** allow to make the templates and the snippets dynamic depending on the environment.

Variables are scoped to the specific module and can be used inside templates and snippets in conditionals or just like a text:
```
{{ variableName }}
```

```
{% if numberVariable === 0 %}
...
{% endif %}
```
Variables are stored in the yaml files in `~/.moth/<MODULE_NAME>/variables/`. There should be a single `main.yaml` file that is being read by the tool, but it also can import other variable files in `variables/` dir.
**Note!**: The importing contract and logic is yet to be defined.
