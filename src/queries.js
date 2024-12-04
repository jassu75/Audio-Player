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
