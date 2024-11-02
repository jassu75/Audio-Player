import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSongs } from './Songlist/HomepageSongs/homepageSlice';
import HomepageSongsList from "./Songlist/HomepageSongs/homepageSongsList";
import songs from "./songs.json";

const Homepage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSongs(songs));
    }, [dispatch]);

    return <HomepageSongsList songsList={songs} />;
};

export default Homepage;
