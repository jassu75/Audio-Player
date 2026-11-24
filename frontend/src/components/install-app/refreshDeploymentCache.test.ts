import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { refreshDeploymentCache } from "./refreshDeploymentCache";

const scope = "https://musify.example/";
const appCache = `workbox-precache-v2-${scope}`;

const setup = (version = "new-build") => {
  const registration = { scope, unregister: vi.fn().mockResolvedValue(true) };
  const workers = { getRegistration: vi.fn().mockResolvedValue(registration) };
  const cacheStorage = {
    keys: vi.fn().mockResolvedValue([
      appCache,
      "workbox-precache-v2-https://musify.example/another-app/",
      "unrelated-cache",
    ]),
    delete: vi.fn().mockResolvedValue(true),
  };
  const fetchVersion = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ version }),
  });
  vi.stubGlobal("navigator", { onLine: true, serviceWorker: workers });
  vi.stubGlobal("caches", cacheStorage);
  vi.stubGlobal("fetch", fetchVersion);
  return { registration, workers, cacheStorage, fetchVersion };
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("VITE_APP_VERSION", "current-build");
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test("a new deployment clears only this app's precache and unregisters before reloading", async () => {
  const { registration, cacheStorage, fetchVersion } = setup();
  localStorage.setItem("preferences", "keep");
  sessionStorage.setItem("userPrefs", "keep");
  const reload = vi.fn();
  expect(await refreshDeploymentCache(reload)).toBe(true);
  expect(fetchVersion).toHaveBeenCalledWith("/version.json", {
    cache: "no-store",
    signal: expect.any(AbortSignal),
  });
  expect(cacheStorage.delete).toHaveBeenCalledExactlyOnceWith(appCache);
  expect(registration.unregister).toHaveBeenCalledTimes(1);
  expect(cacheStorage.delete.mock.invocationCallOrder[0]).toBeLessThan(
    registration.unregister.mock.invocationCallOrder[0],
  );
  expect(registration.unregister.mock.invocationCallOrder[0]).toBeLessThan(
    reload.mock.invocationCallOrder[0],
  );
  expect(reload).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem("preferences")).toBe("keep");
  expect(sessionStorage.getItem("userPrefs")).toBe("keep");
});

test("the same deployment preserves the cache without reloading", async () => {
  const { registration, cacheStorage } = setup("current-build");
  const reload = vi.fn();
  expect(await refreshDeploymentCache(reload)).toBe(false);
  expect(cacheStorage.delete).not.toHaveBeenCalled();
  expect(registration.unregister).not.toHaveBeenCalled();
  expect(reload).not.toHaveBeenCalled();
});

test("an inconsistent deployment cannot cause a reload loop and later deployments still reset", async () => {
  setup();
  const reload = vi.fn();
  expect(await refreshDeploymentCache(reload)).toBe(true);
  expect(await refreshDeploymentCache(reload)).toBe(false);
  setup("next-build");
  expect(await refreshDeploymentCache(reload)).toBe(true);
  expect(reload).toHaveBeenCalledTimes(2);
});

test("loading the new build clears the retry guard for future visits", async () => {
  setup();
  const reload = vi.fn();
  expect(await refreshDeploymentCache(reload)).toBe(true);
  vi.stubEnv("VITE_APP_VERSION", "new-build");
  expect(await refreshDeploymentCache(reload)).toBe(false);
  expect(sessionStorage.getItem("musify-cache-reset-version")).toBeNull();
});

test("offline launches and failed or invalid version responses preserve the cached app", async () => {
  const { cacheStorage, fetchVersion } = setup();
  const reload = vi.fn();
  vi.stubGlobal("navigator", { onLine: false });
  expect(await refreshDeploymentCache(reload)).toBe(false);
  expect(fetchVersion).not.toHaveBeenCalled();
  vi.stubGlobal("navigator", { onLine: true });
  fetchVersion.mockRejectedValueOnce(new Error("offline"));
  expect(await refreshDeploymentCache(reload)).toBe(false);
  fetchVersion.mockResolvedValueOnce({ ok: false });
  expect(await refreshDeploymentCache(reload)).toBe(false);
  fetchVersion.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  expect(await refreshDeploymentCache(reload)).toBe(false);
  expect(cacheStorage.delete).not.toHaveBeenCalled();
  expect(reload).not.toHaveBeenCalled();
});

test("a stalled version check aborts after three seconds without clearing the cache", async () => {
  const { cacheStorage, fetchVersion } = setup();
  fetchVersion.mockImplementation((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("timeout")));
  }));
  const reload = vi.fn();
  const result = refreshDeploymentCache(reload);
  await vi.advanceTimersByTimeAsync(3000);
  expect(await result).toBe(false);
  expect(cacheStorage.delete).not.toHaveBeenCalled();
  expect(reload).not.toHaveBeenCalled();
});

test("a stale page without a service worker also reloads for a new deployment", async () => {
  setup();
  vi.stubGlobal("navigator", { onLine: true });
  const reload = vi.fn();
  expect(await refreshDeploymentCache(reload)).toBe(true);
  expect(reload).toHaveBeenCalledTimes(1);
});
