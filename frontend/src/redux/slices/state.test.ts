import { expect, test } from "vitest";
import { makeSong } from "../../test/fixtures";
import audioPlayer, { deleteSong, playNext, playPrevious } from "./audioPlayerSlice";
import userPreferences, { addFavorite, addRecentlyPlayed, setRecentlyPlayed } from "./userPreferencesSlice";
test("history accepts old dictionaries and can record another listen", () => {
    let state = userPreferences(undefined, setRecentlyPlayed({ s1: makeSong({ song_id: "s1", title: "First" }) }));
    state = userPreferences(state, addRecentlyPlayed(makeSong({ song_id: "s2", title: "Second" })));
    expect(state.recentlyPlayed?.map((song) => song.song_id)).toEqual(["s2", "s1"]);
    state = userPreferences(state, addRecentlyPlayed(makeSong({ song_id: "s1", title: "First" })));
    expect(state.recentlyPlayed?.map((song) => song.song_id)).toEqual(["s1", "s2"]);
});
test("deleting a playing song removes it from the queue and selects a remaining song", () => {
    const state = audioPlayer({
        viewingSongList: { s1: makeSong({ song_id: "s1" }) },
        playingSongList: { s1: makeSong({ song_id: "s1" }), s2: makeSong({ song_id: "s2" }) },
        playingIndex: "s1",
    }, deleteSong("s1"));
    expect(state.viewingSongList).toEqual({});
    expect(state.playingSongList).toEqual({ s2: makeSong({ song_id: "s2" }) });
    expect(state.playingIndex).toBe("s2");
});
test("empty queues preserve a null selection", () => {
    const state = { viewingSongList: {}, playingSongList: {}, playingIndex: null };
    expect(audioPlayer(state, playNext()).playingIndex).toBeNull();
    expect(audioPlayer(state, playPrevious()).playingIndex).toBeNull();
});
test("favorites cannot contain the same song twice", () => {
    let state = userPreferences(undefined, addFavorite("s1"));
    state = userPreferences(state, addFavorite("s1"));
    expect(state.favorites).toEqual(["s1"]);
});
