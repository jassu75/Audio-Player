import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import useInstallApp from "./useInstallApp";
import styles from "./installApp.module.css";

const InstallApp = () => {
  const {
    canInstall,
    isIOS,
    nativePromptAvailable,
    installing,
    error,
    install,
    dismiss,
  } = useInstallApp();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });
  const [updateError, setUpdateError] = useState("");
  const [updating, setUpdating] = useState(false);
  const update = async () => {
    setUpdating(true);
    try {
      await updateServiceWorker(true);
    } catch {
      setUpdateError("Unable to update. Try again when you’re online.");
      setUpdating(false);
    }
  };
  return (
    <Snackbar
      open={needRefresh || canInstall}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        zIndex: 1250,
        top: "max(12px, env(safe-area-inset-top, 0px)) !important",
      }}
    >
      <div className={styles.prompt} role="status">
        <div className={styles.copy}>
          <strong>
            {needRefresh ? "A new version is ready" : "Take Musify with you"}
          </strong>
          <p>
            {needRefresh
              ? updateError || "Update when you’re done listening."
              : error ||
                (isIOS && !nativePromptAvailable
                  ? "Tap your browser’s Share button, then Add to Home Screen."
                  : "Install Musify for a home-screen shortcut and an app-sized player.")}
          </p>
        </div>
        <div className={styles.actions}>
          {needRefresh ? (
            <Button onClick={update} disabled={updating}>
              Update
            </Button>
          ) : nativePromptAvailable ? (
            <Button onClick={install} disabled={installing}>
              Install
            </Button>
          ) : null}
          <Button
            color="inherit"
            onClick={() => (needRefresh ? setNeedRefresh(false) : dismiss())}
          >
            {needRefresh ? "Later" : "Not now"}
          </Button>
        </div>
      </div>
    </Snackbar>
  );
};

export default InstallApp;
