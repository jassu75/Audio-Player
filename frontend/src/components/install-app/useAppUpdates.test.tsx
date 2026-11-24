import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { RegisterSWOptions } from "virtual:pwa-register/react";
import InstallApp from "./InstallApp";
import useAppUpdates from "./useAppUpdates";
import { deferred } from "../../test/fixtures";

const worker = vi.hoisted(() => ({
  options: undefined as RegisterSWOptions | undefined,
  forceUpdate: vi.fn(),
}));

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: RegisterSWOptions) => {
    worker.options = options;
    return {
      needRefresh: [true, vi.fn()],
      updateServiceWorker: worker.forceUpdate,
    };
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  worker.options = undefined;
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const register = (update = vi.fn().mockResolvedValue(undefined)) => {
  const registration = { update, installing: null } as unknown as ServiceWorkerRegistration;
  act(() => worker.options?.onRegisteredSW?.("/sw.js", registration));
  return update;
};

test("a waiting update does not show an Update prompt or request activation in an open installed app", () => {
  vi.stubGlobal("navigator", {
    userAgent: "iPhone", platform: "iPhone", maxTouchPoints: 1,
    standalone: true, onLine: true,
  });
  const { unmount } = render(<InstallApp />);
  register();
  expect(worker.options?.immediate).toBe(true);
  expect(worker.options?.onNeedReload).toBeTypeOf("function");
  act(() => worker.options?.onNeedReload?.());
  expect(screen.queryByRole("button", { name: "Update" })).not.toBeInTheDocument();
  expect(screen.queryByText("A new version is ready")).not.toBeInTheDocument();
  expect(worker.forceUpdate).not.toHaveBeenCalled();
  unmount();
});

test("downloads updates periodically while visible and checks again when returning or reconnecting", async () => {
  const { unmount } = renderHook(useAppUpdates);
  const update = register();
  await act(async () => { await vi.advanceTimersByTimeAsync(5 * 60 * 1000); });
  expect(update).toHaveBeenCalledTimes(1);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
  });
  expect(update).toHaveBeenCalledTimes(1);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  await act(async () => { document.dispatchEvent(new Event("visibilitychange")); });
  expect(update).toHaveBeenCalledTimes(2);
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  await act(async () => { await vi.advanceTimersByTimeAsync(5 * 60 * 1000); });
  expect(update).toHaveBeenCalledTimes(2);
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
  await act(async () => { window.dispatchEvent(new Event("online")); });
  expect(update).toHaveBeenCalledTimes(3);
  expect(worker.forceUpdate).not.toHaveBeenCalled();
  unmount();
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("online"));
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
  });
  expect(update).toHaveBeenCalledTimes(3);
});

test("avoids overlapping checks and retries a failed download on the next check", async () => {
  const pending = deferred<void>();
  const update = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValue(undefined);
  const { unmount } = renderHook(useAppUpdates);
  register(update);
  await act(async () => {
    window.dispatchEvent(new Event("online"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(update).toHaveBeenCalledTimes(1);
  await act(async () => { pending.resolve(); });
  update.mockRejectedValueOnce(new Error("Network unavailable"));
  await act(async () => { window.dispatchEvent(new Event("online")); });
  await act(async () => { await vi.advanceTimersByTimeAsync(5 * 60 * 1000); });
  expect(update).toHaveBeenCalledTimes(3);
  expect(worker.forceUpdate).not.toHaveBeenCalled();
  unmount();
});
