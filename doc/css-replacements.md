## CSS Replacement classes
Tailwind equivalent of existing tabroom css helpers

### Sizes

| Tabroom.css | Tailwind |
|-------------|----------|
| no (0px)    | 0        |
| less (2px)  | 0.5      |
| half (4px)  | 1        |
| (8px)       | 2        |
| more (16px) | 4        |


### Colors
|Tabroom.css | Exact | Aprox          |
|------------|-------|----------------|
| lightest-gray|#fafafa| surface-400 (exact)|
| light-gray|#eaeaea| surface-500 (exact)|
| border-gray|#dddddd| surface-600 (exact)|
| medium-gray|#aaaaaa| surface-600 (exact)|
| dark-blue   |#016F94| primary-600


| Tabroom.css | Tailwind |
|-------------|----------|
| screens     | not css, used in tabs.mas |
|semi-bold    | font-semibold | 
|full         | w-full   | 
|pad          | p        | 
|mar          | m        | 
|padtop       | pt       | 
|padbottom    | pb       | 
|thinborder   | border   | 
|ltborder     | border + border-surface-700 |
|oddrow       | border-y border-y-surface-600 bg- | 
