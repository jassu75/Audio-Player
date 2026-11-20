export const indexSongs = (songs = []) => Object.fromEntries(
  songs.filter((song) => song?.song_id).map((song) => [song.song_id, song]),
);

// Older sessions stored history as a dictionary instead of an ordered array.
export const normalizeRecentlyPlayed = (songs) => {
  if (!songs || typeof songs !== "object") return null;
  return Object.values(indexSongs(Object.values(songs))).slice(0, 50);
};
