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

## Template Syntax

Moth renders templates with Nunjucks.

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

Variables live in `.yaml` files under:

```text
~/.moth/<module>/variables
```

Example:

```yaml
user:
  name: Example User
  email: user@example.com
```

Variables are available directly in templates:

```text
{% raw %}
{{ user.name }}
{% endraw %}
```

Moth reads all `.yaml` files in the module variables directory and merges them. Enabled presets are merged after base variables, so preset values override base values.

Current merging is shallow. If two files define the same top-level key, one value replaces the other. Prefer keeping each top-level key owned by one variable file.

## Snippets

Snippets live in:

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

You can pass extra values to a snippet:

```text
{% raw %}
{{ snippet("section", { title: "Editor" }) }}
{% endraw %}
```

Snippet arguments override variables with the same name while rendering that snippet.

## Template Roles

Template roles matter when multiple modules produce the same target path.

By default, every template is a `base` template. A target path can have only one base contribution.

You can mark a template as a `fragment` in that module's `manifest.yaml`:

```yaml
templates:
  .config/example.conf:
    role: fragment
```

If another module contributes a base template to the same final target path, Moth writes the base first and appends fragments after it.

If more than one base contribution targets the same file, Moth reports a conflict.
