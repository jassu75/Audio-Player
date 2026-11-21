BEGIN;
ALTER TABLE public.play_events DROP CONSTRAINT IF EXISTS play_events_user_id_key;
ALTER TABLE public.play_events DROP CONSTRAINT IF EXISTS play_events_song_id_fkey;
ALTER TABLE public.play_events ADD CONSTRAINT play_events_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.audio_details(song_id) ON UPDATE RESTRICT ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS play_events_user_song_played_idx ON public.play_events (user_id, song_id, played_at DESC);
DROP VIEW IF EXISTS public.user_song_activity;
COMMIT;
