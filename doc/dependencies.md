# Project Dependencies Documentation

This file explains the purpose of dependencies and any special notes and or reasons against updating.

## Runtime Dependencies (dependencies)

| Package | Purpose | Notes |
|---------|---------|------|
| flowbite-svelte | component library | currently locked at 1.29.1 as there is a bug in ^1.30.0 related to context on the NavBar component that crashes the app. [flowbite-svelte #1909](https://github.com/themesberg/flowbite-svelte/issues/1909)|


## Dev Dependencies (devDependencies)

| Package | Purpose | Notes |
|---------|---------|------|
| eslint| Linter | on v9, v10 is released but only a few day old (2/13) so let it be for now. |
