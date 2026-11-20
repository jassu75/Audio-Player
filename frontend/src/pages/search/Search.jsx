import Grid2 from "@mui/material/Grid2";
import styles from "./search.module.css";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import SearchSkeleton from "../../components/skeletons/search/SearchSkeleton";
import useFetchSearchSongs from "./hooks/useFetchSearchSongs";

import Error from "../helpers/error/Error";
import EmptySearch from "../../components/helpers/empty-state/empty-search/EmptySearch";
import useFetchRecentlyPlayed from "../../hooks/user-preferences/useFetchRecentlyPlayed";
import SearchSongList from "../../components/search/search-songs-list/SearchSongList";

const Search = () => {
  const { recentlyPlayedLoading, recentlyPlayedError } = useFetchRecentlyPlayed();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("searchtext") || "";
  const { showEmpty, showRecentlyPlayed, error } = useFetchSearchSongs(searchText);

  const handleSearch = (e) => {
    setSearchParams({ searchtext: e.target.value }, { replace: true });
  };

  if (error || (showRecentlyPlayed && recentlyPlayedError)) return <Error />;
  if (recentlyPlayedLoading) return <SearchSkeleton />;

  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.search_container}>
        <Grid2 className={styles.search_bar_container}>
          <SearchIcon className={styles.search_icon} />
          <TextField
            variant="outlined"
            placeholder="Search your uploaded songs..."
            value={searchText}
            className={styles.search_bar}
            onChange={handleSearch}
          />
        </Grid2>
        {showEmpty ? (
          <EmptySearch />
        ) : (
          <SearchSongList showRecentlyPlayed={showRecentlyPlayed} />
        )}
      </Grid2>
    </Grid2>
  );
};

export default Search;
