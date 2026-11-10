# apnay.app

The Apnay waitlist page, published with GitHub Pages from the `main` branch, root folder.

- `index.html`: the page and its copy. `privacy.html`: the privacy note.
- `styles.css`: colours sit at the top as variables, with a dark-mode set below them.
- `main.js`: sends sign-ups to `API_URL`, the `/api/waitlist` endpoint on the Apnay server.
  Sign-ups are stored in the server's `waitlist_entries` table.
- `CNAME`: the custom domain, `apnay.app`.

No build step: edit the files and push to `main`, and Pages republishes in a minute or two.
