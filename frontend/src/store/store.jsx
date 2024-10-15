import { atom } from "recoil";

export const allState = atom({
    key: 'all',
    default: [],
});

export const moviesState = atom({
    key: 'movies',
    default: [],
});

export const seriesState = atom({
    key: 'series',
    default: [],
});

export const animeState = atom({
    key: 'anime',
    default: [],
});