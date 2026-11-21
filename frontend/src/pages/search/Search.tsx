import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "react-router-dom";
import SearchSkeleton from "../../components/skeletons/search/SearchSkeleton";
import useFetchSearchSongs from "./hooks/useFetchSearchSongs";
import styles from "./search.module.css";
import EmptySearch from "../../components/helpers/empty-state/empty-search/EmptySearch";
import SearchSongList from "../../components/search/search-songs-list/SearchSongList";
import useFetchRecentlyPlayed from "../../hooks/user-preferences/useFetchRecentlyPlayed";
import Error from "../helpers/error/Error";
const Search = () => {
    const { recentlyPlayedLoading, recentlyPlayedError } = useFetchRecentlyPlayed();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchText = searchParams.get("searchtext") || "";
    const { showEmpty, showRecentlyPlayed, error } = useFetchSearchSongs(searchText);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ searchtext: e.target.value }, { replace: true });
    };
    if (error || (showRecentlyPlayed && recentlyPlayedError))
        return <Error />;
    if (recentlyPlayedLoading)
        return <SearchSkeleton />;
    return (<Grid className={styles.container}>
      <Grid className={styles.search_container}>
        <Grid className={styles.search_bar_container}>
          <SearchIcon className={styles.search_icon}/>
          <TextField variant="outlined" placeholder="Search songs, artists, or albums..." value={searchText} className={styles.search_bar} onChange={handleSearch}/>
        </Grid>
        {showEmpty ? (<EmptySearch />) : (<SearchSongList showRecentlyPlayed={showRecentlyPlayed}/>)}
      </Grid>
    </Grid>);
};
export default Search;
