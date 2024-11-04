import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    homepageSongTitle: {
      fontFamily: "Outfit",
      fontSize: "16px",
      fontWeight: 600,
    },

    homepageSongArtist: {
      fontFamily: "Outfit",
      fontSize: "10px",
      fontWeight: 600,
    },

    audioPlayerSongTitle: {
      fontFamily: "Outfit",
      fontSize: "25px",
      fontWeight: 800,
    },
    AudioPlayerCurrentTimeAndDuration: {
      fontFamily: "monospace",
      fontSize: "16px",
      fontWeight: 400,
    },
  },
});

export default theme;
