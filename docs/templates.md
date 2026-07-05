---
title: Templates, Variables, and Snippets
---

# Templates, Variables, and Snippets

Templates describe what files Moth should generate. Variables provide data for those templates. Snippets let templates reuse shared text.

## Templates

Templates live in:

```text
~/.moth/<module>/templates
```

A template's path inside `templates/` is preserved in the final target path.

Example with this config:

```yaml
moduleRoots:
  git: ~
```

Template:

```text
~/.moth/git/templates/.gitconfig
```

Module compiled file:

```text
~/.moth/git/.compiled/.gitconfig
```

Final target path after sync:

```text
~/.gitconfig
```

Directories are preserved too. `templates/.config/tool/config.yaml` maps under the module root as `.config/tool/config.yaml`.

## Template Syntax

Moth renders templates with Nunjucks.

Common syntax:

```text
{% raw %}
{{ variableName }}

{% if enabled %}
value = {{ value }}
{% endif %}

{{ name | upper }}
{% endraw %}
```

Use Moth templates mainly for variable interpolation, filters, and conditionals. Other Nunjucks features may work because Nunjucks renders the files, but they are not the intended public surface yet.

Moth uses Nunjucks autoescaping. If a value must be inserted exactly, use the Nunjucks `safe` filter.

Example template:

```ini
{% raw %}
[user]
  name = {{ user.name }}
  email = {{ user.email }}
{% endraw %}
```

The `{% raw %}{{ ... }}{% endraw %}` parts read values from module variables.

## Variables

Variables live in `.yaml` files directly under:

```text
~/.moth/<module>/variables
```

Example:

```yaml
user:
  name: Example User
  email: user@example.com
features:
  starship: true
```

Variables are available directly in templates:

```text
{% raw %}
{{ user.name }}

{% if features.starship %}
eval "$(starship init zsh)"
{% endif %}
{% endraw %}
```

Moth reads all direct `.yaml` files in the module variables directory and merges them. Enabled presets are merged after base variables, so preset values override base values.

Current merging is shallow. If two files define the same top-level key, one value replaces the other. If you override part of an object, repeat the whole object or keep independently overridden values under separate top-level keys.

## Snippets

Snippets live as files directly under:

```text
~/.moth/<module>/snippets
```

The snippet name is the file name without extension.

Example file:

```text
~/.moth/shell/snippets/header.txt
```

Usage in a template:

```text
{% raw %}
{{ snippet("header") }}
{% endraw %}
```

Snippets are rendered with the same variables as templates:

```text
{% raw %}
# Managed for {{ user.name }}
{% endraw %}
```

You can pass extra values to a snippet:

```text
{% raw %}
{{ snippet("section", { title: "Editor" }) }}
{% endraw %}
```

Snippet file:

```text
{% raw %}
## {{ title }}
{% endraw %}
```

Snippet arguments override variables with the same name while rendering that snippet only.

Important snippet rules:

- Snippets are not compiled into standalone output files.
- Snippet names must be unique after removing the extension. `header.txt` and `header.md` conflict.
- Only direct files in `snippets/` are loaded.
- Moth removes one final line break from rendered snippet output, which makes inline snippet calls easier to control.

## Template Roles

Template roles matter when multiple modules produce the same target path.

By default, every template is a `base` template. A target path can have only one base contribution.

You can mark a template as a `fragment` in that module's `manifest.yaml`:

```yaml
templates:
  .zshrc:
    role: fragment
```

If another module contributes a base template to the same final target path, Moth writes the base first and appends fragments after it.

If there is no base template, Moth combines the fragments.

If more than one base contribution targets the same file, Moth reports a conflict.

When combining multiple contributions, Moth inserts a newline only when the previous part does not already end with one.

## Compile Output

Compile one module:

```sh
moth compile git
```

The output is written to:

```text
~/.moth/git/.compiled
```

Compilation replaces the module `.compiled` directory. It does not apply symlinks to target paths.
