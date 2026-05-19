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

Variables also can be used in the module's `manifest.yaml` to enable/disable certain templates for the compilation.

[TODO: Probably we shouldn't have main.yaml and just read from all the yaml files in variables/. I just can't figure out the purpose of the importing mechanism, since all of the files has to be imported in the main one, and order of resolution of similar variables is undefined]

Variables are stored in the YAML files in `~/.moth/<MODULE_NAME>/variables/`. All the files from it should be considered to be read simulaneously, therefore if several YAML files define the value for the same variable, the final value in this case can't be reliably predicted.

Variable values can be overriden by currently enabled module presets (refer to `docs/presets-and-groups.md` for more information). Those values have higher precedence than original values from `variables/`.

## Important: resolution order
When importing variable files inside `variables/` and using presets, order in which values of variables with the same name are resolved is not guaranteed. However, it's guaranteed that preset values have higher precedence.
For example, if variable `A` is defined in `variables/main.yaml`, `variables/additional.yaml`, `variables/other.yaml`, the behavior is considered undefined and value of `A` can't (and shouldn't) be predicted.

However, if at the same time presets `preset-one` and `preset-two` also both override the value of `A` and both of these presets are enabled, it's guaranteed that `A` takes the value from one of the presets, but an order of resolution of presets is also undefined, therefore it may take value from `preset-one` as well as from `preset-two`, but **not** from `main.yaml`, `additional.yaml` and `other.yaml`.

[TODO: needs an example of variables file and advanced variables usage, including nested objects]
