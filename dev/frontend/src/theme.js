import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        text: {
            primary: '#595959',
            secondary: '#595959',
            disabled: '#595959',
            hint: '#595959'
        },
    },
    typography: {
        fontFamily: 'Noto Sans Jp',
        fontWeightBold: 700,
        h1: {
            fontWeight: 'bold',
        },
        h2: {
            fontWeight: 'bold',
        },
        h3: {
            fontWeight: 'bold',
        },
        h4: {
            fontWeight: 'bold',
        },
        h5: {
            fontWeight: 'bold',
        },
        body1: {
            fontWeight: 500,
        },
        button: {
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        },
    },
});

export default theme;
