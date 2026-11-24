import { SONG_FIELDS, SONG_VISIBILITY } from "./songFields.js";
export const CHECK_EXISTING_USER = `
query CHECK_EXISTING_USER($user_id: String!) {
    users:users_by_pk(user_id:$user_id) {
      user_id
      username
      email_id
    }

  }
`;
export const VERIFY_EMAIL = `
query VERIFY_EMAIL($email_id: String) {
  users(where: { email_id: { _eq: $email_id } }) {
    email_id
  }
}
`;
export const FETCH_PLAYLIST_SONGS = `
query FETCH_PLAYLIST_SONGS($playlist_id: uuid!, $user_id: String!) {
  playlists: playlist_songs(where: {playlist_id: {_eq: $playlist_id}, audio_detail: {${SONG_VISIBILITY}}}) {
    songs: audio_detail { ${SONG_FIELDS} }
  }
}
`;
export const FETCH_USER_SONGS_RANDOMLY = `
query FETCH_USER_SONGS_RANDOMLY($user_id: String!) {
  randomSongs: fetch_user_songs_randomly(args: {userid: $user_id}) { ${SONG_FIELDS} }
}
`;
export const GET_PLAYLISTS = `
query GET_PLAYLISTS($user_id: String!) {
  playlist_details(where: { user_id: { _eq: $user_id } }) {
    playlist_id
    playlist_title
    playlist_cover_art
  }
}

`;
export const FETCH_SYSTEM_PLAYLISTS = `
  query FETCH_SYSTEM_PLAYLISTS @cached {
    playlist_details(where: { 
      user_id: { _is_null: true },
      source: { _neq: "user" }
    }) {
      playlist_id
      playlist_title
      playlist_cover_art
      source
    }
  }
`;
export const VERIFY_PLAYLIST_EMPTY = `
query VERIFY_PLAYLIST_EMPTY($playlist_id:uuid!){
  playlist_songs(where:{playlist_id:{_eq:$playlist_id}},limit:1){
    playlist_id
  }
}
`;
export const FETCH_SEARCH_SONGS = `
query FETCH_SEARCH_SONGS($user_id: String!, $search_text: String!) {
  searchResults: audio_details(where: {
    _and: [
      { ${SONG_VISIBILITY} },
      { _or: [{title: {_ilike: $search_text}}, {artist: {_ilike: $search_text}}, {album: {_ilike: $search_text}}] }
    ]
  }, order_by: [{title: asc}, {song_id: asc}], limit: 50) { ${SONG_FIELDS} }
}
`;

export const FETCH_FAVORITE_IDS = `
query FETCH_FAVORITE_IDS($user_id: String!) {
  favoriteIds:favorites(where: {user_id: {_eq: $user_id}}) {
    favorite_id
  }
}

`;
export const FETCH_ASSETS = `
query FETCH_ASSETS($user_id:String!) {
  assets:audio_details(where: {user_id: {_eq: $user_id}}) {
    audio_url_id
    cover_art_id
  }
}
`;
export const FETCH_FAVORITES = `
query FETCH_FAVORITES($user_id: String!) {
  favorites(where: {user_id: {_eq: $user_id}, audio_detail: {${SONG_VISIBILITY}}}) {
    song: audio_detail { ${SONG_FIELDS} }
  }
}
`;

export const FIND_ACCESSIBLE_SONG = `
query FIND_ACCESSIBLE_SONG($song_id: uuid!, $user_id: String!) {
  songs: audio_details(where: {song_id: {_eq: $song_id}, ${SONG_VISIBILITY}}, limit: 1) { song_id }
}
`;

export const FETCH_PLAY_EVENTS = `
query FETCH_PLAY_EVENTS($user_id: String!, $before: timestamptz!, $cursor: play_events_bool_exp!, $limit: Int!) {
  events: play_events(where: {user_id: {_eq: $user_id}, played_at: {_lte: $before}, _and: [$cursor]}, order_by: {id: asc}, limit: $limit) {
    id song_id played_at
  }
}
`;
export const FETCH_LISTENED_SONGS = `
query FETCH_LISTENED_SONGS($user_id: String!, $song_ids: [uuid!]!, $limit: Int!) {
  songs: audio_details(where: {song_id: {_in: $song_ids}, ${SONG_VISIBILITY}}, limit: $limit) { ${SONG_FIELDS} }
}
`;
