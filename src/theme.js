import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        homepageSongTitle: {
            fontFamily: 'Outfit',
            fontSize: '16px',
            fontWeight: 600,
        },

         homepageSongArtist: {
            fontFamily: 'Outfit',
            fontSize: '10px',
            fontWeight: 600,
        },
    },
});

export default theme;
