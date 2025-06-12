export const CHECK_EXISTING_USER = `
  query CHECK_EXISTING_USER($email: String!) {
    users(where: { email_id: { _eq: $email } }) {
      id
      username
      email_id
      homepage_songs
      playlist_ids
      sign_in_method
    }
  }
`;

export const GET_SONGS = `
 query GET_SONGS($song_ids: [uuid!]) {
    audio_details(where: {id: {_in: $song_ids}}) {
      id
      title
      artist
      album
      duration
      genre
      release_year
      cover_art
      audio_url
    }
  }
`;

export const GET_PLAYLISTS = `
  query GET_PLAYLISTS($playlist_ids: [uuid!]) {
    playlist_details(where: {id: {_in: $playlist_ids}}) {
      id
      playlist_title
      playlist_cover_art
      playlist_songs
    }
  }
`;
