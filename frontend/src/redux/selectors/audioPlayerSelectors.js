export const viewingSongListSelector = (state) =>
  state.audioplayer.viewingSongList;
export const playingSongListSelector = (state) =>
  state.audioplayer.playingSongList;
export const playingIndexSelector = (state) => state.audioplayer.playingIndex;

export const currentSongSelector = (state) =>
  state.audioplayer.playingSongList?.[playingIndexSelector(state)] ?? null;

