import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const useAppUpdates = () => {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const checking = useRef(false);

  useRegisterSW({
    immediate: true,
    onRegisteredSW: (_url, value) => {
      registration.current = value;
    },
    onNeedReload: () => undefined,
  });

  useEffect(() => {
    const checkForUpdates = () => {
      const worker = registration.current;
      if (
        !worker ||
        worker.installing ||
        checking.current ||
        document.visibilityState !== "visible" ||
        !navigator.onLine
      )
        return;
      checking.current = true;
      void worker
        .update()
        .catch(() => undefined)
        .finally(() => {
          checking.current = false;
        });
    };
    const interval = window.setInterval(checkForUpdates, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", checkForUpdates);
    window.addEventListener("online", checkForUpdates);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", checkForUpdates);
      window.removeEventListener("online", checkForUpdates);
    };
  }, []);
};

export default useAppUpdates;
