import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import useInstallApp from "./useInstallApp";
import useAppUpdates from "./useAppUpdates";
import styles from "./installApp.module.css";

const InstallApp = () => {
  useAppUpdates();
  const {
    canInstall,
    isIOS,
    nativePromptAvailable,
    installing,
    error,
    install,
    dismiss,
  } = useInstallApp();
  return (
    <Snackbar
      open={canInstall}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        zIndex: 1250,
        top: "max(12px, env(safe-area-inset-top, 0px)) !important",
      }}
    >
      <div className={styles.prompt} role="status">
        <div className={styles.copy}>
          <strong>Take Musify with you</strong>
          <p>
            {error ||
              (isIOS && !nativePromptAvailable
                ? "Tap your browser’s Share button, then Add to Home Screen."
                : "Install Musify for a home-screen shortcut and an app-sized player.")}
          </p>
        </div>
        <div className={styles.actions}>
          {nativePromptAvailable ? (
            <Button onClick={install} disabled={installing}>
              Install
            </Button>
          ) : null}
          <Button color="inherit" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
    </Snackbar>
  );
};

export default InstallApp;
