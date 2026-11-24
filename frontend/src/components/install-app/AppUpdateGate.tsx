import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { prepareAppUpdate } from "./prepareAppUpdate";
import type {
  AppUpdateGateProps,
  AppUpdateResult,
} from "./types/AppUpdateGate.types";
import styles from "./appUpdateGate.module.css";

const AppUpdateGate = ({ startup, children }: AppUpdateGateProps) => {
  const [attempt, setAttempt] = useState(startup);
  const [result, setResult] = useState<AppUpdateResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void attempt
      .then((value) => {
        if (active) setResult(value);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  if (result?.status === "ready") return children;
  const blocked = result?.status === "required" || failed;
  const retry = () => {
    setResult(null);
    setFailed(false);
    setAttempt(prepareAppUpdate().then((value) => {
      if (value.status === "ready") {
        window.location.reload();
        return { status: "reloading" } as const;
      }
      return value;
    }));
  };

  return (
    <main className={styles.container}>
      <section
        className={styles.card}
        role={blocked ? "alertdialog" : "status"}
        aria-modal={blocked ? true : undefined}
        aria-labelledby="app-update-title"
      >
        <h1 id="app-update-title">
          {blocked
            ? "Update required"
            : result?.status === "reloading"
              ? "Opening the updated app"
              : "Checking for updates"}
        </h1>
        <p>
          {blocked
            ? "Musify needs to finish updating before you can continue. Check your connection and tap Update to try again."
            : "Please wait. Musify will open as soon as it is ready."}
        </p>
        {blocked ? (
          <Button autoFocus variant="contained" onClick={retry}>
            Update
          </Button>
        ) : (
          <CircularProgress aria-label="Preparing Musify" />
        )}
      </section>
    </main>
  );
};

export default AppUpdateGate;
