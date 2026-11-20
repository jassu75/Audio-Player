import { Grid, Pagination, Typography } from "@mui/material";
import { useEffect } from "react";
import FavoriteCard from "../../components/favorites/favorite-card/FavoriteCard";
import EmptySongsList from "../../components/helpers/empty-state/empty-playlist/EmptySongsList";
import FavoriteSkeleton from "../../components/skeletons/favorites/FavoriteSkeleton";
import usePagination from "../../hooks/usePagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors";
import { favoritesSelector } from "../../redux/selectors/userPreferencesSelectors";
import { setViewingSongList } from "../../redux/slices/audioPlayerSlice";
import type { SongMap } from "../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import Error from "../helpers/error/Error";
import styles from "./favorites.module.css";
import useFetchFavoriteIds from "./hooks/useFetchFavoriteIds";
import useFetchFavorites from "./hooks/useFetchFavorites";
const Favorites = () => {
    const { favoritesError, favoritesLoading } = useFetchFavorites();
    const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
    const songsList = useAppSelector(viewingSongListSelector);
    const favorites = useAppSelector(favoritesSelector);
    const dispatch = useAppDispatch();
    const { page, pageCount, start, end, handlePageChange } = usePagination(Object.keys(songsList ?? {}).length);
    useEffect(() => {
        if (songsList && favorites) {
            const filteredSongList = Object.values(songsList).reduce((acc, song) => {
                if (favorites.includes(song.song_id)) {
                    acc[song.song_id] = song;
                }
                return acc;
            }, {} as SongMap);
            if (Object.keys(filteredSongList).length !== Object.keys(songsList).length) {
                dispatch(setViewingSongList(filteredSongList));
            }
        }
    }, [favorites, songsList, dispatch]);
    if (favoritesError || favoritesIdError)
        return <Error />;
    if (favoritesLoading || favoritesIdLoading || !songsList)
        return <FavoriteSkeleton />;
    if (Object.keys(songsList).length === 0)
        return <EmptySongsList />;
    return (<Grid className={styles.favorite_songs}>
      <Grid className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Favorites
        </Typography>
      </Grid>
      <Grid className={styles.songs_container}>
        <Grid className={styles.favorites_container}>
          {Object.values(songsList)
            .slice(start, end)
            .map((song) => (<FavoriteCard key={song.song_id} songKey={song.song_id} favorite={song}/>))}
        </Grid>
        <Pagination variant="outlined" count={pageCount} page={page} onChange={handlePageChange}/>
      </Grid>
    </Grid>);
};
export default Favorites;
