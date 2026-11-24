import { useEffect, useState } from "react";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
import type {
  InstalledNavigator,
  InstallPromptEvent,
} from "./types/InstallApp.types";

const useInstallApp = () => {
  const [installed, setInstalled] = useState(() =>
    Boolean(
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as InstalledNavigator).standalone,
    ),
  );
  const [dismissed, setDismissed] = useState(() =>
    Boolean(
      readStoredJson<boolean>(sessionStorage, "installPromptDismissed", false),
    ),
  );
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState("");
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => {
    const beforeInstall = (event: Event) => {
      if (!("prompt" in event) || typeof event.prompt !== "function") return;
      if (!dismissed) event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    const displayMode = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayChange = () =>
      setInstalled(
        Boolean(
          displayMode?.matches || (navigator as InstalledNavigator).standalone,
        ),
      );
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    displayMode?.addEventListener?.("change", onDisplayChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      displayMode?.removeEventListener?.("change", onDisplayChange);
    };
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    writeStoredJson(sessionStorage, "installPromptDismissed", true);
  };
  const install = async () => {
    if (!prompt || installing) return;
    setInstalling(true);
    setError("");
    try {
      const result = await prompt.prompt();
      const choice = prompt.userChoice ? await prompt.userChoice : result;
      if (choice?.outcome === "accepted") setInstalled(true);
      else dismiss();
      setPrompt(null);
    } catch {
      setError(
        "Open your browser menu and choose Install app or Add to Home Screen.",
      );
    } finally {
      setInstalling(false);
    }
  };
  return {
    canInstall: !installed && !dismissed && Boolean(prompt || isIOS),
    isIOS,
    nativePromptAvailable: Boolean(prompt),
    installing,
    error,
    install,
    dismiss,
  };
};

export default useInstallApp;
