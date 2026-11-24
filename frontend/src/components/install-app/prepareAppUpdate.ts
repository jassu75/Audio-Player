const reloadPage = () => window.location.reload();

export const prepareAppUpdate = (reload = reloadPage): Promise<boolean> => {
  if (
    !("serviceWorker" in navigator) ||
    !navigator.serviceWorker.controller
  )
    return Promise.resolve(false);

  return new Promise((resolve) => {
    const workers = navigator.serviceWorker;
    let registration: ServiceWorkerRegistration | undefined;
    let installing: ServiceWorker | null = null;
    let finished = false;
    let activating = false;
    const finish = (reloading = false) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      workers.removeEventListener("controllerchange", onControllerChange);
      registration?.removeEventListener("updatefound", watchInstallation);
      installing?.removeEventListener("statechange", onStateChange);
      resolve(reloading);
    };
    const onControllerChange = () => {
      if (finished || !activating) return;
      finish(true);
      reload();
    };
    const activateWaiting = () => {
      if (finished || activating)
        return;
      if (registration?.waiting) {
        activating = true;
        try {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        } catch {
          finish();
        }
      }
    };
    const onStateChange = () => {
      if (finished) return;
      activateWaiting();
      if (installing?.state === "redundant") finish();
    };
    const watchInstallation = () => {
      if (finished) return;
      installing?.removeEventListener("statechange", onStateChange);
      installing = registration?.installing ?? null;
      installing?.addEventListener("statechange", onStateChange);
      activateWaiting();
    };
    const timeout = window.setTimeout(() => finish(), 8000);
    workers.addEventListener("controllerchange", onControllerChange);
    void workers
      .getRegistration()
      .then(async (value) => {
        if (finished) return;
        registration = value;
        if (!registration) return finish();
        registration.addEventListener("updatefound", watchInstallation);
        watchInstallation();
        if (activating || installing) return;
        if (!navigator.onLine) return finish();
        await registration.update();
        if (finished) return;
        watchInstallation();
        if (!activating && !installing) finish();
      })
      .catch(() => finish());
  });
};
