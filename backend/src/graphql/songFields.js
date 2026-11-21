export const SONG_FIELDS = `
    song_id title artist album duration genre release_year
    cover_art audio_url cover_art_id audio_url_id last_played listens user_id source
`;

export const SONG_VISIBILITY = `
    _or: [
        { user_id: { _eq: $user_id } },
        { user_id: { _is_null: true }, source: { _neq: "user" } }
    ]
`;
