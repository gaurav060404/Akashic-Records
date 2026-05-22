# Akashic Records

Lightweight React + Vite frontend that aggregates Movies, TV shows and Anime using TheMovieDB (TMDb) API.

Screenshots

<img width="1897" height="868" alt="image" src="https://github.com/user-attachments/assets/f3fceeec-3dec-4e9a-b699-5a71fefddbab" />
<img width="1898" height="863" alt="image" src="https://github.com/user-attachments/assets/695c6272-15c3-455a-9f16-f8a3d0ad2918" />
<img width="1899" height="867" alt="image" src="https://github.com/user-attachments/assets/56679a01-fb2e-482f-b118-12de1d21dc2b" />

---

## Tech stack
- React (Vite)
- Recoil (state management)
- Axios (HTTP requests)
- Tailwind CSS (styling)
- React Router (routing)

## Quick Start

1. Install dependencies
```sh
npm install
```

2. Add environment variable
- Create a `.env` file in the project root:
```
VITE_SECRET_KEY=your_tmdb_api_key_here
```
- Get a TMDb API key: https://www.themoviedb.org/settings/api

3. Run the dev server
```sh
npm run dev
```
Default app URL: http://localhost:5173

4. Build & preview
```sh
npm run build
npm run preview
```

## Available scripts (package.json)
- `dev` — start Vite dev server
- `build` — production build
- `preview` — serve production build locally

## Project layout (src/)
- main.jsx — app bootstrap
- App.jsx — routes
- pages/ — views: Home, Details, Movies, Series, Anime, About, Profile, etc.
- components/ — UI components: List, Card, Carousel, TopDirectors, Navbar, Footer, Skeletons, etc.
- store/ — Recoil atoms & selectors (data fetching and processing)
  - Important selectors:
    - `allStateSelector` — trending items with details
    - `carouselPosters` — posters for home carousel
    - `upcomingMovies`, `upcomingSeries`, `upcomingAnimes` — upcoming lists
    - `topDirectorsSelector` — aggregated top directors (used by TopDirectors component)
- services/ — small services (e.g., watchlistService.js)
- assets/ — static images and icons

## Notes & troubleshooting

- API key: ensure `VITE_SECRET_KEY` is set. Missing/invalid key causes empty data or errors.
- Director images: TMDb profile images are returned as `profile_path` and should be requested via:
  `https://image.tmdb.org/t/p/w200{profile_path}`. If images are missing, the selector may not have found a matching person or TMDb has no profile image for that person.
- Rate limits: TMDb enforces rate limits — reduce parallel requests or add caching if you hit limits
