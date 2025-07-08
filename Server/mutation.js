export const ADD_SONG = `
  mutation ADD_SONG(
    $title: String!
    $artist: String!
    $album: String!
    $duration: Int!
    $genre: jsonb!
    $release_year: String!
    $cover_art: String!
    $audio_url: String!
    $cover_art_id:String!
    $audio_url_id:String!
    $user_id:String!
  ) {
    audio_details:insert_audio_details(
      objects: {
        title: $title
        artist: $artist
        album: $album
        duration: $duration
        genre: $genre
        release_year: $release_year
        cover_art: $cover_art
        audio_url: $audio_url
        cover_art_id:$cover_art_id
        audio_url_id:$audio_url_id
        user_id:$user_id
      }
    ) {
      returning {
        song_id
        title
        artist
      }
    }
  }
`;

export const DELETE_SONG = `
mutation DELETE_SONG($song_id:uuid!){
  delete_audio_details_by_pk(song_id:$song_id){
    song_id
  }
}
`;

export const DELETE_PLAYLIST_SONG = `
mutation DELETE_PLAYLIST_SONG($playlist_id:uuid!,$song_id:uuid!){
  delete_playlist_songs_by_pk(playlist_id:$playlist_id,song_id:$song_id){
    song_id
  }
}`;

export const ADD_PLAYLIST = `
  mutation ADD_PLAYLIST(
    $playlist_title: String!
    $playlist_cover_art: String!
    $user_id: String!
  ) {
    playlist_details:insert_playlist_details(
      objects: {
        playlist_title: $playlist_title
        playlist_cover_art: $playlist_cover_art
        user_id: $user_id
      }
    ) {
      returning {
        playlist_id
        playlist_title
        playlist_cover_art
      }
    }
  }
`;

export const DELETE_PLAYLIST = `
mutation DELETE_PLAYLIST($playlist_id: uuid!) {
  delete_playlist_details_by_pk(playlist_id: $playlist_id) {
    playlist_id
  }
}
`;

export const DELETE_USER = `
  mutation DELETE_USER($user_id: String!) {
    delete_users_by_pk(user_id: $user_id) {
      user_id
    }
  }
`;

export const ADD_PLAYLIST_SONG = `
mutation ADD_PLAYLIST_SONG ($song_id:uuid!,$playlist_id:uuid!){
 insert_playlist_songs_one(
  object:{
  song_id:$song_id,
  playlist_id:$playlist_id
}
){
  song_id
  playlist_id
  
}
}
`;

export const ADD_USER = `
  mutation ADD_USER(
    $user_id: String!
    $email_id: String!
    $username: String!
    $sign_in_method: String!
   
  ) {
    insert_users(
      objects: {
        user_id: $user_id
        email_id: $email_id
        username: $username
        sign_in_method: $sign_in_method
       
      }
    ) {
      returning {
        user_id
        email_id
        username
      }
    }
  }
`;

export const UPDATE_SONG_TITLE = `
mutation UPDATE_SONG_TITLE($song_id: uuid!, $title: String!) {
  update_audio_details_by_pk(
    pk_columns: { song_id: $song_id }
    _set: { title: $title }
  ) {
    song_id
    title
  }
}
`;

export const UPDATE_PLAYLIST_TITLE = `
mutation UPDATE_PLAYLIST_TITLE($playlist_id: uuid!, $playlist_title: String!) {
  update_playlist_details_by_pk(
    pk_columns: { playlist_id:$playlist_id }
    _set: { playlist_title: $playlist_title }
  ) {
    playlist_id
    playlist_title
  }
}
`;

export const UPDATE_USER_PREFERENCE = `
mutation UPDATE_USER_PREFERENCE($recently_played:[audio_details_updates!]!){
  update_audio_details_many(updates:$recently_played){
    affected_rows
  }
}

  `;

export const ADD_FAVORITE = `
mutation ADD_FAVORITE($user_id:String!,$favorite_id:uuid!){
  insert_favorites(objects:{user_id:$user_id,favorite_id:$favorite_id}){
    returning{
      user_id
      favorite_id
    }
  }
}
`;

export const DELETE_FAVORITE = `
mutation DELETE_FAVORITE($user_id: String!, $favorite_id: uuid!) {
  delete_favorites_by_pk(favorite_id: $favorite_id, user_id: $user_id) {
    favorite_id
    user_id
  }
}
`;
