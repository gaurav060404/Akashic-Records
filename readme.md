# Akashic Records 

Lightweight React + Vite frontend that aggregates Movies, TV shows and Anime using TheMovieDB (TMDb) API.

<img width="1897" height="867" alt="akashicrecords" src="https://github.com/user-attachments/assets/083f5949-50a0-4c5a-bad3-eaf486ec67d2" />


## Tech stack
- React (Vite)
- Recoil for state management
- Axios for HTTP requests
- Tailwind CSS for styles
- React Router for navigation

## Quick start (Windows)
1. Install dependencies
   - PowerShell / CMD:
     npm install

2. Add environment variable
   - Create `.env` in project root:
     ```
     VITE_SECRET_KEY=your_tmdb_api_key_here
     ```
   - Obtain a TMDb API key: https://www.themoviedb.org/settings/api

3. Run dev server
   npm run dev
   - Default: http://localhost:5173

4. Build / preview
   npm run build
   npm run preview

## Useful scripts (package.json)
- `dev` — start Vite dev server
- `build` — production build
- `preview` — serve production build locally

## Project layout (src/)
- src/main.jsx — app bootstrap
- src/App.jsx — routes
- src/pages/ — page views (Home, Details, Movies, Series, Anime, etc.)
- src/components/ — UI components (List, Card, Carousel, Navbar, etc.)
- src/store/store.jsx — Recoil selectors/atoms and remote data fetching
- src/utils/state.js — helper state utilities

## Notes & troubleshooting
- If pages fail to load or Details crashes, confirm `VITE_SECRET_KEY` is set and requests succeed (check network console).
- Deep links to Details should work; if data is missing the page falls back to fetching by id/title.
- TMDb API has rate limits; use caching or reduce parallel requests if you hit limits.
- CORS errors indicate either a bad URL or API key issue.

## Contributing
- Follow existing code style (Tailwind classes, Recoil for shared state).
- Run the dev server and verify UI/console for errors before opening PRs.

```// filepath: d:\Collab\frontend\README.md
# Records Of Akasha (Frontend)

Lightweight React + Vite frontend that aggregates Movies, TV shows and Anime using TheMovieDB (TMDb) API.

## Tech stack
- React (Vite)
- Recoil for state management
- Axios for HTTP requests
- Tailwind CSS for styles
- React Router for navigation

## Quick start (Windows)
1. Install dependencies
   - PowerShell / CMD:
     npm install

2. Add environment variable
   - Create `.env` in project root:
     ```
     VITE_SECRET_KEY=your_tmdb_api_key_here
     ```
   - Obtain a TMDb API key: https://www.themoviedb.org/settings/api

3. Run dev server
   npm run dev
   - Default: http://localhost:5173

4. Build / preview
   npm run build
   npm run preview

## Useful scripts (package.json)
- `dev` — start Vite dev server
- `build` — production build
- `preview` — serve production build locally

## Project layout (src/)
- src/main.jsx — app bootstrap
- src/App.jsx — routes
- src/pages/ — page views (Home, Details, Movies, Series, Anime, etc.)
- src/components/ — UI components (List, Card, Carousel, Navbar, etc.)
- src/store/store.jsx — Recoil selectors/atoms and remote data fetching
- src/utils/state.js — helper state utilities

## Notes & troubleshooting
- If pages fail to load or Details crashes, confirm `VITE_SECRET_KEY` is set and requests succeed (check network console).
- Deep links to Details should work; if data is missing the page falls back to fetching by id/title.
- TMDb API has rate limits; use caching or reduce parallel requests if you hit limits.
- CORS errors indicate either a bad URL or API key issue.

## Contributing
- Follow existing code style (Tailwind classes, Recoil for shared state).
- Run the dev server and verify UI/console
