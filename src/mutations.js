import { gql } from "@apollo/client";

export const ADD_SONG = gql`
  mutation ADD_SONG(
    $title: String!
    $artist: String!
    $album: String!
    $duration: Int!
    $genre: jsonb!
    $release_year: String!
    $cover_art: String!
    $audio_url: String!
  ) {
    insert_audio_details(
      objects: {
        title: $title
        artist: $artist
        album: $album
        duration: $duration
        genre: $genre
        release_year: $release_year
        cover_art: $cover_art
        audio_url: $audio_url
      }
    ) {
      returning {
        id
        title
        artist
      }
    }
  }
`;

export const ADD_PLAYLIST = gql`
  mutation ADD_PLAYLIST(
    $playlist_title: String!
    $playlist_cover_art: String!
    $playlist_songs:jsonb
  ) {
    insert_playlist_details(
      objects: {
        playlist_title: $playlist_title
        playlist_cover_art: $playlist_cover_art
        playlist_songs:$playlist_songs
      }
    ) {
      returning {
        id
        playlist_title
        playlist_cover_art
      }
    }
  }
`;

export const DELETE_PLAYLIST = gql`
  mutation DELETE_PLAYLIST($id: uuid!) {
    delete_playlist_details_by_pk(id: $id) {
      id
    }
  }
`;

export const ADD_USER = gql`
  mutation ADD_USER(
    $id: String!
    $email_id: String!
    $username: String!
    $sign_in_method: String!
    $homepage_songs: jsonb
    $playlist_ids:jsonb
  ) {
    insert_users(
      objects: {
        id: $id
        email_id: $email_id
        username: $username
        sign_in_method: $sign_in_method
        homepage_songs: $homepage_songs
        playlist_ids:$playlist_ids
      }
    ) {
      returning {
        id
        email_id
        username
      }
    }
  }
`;

export const UPDATE_HOMEPAGE_SONGS = gql`
  mutation UPDATE_HOMEPAGE_SONGS($user_id: String!, $homepage_songs: jsonb) {
    update_users(
      where: { id: { _eq: $user_id } }
      _set: { homepage_songs: $homepage_songs }
    ) {
      returning {
        id
        homepage_songs
      }
    }
  }
`;

export const UPDATE_PLAYLIST_SONGS = gql`
  mutation UPDATE_PLAYLIST_SONGS($playlist_id: uuid!, $playlist_songs: jsonb) {
    update_playlist_details(
      where: { id: { _eq: $playlist_id } }
      _set: { playlist_songs: $playlist_songs }
    ) {
      returning {
        id
        playlist_songs
      }
    }
  }
`;

export const UPDATE_PLAYLIST_IDS = gql`
  mutation UPDATE_PLAYLIST_IDS($user_id: String!, $playlist_ids: jsonb) {
    update_users(
      where: { id: { _eq: $user_id } }
      _set: { playlist_ids: $playlist_ids }
    ) {
      returning {
        id
        playlist_ids
      }
    }
  }
`;
