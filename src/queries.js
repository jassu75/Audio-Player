import { gql } from "@apollo/client";

export const GET_SONGS = gql`
  query GET_SONGS {
    audio_details {
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

export const CHECK_EXISTING_USER = gql`
  query CHECK_EXISTING_USER($email: String!) {
    users(where: { email_id: { _eq: $email } }) {
      id
      username
      email_id
      homepage_songs
      sign_in_method
    }
  }
`;

export const GET_HOMEPAGE_SONGS = gql`
  query GET_HOMEPAGE_SONGS($userId: uuid!) {
    user(id: $userId) {
      homepage_songs
    }
  }
`;
