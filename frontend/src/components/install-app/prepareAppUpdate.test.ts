import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { prepareAppUpdate } from "./prepareAppUpdate";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const setup = () => {
  const registration = Object.assign(new EventTarget(), {
    waiting: null as ServiceWorker | null,
    installing: null as ServiceWorker | null,
    update: vi.fn().mockResolvedValue(undefined),
  });
  const workers = Object.assign(new EventTarget(), {
    controller: {} as ServiceWorker,
    getRegistration: vi.fn().mockResolvedValue(registration),
  });
  const pending = Object.assign(new EventTarget(), {
    state: "installing" as ServiceWorkerState,
    postMessage: vi.fn(() => workers.dispatchEvent(new Event("controllerchange"))),
  });
  const browser = { onLine: true, serviceWorker: workers };
  vi.stubGlobal("navigator", browser);
  return { registration, workers, pending, browser };
};

test("activates an already downloaded update before the app starts and reloads once", async () => {
  const { registration, workers, pending } = setup();
  registration.waiting = pending as unknown as ServiceWorker;
  const reload = vi.fn();
  expect(await prepareAppUpdate(reload)).toBe(true);
  expect(pending.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  expect(reload).toHaveBeenCalledTimes(1);
  workers.dispatchEvent(new Event("controllerchange"));
  expect(reload).toHaveBeenCalledTimes(1);
});

test("waits for a new update found during startup to finish installing", async () => {
  const { registration, pending } = setup();
  registration.update.mockImplementation(async () => {
    registration.installing = pending as unknown as ServiceWorker;
    registration.dispatchEvent(new Event("updatefound"));
  });
  const reload = vi.fn();
  const startup = prepareAppUpdate(reload);
  await vi.advanceTimersByTimeAsync(0);
  expect(reload).not.toHaveBeenCalled();
  registration.installing = null;
  registration.waiting = pending as unknown as ServiceWorker;
  pending.state = "installed";
  pending.dispatchEvent(new Event("statechange"));
  expect(await startup).toBe(true);
  expect(reload).toHaveBeenCalledTimes(1);
});

test("an up-to-date launch starts normally without reloading", async () => {
  const { registration } = setup();
  const reload = vi.fn();
  expect(await prepareAppUpdate(reload)).toBe(false);
  expect(registration.update).toHaveBeenCalledTimes(1);
  expect(reload).not.toHaveBeenCalled();
});

test("reloads when an automatic update takes control without waiting for activation", async () => {
  const { registration, workers } = setup();
  registration.update.mockImplementation(async () => {
    workers.dispatchEvent(new Event("controllerchange"));
  });
  const reload = vi.fn();
  expect(await prepareAppUpdate(reload)).toBe(true);
  expect(reload).toHaveBeenCalledTimes(1);
  workers.dispatchEvent(new Event("controllerchange"));
  expect(reload).toHaveBeenCalledTimes(1);
});

test("a slow update does not block startup indefinitely or reload after playback could have begun", async () => {
  const { registration, workers, pending } = setup();
  registration.update.mockReturnValue(new Promise(() => {}));
  const reload = vi.fn();
  const startup = prepareAppUpdate(reload);
  await vi.advanceTimersByTimeAsync(8000);
  expect(await startup).toBe(false);
  registration.waiting = pending as unknown as ServiceWorker;
  registration.dispatchEvent(new Event("updatefound"));
  workers.dispatchEvent(new Event("controllerchange"));
  expect(pending.postMessage).not.toHaveBeenCalled();
  expect(reload).not.toHaveBeenCalled();
});

test("offline launches and failed update checks keep the existing version usable", async () => {
  const { registration, browser } = setup();
  const reload = vi.fn();
  browser.onLine = false;
  expect(await prepareAppUpdate(reload)).toBe(false);
  expect(registration.update).not.toHaveBeenCalled();
  browser.onLine = true;
  registration.update.mockRejectedValue(new Error("Network unavailable"));
  expect(await prepareAppUpdate(reload)).toBe(false);
  expect(reload).not.toHaveBeenCalled();
});

test("a downloaded update that cannot activate lets the existing app start", async () => {
  const { registration, pending } = setup();
  registration.waiting = pending as unknown as ServiceWorker;
  pending.postMessage.mockImplementation(() => false);
  const reload = vi.fn();
  const startup = prepareAppUpdate(reload);
  await vi.advanceTimersByTimeAsync(8000);
  expect(await startup).toBe(false);
  expect(reload).not.toHaveBeenCalled();
});

test("an update still downloading when startup times out does not block the existing app", async () => {
  const { registration, pending } = setup();
  registration.installing = pending as unknown as ServiceWorker;
  const startup = prepareAppUpdate(vi.fn());
  await vi.advanceTimersByTimeAsync(8000);
  expect(await startup).toBe(false);
});
