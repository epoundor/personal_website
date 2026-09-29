# Snake

Classic snake on a transparent canvas, designed to be embedded in an `<iframe>` on any site.

File: `404/snake.html`

## Play

| Input | Action |
|---|---|
| Arrow keys / WASD | Steer the snake (the first press starts the game) |
| Swipe (touch) | Steer the snake |
| Space / tap | Restart after game over |

Eating food adds 1 point and grows the snake. Hitting a wall or yourself ends the game. The best score is kept for the current page session.

## Customization

All options are URL query params:

```
/404/snake.html?snake=ff0000&food=ffff00&speed=80&grid=24
```

Through the daily redirect, the same params work on `/404.html` — they are forwarded to the game.

| Param | Description | Default |
|---|---|---|
| `snake` | Snake color | `22c55e` |
| `food` | Food color | `ef4444` |
| `text` | Text color | `888` |
| `border` | Board border color. `0` removes the border | `888` |
| `bg` | Page background color | transparent |
| `speed` | Milliseconds per move, 30–500 (lower is faster) | `110` |
| `grid` | Cells per side, 8–40 | `20` |
| `title=0` | Hide the "404" heading and tagline | shown |

Colors accept a hex value **without `#`** (`ff0000`, `f00`, `ff000080`) or any CSS color (`red`, or `rgb(255,0,0)` URL-encoded). Invalid values fall back to the default. Numbers are clamped to their range.

## Embedding

```html
<iframe src="https://epoundor.xyz/404/snake.html?snake=ff0000" width="400" height="480" style="border:0" allowtransparency="true"></iframe>
```

The page background is transparent unless `bg` is set.
