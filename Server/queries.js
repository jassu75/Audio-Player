export const CHECK_EXISTING_USER = `
query CHECK_EXISTING_USER($user_id: String!) {
    users:users_by_pk(user_id:$user_id) {
      user_id
      username
      email_id
    }
    user_preferences:user_preferences_by_pk(user_id:$user_id) {
      recently_played
      favorites
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
query FETCH_PLAYLIST_SONGS($playlist_id: uuid!) @cached {
  playlists: playlist_songs(where: {playlist_id: {_eq: $playlist_id}}) {
    songs: audio_detail {
      song_id
      title
      artist
      album
      duration
      genre
      release_year
      cover_art
      audio_url
      cover_art_id
      audio_url_id
      last_played
    }
  }
}

`;

export const FETCH_USER_SONGS_RANDOMLY = `
query FETCH_USER_SONGS_RANDOMLY($user_id: String!) {
  fetch_user_songs_randomly(args: {userid: $user_id}) {
  cover_art
    artist
    song_id
    album
    audio_url
    duration
    genre
    release_year
    title
    last_played
  }
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

export const VERIFY_PLAYLIST_EMPTY = `
query VERIFY_PLAYLIST_EMPTY($playlist_id:uuid!){
  playlist_songs(where:{playlist_id:{_eq:$playlist_id}},limit:1){
    playlist_id
  }
}
`;

export const FETCH_SEARCH_SONGS = `
query FETCH_SEARCH_SONGS($user_id: String!, $search_text: String!) {
  searchResults:audio_details(
    where: {
      _and: [
        { user_id: { _eq: $user_id } },
        { title: { _ilike: $search_text } }
      ]
    },
    limit:7
  ) {
    cover_art
    artist
    song_id
    album
    audio_url
    duration
    genre
    release_year
    title
    last_played
  }
}

`;

export const FETCH_RECENTLY_PLAYED = `
query FETCH_RECENTLY_PLAYED($user_id:String!){
  recently_played:audio_details(
    where:{user_id:{_eq:$user_id}},order_by:{last_played:desc_nulls_last},
    limit:50
  ){
    cover_art
    artist
    song_id
    album
    audio_url
    duration
    genre
    release_year
    title
    last_played
    
  }
}
`;
