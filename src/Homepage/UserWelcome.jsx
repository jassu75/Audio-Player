import React from "react";
import Typography from "@mui/material/Typography";
import styles from "./userWelcome.module.css";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";

const UserWelcome = () => {
  const { user, loading } = useFetchUserDetails();

  if (loading) return <p>Loading...</p>;

  return (
    <Grid2 className={styles.welcome_text_container}>
      {user ? (
        <Typography variant="UserWelcomeText" className={styles.username_text}>
          Hello {user.username}
        </Typography>
      ) : null}
    </Grid2>
  );
};

export default UserWelcome;
