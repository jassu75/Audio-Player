import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import AppUpdateGate from "./AppUpdateGate";
import { prepareAppUpdate } from "./prepareAppUpdate";
import type { AppUpdateResult } from "./types/AppUpdateGate.types";
import { deferred } from "../../test/fixtures";

vi.mock("./prepareAppUpdate", () => ({ prepareAppUpdate: vi.fn() }));
beforeEach(() => vi.clearAllMocks());

test("does not mount the app or player while checking for updates", async () => {
  const pending = deferred<AppUpdateResult>();
  const content = vi.fn(() => <p>Music library</p>);
  const Content = content;
  render(<AppUpdateGate startup={pending.promise}><Content /></AppUpdateGate>);
  expect(screen.getByText("Checking for updates")).toBeInTheDocument();
  expect(content).not.toHaveBeenCalled();
  await act(async () => pending.resolve({ status: "ready" }));
  expect(screen.getByText("Music library")).toBeInTheDocument();
});

test("a required update cannot be dismissed and the app stays blocked until reloading", async () => {
  const pending = deferred<AppUpdateResult>();
  vi.mocked(prepareAppUpdate).mockReturnValueOnce(pending.promise);
  render(<AppUpdateGate startup={Promise.resolve({ status: "required" })}><p>Music library</p></AppUpdateGate>);
  const dialog = await screen.findByRole("alertdialog", { name: "Update required" });
  fireEvent.keyDown(dialog, { key: "Escape" });
  fireEvent.click(dialog);
  expect(screen.queryByText("Music library")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /skip|later|close/i })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(prepareAppUpdate).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Update" })).not.toBeInTheDocument();
  await act(async () => pending.resolve({ status: "reloading" }));
  expect(screen.getByText("Opening the updated app")).toBeInTheDocument();
  expect(screen.queryByText("Music library")).not.toBeInTheDocument();
});

test("failed update attempts retain the mandatory retry screen", async () => {
  vi.mocked(prepareAppUpdate).mockRejectedValueOnce(new Error("Update failed"));
  render(<AppUpdateGate startup={Promise.resolve({ status: "required" })}><p>Music library</p></AppUpdateGate>);
  fireEvent.click(await screen.findByRole("button", { name: "Update" }));
  expect(await screen.findByRole("alertdialog", { name: "Update required" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
  expect(screen.queryByText("Music library")).not.toBeInTheDocument();
});
