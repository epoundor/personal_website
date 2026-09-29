# Space Invaders

Space Invaders on a transparent canvas, designed to be embedded in an `<iframe>` on any site.

File: `404/spaceinvaders.html`

## Play

| Input | Action |
|---|---|
| ← → / A D | Move the ship (the first press starts the game) |
| Space | Shoot |
| Touch and drag | Move the ship; it auto-fires while you touch |
| Any key / tap | Restart after game over |

Each enemy is worth 10 points. Clearing the grid starts a new wave. Enemies speed up as they die and with every wave. You lose a life when hit by an enemy shot, and the game ends when you run out of lives or the enemies reach your ship. The best score is kept for the current page session.

## Customization

All options are URL query params:

```
/404/spaceinvaders.html?player=00ff00&enemy=ff00ff&cols=6&rows=3&lives=5
```

Through the daily redirect, the same params work on `/404.html` — they are forwarded to the game.

| Param | Description | Default |
|---|---|---|
| `player` | Ship color | `22c55e` |
| `enemy` | Enemy color | `a855f7` |
| `bullet` | Your shots color | `22c55e` |
| `enemybullet` | Enemy shots color | `ef4444` |
| `text` | Text color | `888` |
| `border` | Board border color. `0` removes the border | `888` |
| `bg` | Page background color | transparent |
| `speed` | Game speed in %, 20–300 | `100` |
| `cols` | Enemy columns, 3–12 | `8` |
| `rows` | Enemy rows, 1–8 | `4` |
| `lives` | Starting lives, 1–9 | `3` |
| `title=0` | Hide the "404" heading and tagline | shown |

Colors accept a hex value **without `#`** (`ff0000`, `f00`, `ff000080`) or any CSS color (`red`, or `rgb(255,0,0)` URL-encoded). Invalid values fall back to the default. Numbers are clamped to their range.

## Embedding

```html
<iframe src="https://epoundor.xyz/404/spaceinvaders.html?enemy=ff00ff" width="400" height="520" style="border:0" allowtransparency="true"></iframe>
```

The page background is transparent unless `bg` is set.
