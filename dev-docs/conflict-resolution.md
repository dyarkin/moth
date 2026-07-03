[NOT FINISHED]

# Conflict resolution

## Competing for the same target file
Naturally several modules may compete over the same bottleneck resources, like `.zshrc`, `.gitconfig`, etc.

Conflict resolution approach is critical in such cases and tool provides a definitive way to deal with them.

All templates fall under the one of 2 categories:

- “housing” templates — default
- “tenant” templates
    - probably add tenant type, like “append-only”

Several modules may have “tenant” templates of the same file. For example, modules A, B and C may have tenant-template of `.zshrc`, but out of all modules only one can have “housing” type.

When final file is compiled from templates, out of all modules housing-template content is always added first, and all the tenant templates then stacked on top of it (appended to the end, we probably should consider other "inserting" options later), order is not defined and can’t be relied on).

**Important!** There may be no module with housing template of a certain file. In that case all tenant templates will be just stacked one upon another. However, by default all templates by design are considered housing-type to avoid unexpected stacking of configs that can’t be stacked

## File already exists at the symlink target location
[TODO]
