import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import SkeletonList from '../components/SkeletonList';
import Rated from '../components/Rated';
import SkeletonRated from '../components/SkeletonRated';
import { useQuery } from '@tanstack/react-query';
import { topRatedMangas, trendingMangas } from '../services/mangaService.js';

export default function Series() {

    const {
        data: trendingData,
        isLoading: trendingLoading,
        isError: trendingError
    } = useQuery({
        queryKey: ["trending-mangas"],
        queryFn: trendingMangas
    });

    const {
        data: topRatedData,
        isLoading: topRatedLoading,
        error: topRatedError
    } = useQuery({
        queryKey: ["top-rated-mangas"],
        queryFn: topRatedMangas
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='w-full h-full absolute bg-black'>
            <div className='w-full h-20'>
                <Navbar isHomePage={false} hasBg={false} />
            </div>
            {trendingLoading && <SkeletonList title="Series" />}
            {trendingData && (
                <List title="Manga" poster={trendingData} isRated={false} />
            )}
            {trendingError && (
                <div className='text-white'>Error loading data</div>
            )}
            {topRatedLoading && <SkeletonRated title={"Series"} isRated={true} />}
            {topRatedData && (
                <Rated title="Manga" isRated={true} rated={topRatedData} />
            )}
            {topRatedError && (
                <div className='text-white'>Error loading data</div>
            )}
        </div>
    )
}
