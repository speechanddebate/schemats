# Color Shade Rules

## Shade Scale
- Use a numeric shade scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900.
- 50 is lightest, 900 is darkest.
- 500 is the brand baseline for each hue.
- Adjacent shades should be visually incremental and predictable.

## Semantic Mapping
- `*-50` to `*-100`: subtle backgrounds, tinted surfaces.
- `*-200` to `*-300`: borders, dividers, low-emphasis UI chrome.
- `*-400` to `*-500`: default interactive elements.
- `*-600` to `*-700`: hover and active states.
- `*-800` to `*-950`: high-emphasis text and strong contrast surfaces.

## Interaction Rules
- Hover should move one step darker than default (`500 -> 600`).
- Active should move one more step darker (`600 -> 700`).
- Disabled should move lighter and lower contrast (`500 -> 300` or `400 -> 200`).


## Contrast Requirements
- Body text: minimum contrast ratio 4.5:1.
- Large text (18pt+ regular or 14pt+ bold): minimum 3:1.
- UI boundaries (input borders, dividers, icon-only controls): minimum 3:1 against adjacent color.

## Consistency Rules
- Do not skip semantic intent by using arbitrary shades for one-off components.
- Keep each component on a predictable shade ladder: base, hover, active, disabled.