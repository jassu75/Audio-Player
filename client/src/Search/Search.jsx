import Grid2 from "@mui/material/Grid2";
import styles from "./search.module.css";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchSongList from "./SearchSongList";
import { useSearchParams } from "react-router-dom";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import SearchSkeleton from "../Skeletons/SearchSkeleton";
import useFetchSearchSongs from "../hooks/Songs/useFetchSearchSongs";

import EmptySearch from "./EmptySearch";
import useFetchRecentlyPlayed from "../hooks/RecentlyPlayed/useFetchRecentlyPlayed";

const Search = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { recentlyPlayedLoading } = useFetchRecentlyPlayed();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("searchtext") || "";
  const { showEmpty, showRecentlyPlayed } = useFetchSearchSongs(searchText);

  const handleSearch = (e) => {
    setSearchParams({ searchtext: e.target.value }, { replace: true });
  };

  if (userLoading || recentlyPlayedLoading) return <SearchSkeleton />;

  if (userError) return <ErrorPage />;

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
