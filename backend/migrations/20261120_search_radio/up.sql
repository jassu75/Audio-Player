CREATE OR REPLACE FUNCTION public.fetch_user_songs_randomly(userid text)
RETURNS SETOF public.audio_details
LANGUAGE sql
STABLE
AS $function$
    SELECT *
    FROM (
        SELECT DISTINCT ON (title) *
        FROM public.audio_details
        WHERE user_id = userid OR (user_id IS NULL AND source <> 'user')
        ORDER BY title, song_id
    ) AS distinct_songs
    ORDER BY RANDOM()
    LIMIT 50;
$function$;
