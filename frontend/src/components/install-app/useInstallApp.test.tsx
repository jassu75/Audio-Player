import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import useInstallApp from "./useInstallApp";

beforeEach(() => sessionStorage.removeItem("installPromptDismissed"));
afterEach(() => vi.unstubAllGlobals());

test("offers installation after the browser grants an install prompt", async () => {
  const { result } = renderHook(useInstallApp);
  const event = new Event("beforeinstallprompt", { cancelable: true });
  const prompt = vi.fn().mockResolvedValue({ outcome: "accepted" });
  Object.assign(event, { prompt });
  act(() => { window.dispatchEvent(event); });
  expect(event.defaultPrevented).toBe(true);
  expect(result.current.canInstall).toBe(true);
  await act(async () => { await result.current.install(); });
  expect(prompt).toHaveBeenCalledTimes(1);
  expect(result.current.canInstall).toBe(false);
});

test("iPhone browsers get Add to Home Screen instructions", () => {
  vi.stubGlobal("navigator", { userAgent: "iPhone", platform: "iPhone", maxTouchPoints: 1 });
  const { result } = renderHook(useInstallApp);
  expect(result.current.isIOS).toBe(true);
  expect(result.current.nativePromptAvailable).toBe(false);
  expect(result.current.canInstall).toBe(true);
  act(() => result.current.dismiss());
  expect(result.current.canInstall).toBe(false);
});

test("installed iPhone apps do not show an installation prompt", () => {
  vi.stubGlobal("navigator", { userAgent: "iPhone", platform: "iPhone", maxTouchPoints: 1, standalone: true });
  const { result } = renderHook(useInstallApp);
  expect(result.current.canInstall).toBe(false);
});

test("a rejected install request leaves a useful browser-menu fallback", async () => {
  const { result } = renderHook(useInstallApp);
  const event = new Event("beforeinstallprompt");
  Object.assign(event, { prompt: vi.fn().mockRejectedValue(new Error("Unavailable")) });
  act(() => { window.dispatchEvent(event); });
  await act(async () => { await result.current.install(); });
  await waitFor(() => expect(result.current.error).toContain("browser menu"));
});
