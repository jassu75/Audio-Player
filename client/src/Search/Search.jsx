import Grid2 from "@mui/material/Grid2";
import styles from "./search.module.css";
import { TextField } from "@mui/material";
import { useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import SearchSongList from "./SearchSongList";
import { filteredSearchSongSelector } from "../redux/selectors/homepage.selector";
import { useSearchParams } from "react-router-dom";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import SearchSkeleton from "../Skeletons/SearchSkeleton";
import EmptySearch from "./EmptySearch";

const Search = () => {
  const { userLoading, userError } = useFetchUserDetails();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("searchtext") || "";

  const handleSearch = (e) => {
    setSearchParams({ searchtext: e.target.value }, { replace: true });
  };
  const songsListSelector = useMemo(
    () => filteredSearchSongSelector(searchText),
    [searchText]
  );
  const songsList = useSelector(songsListSelector);

  if (userError) return <ErrorPage />;

  return userLoading ? (
    <SearchSkeleton />
  ) : (
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
        {songsList && Object.keys(songsList).length > 0 ? (
          <SearchSongList songsList={songsList} />
        ) : searchText ? (
          <EmptySearch />
        ) : null}
      </Grid2>
    </Grid2>
  );
};

export default Search;
