import { expect, test } from "vitest";
import { createTestStore, makeSong, makeUser } from "../../test/fixtures";
import { resetSessionState } from "../rootReducer";
import audioPlayer, {
  deleteSong,
  playNext,
  playPrevious,
} from "./audioPlayerSlice";
import userPreferences, {
  addFavorite,
  addRecentlyPlayed,
  setRecentlyPlayed,
} from "./userPreferencesSlice";
test("history accepts old dictionaries and can record another listen", () => {
  let state = userPreferences(
    undefined,
    setRecentlyPlayed({ s1: makeSong({ song_id: "s1", title: "First" }) }),
  );
  state = userPreferences(
    state,
    addRecentlyPlayed(makeSong({ song_id: "s2", title: "Second" })),
  );
  expect(state.recentlyPlayed?.map((song) => song.song_id)).toEqual([
    "s2",
    "s1",
  ]);
  state = userPreferences(
    state,
    addRecentlyPlayed(makeSong({ song_id: "s1", title: "First" })),
  );
  expect(state.recentlyPlayed?.map((song) => song.song_id)).toEqual([
    "s1",
    "s2",
  ]);
});
test("deleting a playing song removes it from the queue and selects a remaining song", () => {
  const state = audioPlayer(
    {
      viewingSongList: { s1: makeSong({ song_id: "s1" }) },
      playingSongList: {
        s1: makeSong({ song_id: "s1" }),
        s2: makeSong({ song_id: "s2" }),
      },
      playingIndex: "s1",
      searchPlayback: null,
    },
    deleteSong("s1"),
  );
  expect(state.viewingSongList).toEqual({});
  expect(state.playingSongList).toEqual({ s2: makeSong({ song_id: "s2" }) });
  expect(state.playingIndex).toBe("s2");
});
test("empty queues preserve a null selection", () => {
  const state = {
    viewingSongList: {},
    playingSongList: {},
    playingIndex: null,
    searchPlayback: null,
  };
  expect(audioPlayer(state, playNext()).playingIndex).toBeNull();
  expect(audioPlayer(state, playPrevious()).playingIndex).toBeNull();
});
test("favorites cannot contain the same song twice", () => {
  let state = userPreferences(undefined, addFavorite("s1"));
  state = userPreferences(state, addFavorite("s1"));
  expect(state.favorites).toEqual(["s1"]);
});

test("changing or ending a session clears the previous account's profile, library, preferences, and queue", () => {
  const store = createTestStore({
    homepage: {
      user: makeUser(),
      playlistCollection: [
        { id: "mine", title: "Mine", type: "user", collection: [] },
      ],
    },
    audioplayer: {
      viewingSongList: { s1: makeSong() },
      playingSongList: { s1: makeSong() },
      playingIndex: "s1",
    },
    userPrefs: {
      favorites: ["s1"],
      recentlyPlayed: [makeSong()],
      listens: { s1: 3 },
    },
  });
  store.dispatch(resetSessionState());
  expect(store.getState()).toEqual({
    homepage: { user: null, playlistCollection: null },
    audioplayer: {
      viewingSongList: null,
      playingSongList: null,
      playingIndex: null,
      searchPlayback: null,
    },
    userPrefs: {
      favorites: null,
      recentlyPlayed: null,
      listens: null,
      favoriteUpdates: {},
    },
  });
});
