import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
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
    SignInHeading: {
      fontFamily: "Outfit",
      fontSize: "40px",
      fontWeight: 600,
    },
    SignInAndSignUpButton: {
      fontFamily: "Outfit",
      fontSize: "12px",
      fontWeight: 400,
    },
    ManFallingText: {
      fontFamily: "Anton",
      fontSize: "30px",
      fontWeight: "800px",
    },
    RedirectText: {
      fontFamily: "Outfit",
      fontSize: "20px",
      fontWeight: 600,
    },
    UploadSongText: {
      fontFamily: "Outfit",
      fontSize: "16px",
      fontWeight: 600,
    },
    UploadFileText: {
      fontFamily: "Outfit",
      fontSize: "15px",
      fontWeight: 500,
    },

    UploadFileStatusText: {
      fontFamily: "Outfit",
      fontSize: "13px",
      fontWeight: 400,
    },
    MenuItemText: {
      fontFamily: "Outfit",
      fontSize: "15px",
      fontWeight: 400,
    },

    UserWelcomeText: {
      fontFamily: "Outfit",
      fontSize: "25px",
      fontWeight: 700,
    },
    HomepageTitleText: {
      fontFamily: "Outfit",
      fontSize: "22px",
      fontWeight: 500,
    },
    recentlyPlayedText: {
      fontFamily: "Montserrat, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
    },

    CardTitle: {
      fontFamily: "Outfit",
      fontSize: "20px",
      fontWeight: 700,
    },
    CardArtist: {
      fontFamily: "Outfit",
      fontSize: "16px",
      fontWeight: 500,
    },
    CardContent: {
      fontFamily: "Outfit",
      fontSize: "15px",
      fontWeight: 400,
    },
  },
});

export default theme;
