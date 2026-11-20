import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { signOut } from "firebase/auth";
import { useState } from "react";
import defaultAvatar from "../../../assets/images/Homepage/DefaultAvatar.jpeg";
import { auth } from "../../../config/firebase";
import { postApi } from "../../../services/api";
import type { ProfileProps } from "./types/Profile.types";
import type { Asset } from "../../../hooks/cloudinary/types/useCloudinaryUpload.types";
import styles from "./profile.module.css";
const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/account");
};
const Profile = ({ username }: ProfileProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSignout = async () => {
        try {
            setSignOutLoading(true);
            await signOut(auth);
            logout();
        }
        catch (error) {
            console.error("error logging out user", error);
        }
        finally {
            setSignOutLoading(false);
            handleMenuClose();
        }
    };
    const handleDeleteAccount = async () => {
        try {
            setDeleteAccountLoading(true);
            const currentUser = auth.currentUser;
            const token = await currentUser?.getIdToken();
            if (token && currentUser) {
                const assets = await postApi("/api/fetchassets", { user_id: currentUser.uid }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const refinedAssets = assets.data?.assets.flatMap((asset) => {
                    const result: Asset[] = [];
                    if (asset.cover_art_id && asset.cover_art_id !== "static") {
                        result.push({ id: asset.cover_art_id, type: "image" });
                    }
                    if (asset.audio_url_id)
                        result.push({ id: asset.audio_url_id, type: "video" });
                    return result;
                });
                await postApi("/api/deleteuser", { assets: refinedAssets }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                logout();
            }
        }
        catch (error) {
            console.error("Error deleting user", error);
        }
        finally {
            setDeleteAccountLoading(false);
            handleMenuClose();
        }
    };
    return (<Grid className={styles.upload_actions}>
      <ButtonBase className={styles.welcome_text_container} onClick={handleMenuOpen}>
        <Avatar src={defaultAvatar}/>
        <Typography variant="UserWelcomeText" className={styles.username_text}>
          {username}
        </Typography>
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleSignout} className={styles.menu_item}>
          {signOutLoading ? (<>
              <Typography variant="MenuItemText">Signing Out</Typography>
              <CircularProgress className={styles.loader} size={20}/>
            </>) : (<Typography variant="MenuItemText">Sign Out</Typography>)}
        </MenuItem>
        <Divider className={styles.divider}/>

        <MenuItem onClick={handleDeleteAccount} className={styles.menu_item}>
          {deleteAccountLoading ? (<>
              <Typography variant="MenuItemText" className={styles.deleteacount_text}>
                Deleting Account
              </Typography>
              <CircularProgress className={styles.loader} size={20}/>
            </>) : (<Typography variant="MenuItemText" className={styles.deleteacount_text}>
              Delete Account
            </Typography>)}
        </MenuItem>
      </Menu>
    </Grid>);
};
export default Profile;
