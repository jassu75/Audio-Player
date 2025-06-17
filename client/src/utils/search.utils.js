export const filterSongs = (songsList, query) => {
  const songTitles = new Set();
  const result = {};
  const searchText = query.toLowerCase();

  for (const [id, song] of Object.entries(songsList)) {
    const title = song.title.toLowerCase();
    if (title.includes(searchText) && !songTitles.has(title)) {
      songTitles.add(title);
      result[id] = song;
    }
  }
  return result;
};
