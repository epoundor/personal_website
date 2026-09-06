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
