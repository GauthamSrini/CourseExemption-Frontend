import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import "./horizontalNavbar.css";


// Define the theme
const theme = createTheme({
    palette: {
        mode: 'light', // Initially set to light mode
    },
});

// Define custom properties for light and dark modes
const darkModeProperties = {
    '--thumb-color': '#fff',
    '--background': '#182433',
    '--hover': '#9b5ae6',
    '--button': '#EAEAEA',
    '--card': '#D7C5DF',
    '--card-1': '#563763',
    '--card-2': '#6C6C6C',
    '--text-black': '#64718B',
    '--text-grey': '#909090',
    '--background-1': '#212121',
    '--background-2': '#151F2C',
    '--text-box': '#D7C5DF',
    '--button-text-color': '#FFFFFF',
    '--menu-text-hover': '#FFFFFF',
    '--card-text': '#FFFFFF',
    '--icon-hover-backgrd':'#6C6C6C',
    '--add-icon': '#FFFFFF',
    '--heading-crsExp':'#EAEAEA',

    '--backgroundNavSide':'#212121',
    '--contentbackground':'#2D2D2D',

    '--basicTextColor':'#EAEAEA',
    '--cardBackground':'#2D2D2D',
    '--buttonText':'#',
    '--borderDataGrid':'#FFFFFF',
    '--formBackground':'#2D2D2D',
    '--Bordercolor':'#25384F',
    '--Subheading' : '#8A97AB',
    '--primaryBlue':'#ffff',
    '--MainTitle' : '#ffff',
    '--secondaryBlue':'#066FD1',
    '--textFieldBackground' : '#151F2C'
};
const lightModeProperties = {
    '--thumb-color': '#61398F',
    '--background': '#FFFFFF',
    '--hover': '#8B5FBF',
    '--button': '#FBFBFB',
    '--card': '#D6C6E1',
    '--card-1': '#9A73B5',
    '--card-2': '#2B3674',
    '--text-black': '#4A4A4A',
    '--text-grey': '#878787',
    '--background-1': '#ebf2fa',
    '--background-2': '#F4F7FE',
    '--text-box': '#FFFFFF',
    '--button-text-color': '#FFFFFF',
    '--menu-text-hover': '#61398F',
    '--card-text': '#FFFFFF',
    '--icon-hover-backgrd':'#2B3674',
    '--add-icon': '#61398F',
    '--heading-crsExp':'#2B3674',
    
    '--backgroundNavSide':'#FBFBFB',
    '--contentbackground':'#e6ffff',

    '--basicTextColor':'black',
    '--cardBackground':'#FFFFFF',
    '--buttonText':'#',
    '--borderDataGrid':'#014f86',
    '--formBackground':'#Ffffff',
    '--primaryBlue':'#2B3674',
    '--secondaryBlue':'#066FD1',
    '--navIconDefault':'#8A97AB',
    '--lightBlue':'#D7E8F8',
    '--ReportChoiceBtn':'#3362CC',
    '--Bordercolor':'#DCE1E7',
    '--Subheading' : '#6C7A91',
    '--MainTitle' : '#2B3674',
    '--textFieldBackground' : '#FFFFFF'
};
// Set custom properties based on theme mode
const setCustomProperties = (mode) => {
    const root = document.documentElement;
    root.style.cssText = Object.entries(mode === 'dark' ? darkModeProperties : lightModeProperties)
        .map(([key, value]) => `${key}:${value};`).join('');
};

// Styled switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 60,
    height: 32,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 0,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 30 20"><path fill="${encodeURIComponent(
                    theme.palette.mode === 'dark' ? '#f5f3f7' : '#000000',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: 'var(--primaryBlue)', // Use the custom property
        width: 31,
        height: 31,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                theme.palette.mode === 'dark' ? 'red' : '#FFF',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        height:17,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : 'var(--navIconDefault)',
        borderRadius: 20 / 2,
    },
}));

export default function CustomizedSwitches() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Set initial mode to light and update custom properties
        setCustomProperties('light');
    }, []); // Run only on initial render

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        const mode = newMode ? 'dark' : 'light';
        setCustomProperties(mode); // Update custom properties based on theme mode
    };

    return (
        <ThemeProvider theme={theme}>
            <FormGroup>
                <FormControlLabel style={{ margin: 0 }}
                    control={
                        <MaterialUISwitch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                        />
                    }
                />
            </FormGroup>
        </ThemeProvider>
    );
}
