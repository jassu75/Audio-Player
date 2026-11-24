const resetVersionKey = "musify-cache-reset-version";

export const refreshDeploymentCache = async (
  reload: () => void,
): Promise<boolean> => {
  if (!navigator.onLine) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch("/version.json", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const deployment: unknown = await response.json();
    if (
      !deployment ||
      typeof deployment !== "object" ||
      !("version" in deployment) ||
      typeof deployment.version !== "string" ||
      !deployment.version
    ) return false;

    if (deployment.version === import.meta.env.VITE_APP_VERSION) {
      sessionStorage.removeItem(resetVersionKey);
      return false;
    }
    if (sessionStorage.getItem(resetVersionKey) === deployment.version)
      return false;

    const registration = "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration()
      : undefined;
    if (registration) {
      if ("caches" in window) {
        const names = await window.caches.keys();
        await Promise.all(names
          .filter((name) => name.startsWith("workbox-precache-") &&
            name.endsWith(registration.scope))
          .map((name) => window.caches.delete(name)));
      }
      await registration.unregister();
    }
    sessionStorage.setItem(resetVersionKey, deployment.version);
    reload();
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};
