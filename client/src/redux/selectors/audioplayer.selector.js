export const viewingSonglistSelector = (state) =>
  state.audioplayer.viewingSonglist;
export const playingSonglistSelector = (state) =>
  state.audioplayer.playingSonglist;
export const playingIndexSelector = (state) => state.audioplayer.playingIndex;

export const currentSongSelector = (state) =>
  state.audioplayer.playingSonglist?.[state.audioplayer.playingIndex] ?? null;
