import { Grid, Typography } from "@mui/material";
import { Fragment } from "react";
import Album from "../../../assets/images/Card/Album.png";
import GreenDot from "../../../assets/images/Card/greenDot.png";
import Time from "../../../assets/images/Card/time.png";
import { useAppDispatch } from "../../../redux/hooks";
import { playSong, } from "../../../redux/slices/audioPlayerSlice";
import type { AlbumAndTimeProps, FavoriteCardProps, GenreProps } from "./types/FavoriteCard.types";
import FavoriteIcon from "../favorite-icon/FavoriteIcon";
import styles from "./favoriteCard.module.css";
const Genre = ({ genre }: GenreProps) => {
    if (!genre || genre.length === 0)
        return null;
    return (<Grid className={styles.genre_container}>
      <Grid className={styles.genre}>
        {genre.map((value, index) => (<Fragment key={index}>
            <Typography className={styles.genre_text} variant="CardContent">
              {value}
            </Typography>
            {index < genre.length - 1 ? (<img loading="lazy" src={GreenDot} alt="" className={styles.dot}/>) : null}
          </Fragment>))}
      </Grid>
    </Grid>);
};
const AlbumAndTime = ({ album, year }: AlbumAndTimeProps) => {
    return album ? (<Grid className={styles.album_time_container}>
      <Grid className={styles.album_container}>
        <img src={Album} loading="lazy" alt="" className={styles.album_image}/>
        <Typography className={styles.album_text} variant="CardContent">
          {album}
        </Typography>
      </Grid>

      <Grid className={styles.time_container}>
        <img src={Time} loading="lazy" alt="" className={styles.time_image}/>
        <Typography className={styles.time_text} variant="CardContent">
          {year}
        </Typography>
      </Grid>
    </Grid>) : null;
};
const FavoriteCard = ({ favorite, songKey }: FavoriteCardProps) => {
    const dispatch = useAppDispatch();
    const handleFavoriteClick = () => {
        dispatch(playSong(songKey));
    };
    return (<Grid className={styles.favorite_card} onClick={handleFavoriteClick}>
      <Grid className={styles.image_container}>
        <img className={styles.favorite_image} loading="lazy" src={favorite.cover_art} alt=""/>
        <Genre genre={favorite.genre}/>
        <Grid className={styles.favorite_icon_container}>
          <FavoriteIcon songId={favorite.song_id}/>
        </Grid>
      </Grid>

      <Grid className={styles.favorite_content}>
        <Typography className={styles.title_text} variant="CardTitle">
          {favorite?.title}
        </Typography>
        <Typography variant="CardArtist" className={styles.artist_text}>
          {favorite?.artist}
        </Typography>
        <AlbumAndTime album={favorite.album} year={favorite.release_year}/>
      </Grid>
    </Grid>);
};
export default FavoriteCard;
