# TextGuard

A tiny spam detection demo built with **TypeScript**, **React (Vite)**, and **Express**.
No LLMs—just heuristics + a Naive Bayes classifier trained on a small labeled dataset.

> This was created as a personal learning exercise and doubles as an assessment piece for a potential job.

## Features

- **Client**
  - Textarea posting UI with platform icon toggles (Facebook, X/Twitter, LinkedIn, Instagram)
  - Result banner (spam / not spam)
  - History list with filter (“All / Spam / Not Spam”), bulk delete, accordion details
  - Responsive navbar using React state (no Bootstrap JS)

- **Server**
  - `/api/score` accepts `{ text, platforms }`
  - Normalizes text, applies heuristics (links/!, profanity), Naive Bayes probabilities
  - Returns `{ score, isSpam, platforms }`

## Quick Start (Dev)

```bash
npm install
npm run dev
```

- Client: <http://localhost:5173>
- API: <http://localhost:4000> (proxied in dev; client calls `/api/...`)

## Environment Variables

Create a `.env` (root or `server/` depending on your setup):

```
PORT=4000
SPAM_HEURISTIC_WEIGHT=0.5
SPAM_THRESHOLD=0.6
```

All have defaults; set them if you want to tweak scoring.

## Build & Run (Monolithic Prod)

```bash
npm run build     # build client + server, copy client into server/dist/public
npm start         # starts Express on PORT (default 4000)
```

Open <http://localhost:4000>.

### Deploy Manually

1. Push repo.
2. On your host (Render/Railway/Heroku/etc):
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. Set environment variables if needed.

## Project Structure

```
root
├─ client/                # React/Vite app (adjust if your client lives in /src)
├─ server/
│  ├─ src/
│  └─ dist/               # built output
├─ scripts/
│  └─ postbuild.cjs
├─ package.json
└─ README.md
```

*(Adjust paths/details based on your actual layout.)*

## Future Ideas

- More data + smarter features (n-grams, char-grams)
- Unit tests (scorer + UI)
- CI pipeline
- Threshold slider in UI, dark mode

---

MIT (or your license of choice)
© Christopher Hacia
