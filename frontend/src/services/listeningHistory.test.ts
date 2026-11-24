import axios, { AxiosError } from "axios";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { recordPlayEvent, waitForPendingPlays } from "./listeningHistory";

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});
const data = {
  event_id: "11111111-1111-4111-8111-111111111111",
  song_id: "22222222-2222-4222-8222-222222222222",
  user_id: "u1",
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

test("history navigation waits for pending writes and retries reuse the same event ID", async () => {
  vi.mocked(axios.post)
    .mockRejectedValueOnce(new AxiosError("offline", "ERR_NETWORK"))
    .mockResolvedValueOnce({ data: { recorded: true } });
  const recorded = recordPlayEvent(data);
  let flushed = false;
  const flush = waitForPendingPlays("u1").then(() => {
    flushed = true;
  });
  expect(flushed).toBe(false);
  await vi.advanceTimersByTimeAsync(500);
  await recorded;
  await flush;
  expect(flushed).toBe(true);
  expect(axios.post).toHaveBeenCalledTimes(2);
  for (const call of vi.mocked(axios.post).mock.calls) {
    expect(call[0]).toBe("/api/play-events");
    expect(call[1]).toEqual(data);
    expect(call[2]).toEqual(
      expect.objectContaining({ timeout: 10000, withCredentials: true }),
    );
  }
});

test("an expired or different account's session is not retried", async () => {
  const error = Object.assign(new AxiosError("different account"), {
    response: { status: 403 },
  });
  vi.mocked(axios.post).mockRejectedValueOnce(error);
  await expect(recordPlayEvent(data)).rejects.toBe(error);
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(vi.mocked(axios.post).mock.calls[0][1]).toEqual(
    expect.objectContaining({ user_id: "u1" }),
  );
  await waitForPendingPlays("u1");
});
