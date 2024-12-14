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

export const DELETE_SONG = gql`
  mutation DELETE_SONG($id: uuid!) {
    delete_audio_details_by_pk(id: $id) {
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
  ) {
    insert_users(
      objects: {
        id: $id
        email_id: $email_id
        username: $username
        sign_in_method: $sign_in_method
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
