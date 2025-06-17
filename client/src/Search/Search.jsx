import Grid2 from "@mui/material/Grid2";
import styles from "./search.module.css";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { filterSongs } from "../utils/search.utils";
import { useSelector } from "react-redux";
import SearchSongList from "./SearchSongList";
import { songsSelector } from "../redux/selectors/homepage.selector";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [songsList, setSongsList] = useState(null);
  const allSongs = useSelector(songsSelector);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText) {
      const searchDebounceId = setTimeout(() => {
        const result = filterSongs(allSongs, searchText);
        setSongsList(result);
      }, 500);
      return () => clearTimeout(searchDebounceId);
    } else {
      setSongsList(null);
    }
  }, [searchText, allSongs]);

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
        {songsList && Object.keys(songsList).length > 0 ? (
          <SearchSongList songsList={songsList} />
        ) : null}
      </Grid2>
    </Grid2>
  );
};

export default Search;
