
## Dependencies

| Current Version | Dependency Name | Notes / Upgrade Considerations        |
|------|----------------|--------------------------------------|
| ^7.3.1 | vite | need to evaluate the changes. See #13
| 2.5.0 | @svar-ui/svelte-grid | Get and error when upgrading past 2.6.0 |
| 2.4.0 | @svar-ui/svelte-filter | upgrading past 2.5.0 creates build error |

## DevDependencies

| Current Version | Dependency Name | Notes / Upgrade Considerations        |
|------|----------------|--------------------------------------|
| ^6.2.4 | @sveltejs/vite-plugin-svelte | v7 available, requires vite v8 |
| ^9.39.4 | eslint | v10 is out but eslint-plugin-import doesn't officially support yet. not the most active project so give it a bit and see. then upgrade anyways.
| ^4.1.0 | vitest | |
| ^10.3.0 | storybook | |
| 1.29.1 |flowbite-svelte | there is an error in ^1.30.0 that needs a fix before updating [flowbite-svelte issue #1909](https://github.com/themesberg/flowbite-svelte/issues/1909) |