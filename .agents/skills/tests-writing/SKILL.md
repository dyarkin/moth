---
name: tests-writing
description: Use when need to write/edit any tests
---

Tests must be implemented/edited only when it's directly requested by the user.

# Project structure
Tests are stored at `tests/` dir at the root of the project. We **do not** place any tests within `src` dir.

All tests are splitted across `tests/unit/` and `tests/e2e/` for unit tests and end-to-end tests respectively.

Inside `unit/` and `e2e/` we also split tests across `core/`, `lib/` and `shared/` dirs, depending what layer the tested code comes from.
`e2e` tests not necessarily should belong to any of those layers if they cover the entire flows.

Generally, we prefer keeping test files small and split them by function/flow, but tests for several related functions can be placed in the single file.

However, for unit tests, strictly: one test suite per one function.

# Tests writing rules
You must follow these rules while implementing tests:
- **Atomicity** -- tests must be atomic, each test case must cover one thing/flow.
- **No bloat** -- tests implementation must be kept clean, simple, readable and easily maintained. Do not overengineer them.
- **Cover business logic** -- when implementing tests, you must not only cover the current existing implementation, but the actual target logic as well. If business logic is unclear, you must ask user for the clarification first.

