# epoundor.dev

A personal website styled as a chat interface with an AI — ask it something and it answers with facts, projects, and contact info instead of a traditional bio page.

## Stack

Plain HTML, CSS, and JavaScript. No build step, no dependencies.

- `index.html` — page structure and chat UI markup
- `style.css` — styling
- `script.js` — chat interaction logic (suggestions, responses, input handling)
- `favicon.svg` — site icon

## Running locally

Since there's no build step, just serve the directory and open it in a browser:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Hosted on GitHub Pages at [epoundor.xyz](https://epoundor.xyz), served from the `main` branch root. The `CNAME` file configures the custom domain.

To point a new domain here:
1. Enable Pages in the repo settings (Settings → Pages → Source: `main` / `/root`).
2. Add a `CNAME` file at the repo root containing the domain.
3. At your DNS provider, add:
   - `A` records for the apex domain → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `epoundor.github.io`
4. Once DNS propagates, enable "Enforce HTTPS" in the Pages settings.
