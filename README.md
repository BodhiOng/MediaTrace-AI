# MediaTrace

MediaTrace is a frontend prototype for turning screenshots or Instagram post links into organized media traces.

## Features

- Upload screenshot workflow for films, TV series, games, books, manga, anime, and albums
- Instagram post/reel link entry flow without downloading images or videos
- Simulated processing and results screens
- Tracker filters and confidence indicators in the demo results
- Light/dark mode with the preference saved in `localStorage`
- Supported tracker logo assets loaded from `public/assets`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm start
```

## Routes

- `/` — New trace
- `/instagram` — Paste an Instagram post, reel, or video link
- `/processing` — Processing preview
- `/results` — Demo trace results
- `/settings` — Preferences and supported trackers

## Tracker assets

Add these files to `public/assets`:

- `letterboxd.png`
- `serializd.png`
- `backloggd.png`
- `librarything.png`
- `anilist.png`
- `rateyourmusic.png`

## Scope

This project is frontend-only. It does not fetch Instagram content, scrape posts, download media, or persist trace results to a backend.
