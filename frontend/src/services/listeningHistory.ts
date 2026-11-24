import axios from "axios";
import { postApi } from "./api";
import type { ApiEndpoints } from "./types/api.types";

const pendingPlays = new Map<string, Set<Promise<void>>>();

const sendPlayEvent = async (
  data: ApiEndpoints["/api/play-events"]["request"],
) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await postApi("/api/play-events", data, { timeout: 10000 });
      return;
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      if (
        attempt === 2 ||
        (status !== undefined && status < 500 && status !== 429)
      )
        throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
};

export const recordPlayEvent = (
  data: ApiEndpoints["/api/play-events"]["request"],
) => {
  const pending = pendingPlays.get(data.user_id) ?? new Set<Promise<void>>();
  pendingPlays.set(data.user_id, pending);
  const request = sendPlayEvent(data);
  pending.add(request);
  const cleanup = () => {
    pending.delete(request);
    if (!pending.size) pendingPlays.delete(data.user_id);
  };
  request.then(cleanup, cleanup);
  return request;
};

export const waitForPendingPlays = async (userId: string) => {
  await Promise.allSettled(pendingPlays.get(userId) ?? []);
};
