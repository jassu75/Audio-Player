import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import defaultAvatar from "../../../assets/images/Homepage/DefaultAvatar.jpeg";
import styles from "./profile.module.css";
import ButtonBase from "@mui/material/ButtonBase";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = async () => {
    try {
      setSignOutLoading(true);
      await signOut(auth);
      navigate("/account", { replace: true });
    } catch (error) {
      console.error("error logging out user", error);
    } finally {
      setSignOutLoading(false);
      handleMenuClose();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteAccountLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const assets = await axios.post(
          "/api/fetchassets",
          { user_id: auth.currentUser.uid },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const refinedAssets = assets.data?.assets.flatMap((asset) => {
          const result = [];

          if (asset.cover_art_id !== "static") {
            result.push({ id: asset.cover_art_id, type: "image" });
          }

          result.push({ id: asset.audio_url_id, type: "video" });

          return result;
        });

        await axios.post(
          "/api/deleteuser",
          { assets: refinedAssets },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/account", { replace: true });
      }
    } catch (error) {
      console.error("Error deleting user", error);
    } finally {
      setDeleteAccountLoading(false);
      handleMenuClose();
    }
  };

  return (
    <Grid2 className={styles.upload_actions}>
      <ButtonBase
        className={styles.welcome_text_container}
        onClick={handleMenuOpen}
      >
        <Avatar src={defaultAvatar} />
        <Typography variant="UserWelcomeText" className={styles.username_text}>
          {username}
        </Typography>
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSignout} className={styles.menu_item}>
          {signOutLoading ? (
            <>
              <Typography variant="MenuItemText">Signing Out</Typography>
              <CircularProgress className={styles.loader} size={20} />
            </>
          ) : (
            <Typography variant="MenuItemText">Sign Out</Typography>
          )}
        </MenuItem>
        <Divider className={styles.divider} />

        <MenuItem onClick={handleDeleteAccount} className={styles.menu_item}>
          {deleteAccountLoading ? (
            <>
              <Typography
                variant="MenuItemText"
                className={styles.deleteacount_text}
              >
                Deleting Account
              </Typography>
              <CircularProgress className={styles.loader} size={20} />
            </>
          ) : (
            <Typography
              variant="MenuItemText"
              className={styles.deleteacount_text}
            >
              Delete Account
            </Typography>
          )}
        </MenuItem>
      </Menu>
    </Grid2>
  );
};

export default Profile;
