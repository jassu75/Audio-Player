BEGIN;
DO $$
DECLARE
    listener_one text := 'verify-listening-' || gen_random_uuid()::text;
    listener_two text := 'verify-listening-' || gen_random_uuid()::text;
    owned_song uuid := gen_random_uuid();
    shared_song uuid;
    first_event uuid := gen_random_uuid();
    result_count bigint;
BEGIN
    IF to_regclass('public.user_song_activity') IS NOT NULL THEN RAISE EXCEPTION 'The summary view still exists'; END IF;
    SELECT song_id INTO shared_song FROM public.audio_details WHERE user_id IS NULL AND source <> 'user' LIMIT 1;
    IF shared_song IS NULL THEN RAISE EXCEPTION 'No shared database track is available for verification'; END IF;
    INSERT INTO public.users (user_id, username, email_id, sign_in_method) VALUES
        (listener_one, listener_one, listener_one || '@example.invalid', 'email'),
        (listener_two, listener_two, listener_two || '@example.invalid', 'email');
    INSERT INTO public.audio_details
        (song_id, title, artist, album, duration, genre, release_year, cover_art, audio_url, cover_art_id, audio_url_id, user_id, source, listens, last_played)
    VALUES
        (owned_song, 'Verification recording', '', '', 60, '[]'::jsonb, '', '/images/defaultMusicImage.webp', 'https://example.invalid/audio', 'static', owned_song::text, listener_one, 'user', 3, '2026-11-19T10:00:00Z');
    INSERT INTO public.play_events (id, user_id, song_id, played_at) VALUES
        (first_event, listener_one, shared_song, '2026-11-20T10:00:00Z'),
        (gen_random_uuid(), listener_one, shared_song, '2026-11-20T12:00:00Z'),
        (gen_random_uuid(), listener_one, owned_song, '2026-11-20T11:00:00Z'),
        (gen_random_uuid(), listener_two, shared_song, '2026-11-20T13:00:00Z');
    INSERT INTO public.play_events (id, user_id, song_id, played_at)
    VALUES (first_event, listener_one, shared_song, '2026-11-20T10:00:00Z')
    ON CONFLICT (id) DO NOTHING;
    SELECT COUNT(*) INTO result_count FROM public.play_events WHERE user_id = listener_one AND song_id = shared_song;
    IF result_count IS DISTINCT FROM 2 THEN RAISE EXCEPTION 'Duplicate events were counted or shared listens were lost'; END IF;
    SELECT COUNT(*) INTO result_count FROM public.play_events WHERE user_id = listener_two AND song_id = shared_song;
    IF result_count IS DISTINCT FROM 1 THEN RAISE EXCEPTION 'Shared track counts leaked between listeners'; END IF;
    SELECT COUNT(*) INTO result_count FROM public.play_events WHERE user_id = listener_one AND song_id = owned_song;
    IF result_count IS DISTINCT FROM 1 THEN RAISE EXCEPTION 'Uploaded listening history must come from play events'; END IF;
    IF (SELECT song_id FROM public.play_events WHERE user_id = listener_one GROUP BY song_id ORDER BY MAX(played_at) DESC LIMIT 1) IS DISTINCT FROM shared_song THEN
        RAISE EXCEPTION 'Recent history does not include shared tracks in the correct order';
    END IF;
    IF (SELECT song_id FROM public.play_events WHERE user_id = listener_one GROUP BY song_id ORDER BY COUNT(*) DESC LIMIT 1) IS DISTINCT FROM shared_song THEN
        RAISE EXCEPTION 'Most-listened history does not combine both kinds of audio';
    END IF;
    SELECT COUNT(DISTINCT song_id) INTO result_count FROM public.play_events WHERE user_id = listener_two;
    IF result_count <> 1 THEN RAISE EXCEPTION 'Private uploaded tracks leaked to another listener'; END IF;
    DELETE FROM public.audio_details WHERE song_id = owned_song;
    IF EXISTS (SELECT 1 FROM public.play_events WHERE song_id = owned_song) THEN
        RAISE EXCEPTION 'Listening history prevents normal deletion of an uploaded track';
    END IF;
END;
$$;
ROLLBACK;
