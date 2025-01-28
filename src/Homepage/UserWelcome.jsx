import React from "react";
import Typography from "@mui/material/Typography";
import styles from "./userWelcome.module.css";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import defaultAvatar from "../assets/Homepage/DefaultAvatar.jpeg"

const UserWelcome = () => {
  const { user, loading } = useFetchUserDetails();

  if (loading) return <p>Loading...</p>;

  return (
    user ? (
      <Grid2 className={styles.welcome_text_container}>
        <Avatar src={defaultAvatar} />
        <Typography variant="UserWelcomeText" className={styles.username_text}>
          {user.username}
        </Typography>
      </Grid2>
    ) : null
  );
};

export default UserWelcome;
