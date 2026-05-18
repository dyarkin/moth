---
name: find-docs-inconsistencies
description: Use when it's requested to patch docs to account for the certain code changes
---

This project has an extensive documentation at `docs/` dir, that covers all the logic that the CLI tool implements.
But since code may change and docs become outdated, we need to update them properly.

When user asks to update docs, you must scan for all the potential places that need to reflect new places, and create a list with them for the user, with your proposals of how you would change them.
After that, only after user approves, you should apply those changes.
