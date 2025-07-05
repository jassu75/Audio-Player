import { Grid2, Typography } from "@mui/material";
import styles from "./favoriteCard.module.css";
import { Fragment } from "react";
import GreenDot from "../../assets/images/Card/greenDot.png";
import Album from "../../assets/images/Card/album.png";
import Time from "../../assets/images/Card/time.png";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "../../Favorite/FavoriteIcon";

const Genre = ({ genre }) => {
  if (!genre || genre.length === 0) return null;
  return (
    <Grid2 className={styles.genre_container}>
      <Grid2 className={styles.genre}>
        {genre.map((value, index) => (
          <Fragment key={index}>
            <Typography className={styles.genre_text} variant="CardContent">
              {value}
            </Typography>
            {index < genre.length - 1 ? (
              <img
                loading="lazy"
                src={GreenDot}
                alt=""
                className={styles.dot}
              />
            ) : null}
          </Fragment>
        ))}
      </Grid2>
    </Grid2>
  );
};

const AlbumAndTime = ({ album, year }) => {
  return album ? (
    <Grid2 className={styles.album_time_container}>
      <Grid2 className={styles.album_container}>
        <img src={Album} loading="lazy" alt="" className={styles.album_image} />
        <Typography className={styles.album_text} variant="CardContent">
          {album}
        </Typography>
      </Grid2>

      <Grid2 className={styles.time_container}>
        <img src={Time} loading="lazy" alt="" className={styles.time_image} />
        <Typography className={styles.time_text} variant="CardContent">
          {year}
        </Typography>
      </Grid2>
    </Grid2>
  ) : null;
};

const FavoriteCard = ({ favorite }) => {
  const navigate = useNavigate();
  const handleFavoriteClick = () => {
    navigate(`/preference/favorites/song/${favorite.song_id}`);
  };
  return (
    <Grid2 className={styles.favorite_card} onClick={handleFavoriteClick}>
      <Grid2 className={styles.image_container}>
        <img
          className={styles.favorite_image}
          loading="lazy"
          src={favorite.cover_art}
          alt=""
        />
        <Genre genre={favorite.genre} />
        <Grid2 className={styles.favorite_icon_container}>
          <FavoriteIcon songId={favorite.song_id} />
        </Grid2>
      </Grid2>

      <Grid2 className={styles.favorite_content}>
        <Typography className={styles.title_text} variant="CardTitle">
          {favorite?.title}
        </Typography>
        <Typography variant="CardArtist" className={styles.artist_text}>
          {favorite?.artist}
        </Typography>
        <AlbumAndTime album={favorite.album} year={favorite.release_year} />
      </Grid2>
    </Grid2>
  );
};

export default FavoriteCard;
