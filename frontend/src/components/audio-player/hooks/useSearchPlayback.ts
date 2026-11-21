import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { refreshSearchQueue, SEARCH_QUEUE_REFRESH_TRACKS } from "../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../services/api";

const useSearchPlayback = () => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(userSelector)?.user_id;
    const session = useAppSelector(state => state.audioplayer.searchPlayback);
    const sessionId = session?.sessionId;
    const refreshSlot = Math.floor((session?.trackChanges ?? 0) / SEARCH_QUEUE_REFRESH_TRACKS);
    useEffect(() => {
        if (!sessionId || !userId) return;
        const controller = new AbortController();
        postApi("/api/fetchrandomsongs", { user_id: userId }, { signal: controller.signal }).then(response => {
            if (!controller.signal.aborted) dispatch(refreshSearchQueue({ sessionId, refreshSlot, songs: response.data.randomSongs }));
        }).catch(error => {
            if (!controller.signal.aborted) console.error("Unable to refresh search playback", error);
        });
        return () => controller.abort();
    }, [dispatch, userId, sessionId, refreshSlot]);
};

export default useSearchPlayback;
