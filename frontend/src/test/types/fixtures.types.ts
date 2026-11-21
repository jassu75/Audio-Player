import type { HomepageState } from "../../redux/slices/types/homepageSlice.types";
import type { AudioPlayerState } from "../../redux/slices/types/audioPlayerSlice.types";
import type { UserPreferencesState } from "../../redux/slices/types/userPreferencesSlice.types";
export interface TestStateOverrides {
    homepage?: Partial<HomepageState>;
    audioplayer?: Partial<AudioPlayerState>;
    userPrefs?: Partial<UserPreferencesState>;
}
