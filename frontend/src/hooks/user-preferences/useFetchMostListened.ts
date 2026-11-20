import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors";
import { userSelector } from "../../redux/selectors/homepageSelectors";
import { postApi } from "../../services/api";
import { indexSongs } from "../../utils/songs";
import { setViewingSongList } from "../../redux/slices/audioPlayerSlice";
const useFetchMostListened = () => {
    const [mostListenedLoading, setMostListenedLoading] = useState(false);
    const [mostListenedError, setMostListenedError] = useState(false);
    const user = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const songsList = useAppSelector(viewingSongListSelector);
    useEffect(() => {
        const fetchMostListened = async () => {
            if (!user)
                return;
            try {
                setMostListenedLoading(true);
                setMostListenedError(false);
                const response = await postApi("/api/fetchMostListened", { user_id: user.user_id }, {
                    headers: { "Content-Type": "application/json" },
                });
                const refinedResponse = indexSongs(response.data.most_listened);
                dispatch(setViewingSongList(refinedResponse));
            }
            catch (error) {
                console.error("error fetching most listened", error);
                setMostListenedError(true);
            }
            finally {
                setMostListenedLoading(false);
            }
        };
        if (!songsList && user) {
            fetchMostListened();
        }
    }, [dispatch, user, songsList]);
    return { mostListenedLoading, mostListenedError };
};
export default useFetchMostListened;
